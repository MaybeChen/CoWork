<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { A2UIRenderer } from 'coworkUI'
import { streamChat } from './modules/network/chatStreamClient'
import { streamChatByWs } from './modules/network/chatWsStreamClient'
import { createTurn, applyMessage } from './modules/message/messageApplier'
import { applyObjectsProgressively } from './modules/message/progressiveScheduler'
import { useAutoScroll } from './modules/ui/useAutoScroll'

const endpoint = '/api/chat/stream'
const wsEndpoint = '/api/chat/ws/stream'

const message = ref('')
const streamMode = ref('default')
const loading = ref(false)
const error = ref('')
const turns = ref([])

const { contentRef, scheduleAutoScroll } = useAutoScroll()
const { contentRef: questionPanelRef, scheduleAutoScroll: scheduleQuestionAutoScroll } = useAutoScroll({
  mutationFilter: (mutations) => mutations.some((mutation) => (mutation.addedNodes?.length || 0) > 0 || mutation.type === 'characterData'),
})
const hasTurns = computed(() => turns.value.length > 0)
const centerTurns = computed(() => turns.value)
const outputPanelVisible = ref(false)
const activeOutputTurnId = ref('')
const outputRawLines = ref([])
const outputParsedText = ref('')
const rawContentRef = ref(null)
const parsedContentRef = ref(null)
const outputSnapshots = reactive({})

const hasActiveOutput = computed(() => Boolean(activeOutputTurnId.value))

const applyMessageFn = (turn, payload) => applyMessage(turn, payload, { onChanged: () => scheduleAutoScroll({ force: true }) })

function stringifyPretty(value) {
  const circular = new WeakSet()
  return JSON.stringify(
    value,
    (key, currentValue) => {
      if (typeof currentValue === 'function') return '[Function]'
      if (currentValue && typeof currentValue === 'object') {
        if (circular.has(currentValue)) return '[Circular]'
        circular.add(currentValue)
      }
      return currentValue
    },
    2,
  )
}

function buildParsedPayload(turn) {
  return {
    turnId: turn.id,
    mode: turn.mode,
    surfaces: Object.values(turn.surfaces),
    dataModels: turn.dataModels,
  }
}

function ensureOutputSnapshot(turn) {
  if (!outputSnapshots[turn.id]) {
    outputSnapshots[turn.id] = {
      rawLines: [],
      parsedText: '',
      lastWsPreviewText: '',
    }
  }
  return outputSnapshots[turn.id]
}

function scrollOutputToBottom() {
  nextTick(() => {
    const rawEl = rawContentRef.value
    if (rawEl) rawEl.scrollTop = rawEl.scrollHeight
    const parsedEl = parsedContentRef.value
    if (parsedEl) parsedEl.scrollTop = parsedEl.scrollHeight
  })
}

function syncOutputPanel(turn) {
  const snapshot = ensureOutputSnapshot(turn)
  snapshot.parsedText = stringifyPretty(buildParsedPayload(turn))
  if (activeOutputTurnId.value === turn.id) {
    outputRawLines.value = [...snapshot.rawLines]
    outputParsedText.value = snapshot.parsedText
    scrollOutputToBottom()
  }
}

function appendRawLine(turn, line) {
  if (!line) return
  const normalized = String(line).replace(/\\/g, '')
  const cleaned = normalized.trimEnd()
  if (!cleaned) return
  const snapshot = ensureOutputSnapshot(turn)
  snapshot.rawLines.push(cleaned)
  if (activeOutputTurnId.value === turn.id) {
    outputRawLines.value = [...snapshot.rawLines]
    scrollOutputToBottom()
  }
}

function appendWsRawLine(turn, previewText) {
  const snapshot = ensureOutputSnapshot(turn)
  const prev = snapshot.lastWsPreviewText || ''
  const next = previewText || ''
  snapshot.lastWsPreviewText = next
  if (!next) return
  const delta = next.startsWith(prev) ? next.slice(prev.length) : next
  if (delta) appendRawLine(turn, delta)
}

function appendObjectsRawLines(turn, objects) {
  for (const item of objects || []) {
    appendRawLine(turn, stringifyPretty(item))
  }
}

function getRawLineToneClass(line) {
  const raw = String(line || '').toLowerCase()
  if (raw.includes('datamodelupdate')) return 'raw-text-data-model'
  return 'raw-text-surface'
}

function openOutputPanel(turn) {
  if (!turn) return
  const snapshot = ensureOutputSnapshot(turn)
  snapshot.parsedText = stringifyPretty(buildParsedPayload(turn))
  activeOutputTurnId.value = turn.id
  outputRawLines.value = [...snapshot.rawLines]
  outputParsedText.value = snapshot.parsedText
  outputPanelVisible.value = true
  scrollOutputToBottom()
}

function closeOutputPanel() {
  outputPanelVisible.value = false
}

watch(
  [outputPanelVisible, activeOutputTurnId, () => outputRawLines.value.length, outputParsedText],
  ([visible]) => {
    if (!visible) return
    scrollOutputToBottom()
  },
  { flush: 'post' },
)

async function send(turn, payload) {
  loading.value = true
  turn.streaming = true
  error.value = ''

  await streamChat({
    endpoint,
    payload,
    onObjects: async (objects) => {
      await applyObjectsProgressively(turn, objects, { applyMessageFn })
      appendObjectsRawLines(turn, objects)
      syncOutputPanel(turn)
      openOutputPanel(turn)
    },
    onError: (e) => {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    },
  })

  turn.streaming = false
  loading.value = false
  closeOutputPanel()
}

async function sendByWsStream(turn, payload) {
  loading.value = true
  turn.streaming = true
  error.value = ''
  turn.streamPreviewText = ''

  await streamChatByWs({
    endpoint: wsEndpoint,
    payload,
    onPreview: (text) => {
      turn.streamPreviewText = text
      appendWsRawLine(turn, text)
      syncOutputPanel(turn)
      scheduleAutoScroll({ force: true })
      scheduleQuestionAutoScroll({ force: true })
    },
    onObjects: async (objects) => {
      await applyObjectsProgressively(turn, objects, { applyMessageFn })
      syncOutputPanel(turn)
      openOutputPanel(turn)
    },
    onError: (e) => {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    },
  })

  turn.streaming = false
  loading.value = false
  closeOutputPanel()
}

async function submit() {
  const text = message.value.trim()
  if (!text || loading.value) return

  const turn = reactive(createTurn(text, streamMode.value))
  turns.value.push(turn)
  scheduleAutoScroll({ force: true })
  scheduleQuestionAutoScroll({ force: true })

  if (streamMode.value === 'ws_stream') {
    await sendByWsStream(turn, { message: text })
  } else {
    await send(turn, { message: text })
  }
  message.value = ''
}

async function handleAction(turn, action) {
  await send(turn, { message: JSON.stringify({ userAction: action }) })
}
</script>

<template>
  <main class="page">
    <header class="global-header">
      <div class="brand">CoWorker</div>
      <RouterLink class="nav-link" to="/">Home</RouterLink>
    </header>

    <section class="workspace">
      <aside class="sidebar left">
        <transition name="output-panel">
          <section v-if="outputPanelVisible && hasActiveOutput" class="output-overlay">
            <header class="output-overlay-header">
              <strong>输出预览</strong>
              <button type="button" class="output-close" @click="closeOutputPanel">关闭</button>
            </header>
            <section class="output-card">
              <h4>Raw</h4>
              <div ref="rawContentRef" class="output-card-content">
                <p v-for="(line, index) in outputRawLines" :key="`${activeOutputTurnId}-raw-${index}`" class="raw-line">
                  <span class="raw-index">{{ index + 1 }}.</span>
                  <span :class="['raw-text', getRawLineToneClass(line)]">{{ line }}</span>
                </p>
              </div>
            </section>
            <section class="output-card">
              <h4>Parsed</h4>
              <pre ref="parsedContentRef" class="output-card-content">{{ outputParsedText }}</pre>
            </section>
          </section>
        </transition>
        <section ref="questionPanelRef" class="panel question-panel">
          <ul v-if="hasTurns" class="question-list">
            <li v-for="turn in turns" :key="`q-${turn.id}`" class="question-item">
              <p class="terminal-line">
                <span class="prompt">&gt;</span>
                <span class="question-text">{{ turn.mode === 'ws_stream' ? turn.streamPreviewText : turn.userText }}</span>
              </p>
            </li>
          </ul>
          <p v-if="!loading" class="terminal-line terminal-wait question-item">
            <span class="prompt">&gt;</span>
            <span class="cursor">|</span>
          </p>
        </section>

        <footer class="composer composer-sidebar">
          <form class="composer-inner" @submit.prevent="submit">
            <select v-model="streamMode" :disabled="loading" class="mode-select">
              <option value="default">非流式</option>
              <option value="ws_stream">流式</option>
            </select>
            <input
              v-model="message"
              placeholder="请输入问题，例如：查询故障工单并给出分析..."
              :disabled="loading"
            />
            <button type="submit" :disabled="loading || !message.trim()">
              <span v-if="loading" class="sending">
                <span class="sending-dot" />
                生成中
              </span>
              <span v-else>发送</span>
            </button>
          </form>
        </footer>
      </aside>

      <section class="center">
        <section ref="contentRef" class="content panel">
          <div v-if="!hasTurns" class="hero">
            <h1 class="hero-brand">无形之界，无限之能</h1>
            <p class="hero-subtitle">界面随需而生，协作自由生长</p>
          </div>

          <div v-if="centerTurns.length" class="conversation">
            <div v-for="turn in centerTurns" :key="turn.id" class="turn">
              <div v-if="turn.streaming" class="streaming-tip" aria-live="polite">
                <span class="streaming-tip-core">
                  <span class="streaming-ping" />
                  <span class="streaming-label">渲染中</span>
                  <span class="streaming-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>
                <span class="streaming-scanline" />
              </div>
              <div v-if="Object.values(turn.surfaces).some((s) => s.ready)" class="turn-result">
                <div class="bubble bubble-assistant">
                  <article v-for="surface in Object.values(turn.surfaces).filter((s) => s.ready)" :key="surface.id" class="surface">
                    <A2UIRenderer :surface="surface" :data-model="turn.dataModels[surface.id] || {}" :on-action="(action) => handleAction(turn, action)" />
                  </article>
                </div>
                <div v-if="!turn.streaming" class="result-toolbar">
                  <button type="button" class="view-output-btn" @click="openOutputPanel(turn)">
                    查看输出
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="hasTurns" class="hero">
            <h1 class="hero-brand">无形之界，无限之能</h1>
            <p class="hero-subtitle">界面随需而生，协作自由生长</p>
          </div>
          <p v-if="error" class="error">Error: {{ error }}</p>
        </section>
      </section>

    </section>
  </main>
</template>

<style scoped>
.page { height: 100vh; display: flex; flex-direction: column; background: linear-gradient(180deg, #f8fbff, #eef3fa); color: #334155; overflow: hidden; }
.global-header { height: 52px; border-bottom: 1px solid #d7e3f3; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: rgba(255,255,255,.86); backdrop-filter: blur(8px); }
.brand { font-weight: 700; letter-spacing: .08em; text-transform: uppercase; background: linear-gradient(102deg, #1d4ed8 0%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.nav-link { color: #1e3a8a; text-decoration: none; font-size: 12px; border: 1px solid #bfdbfe; background: #eff6ff; padding: 6px 10px; border-radius: 8px; }
.nav-link:hover { background: #dbeafe; }
.workspace { flex: 1; display: grid; grid-template-columns: 1fr 2fr; gap: 16px; padding: 16px; overflow: hidden; }
.sidebar, .center { min-height: 0; }
.sidebar { display: flex; flex-direction: column; gap: 12px; padding: 12px; border-radius: 16px; border: 1px solid #dbe4f3; background: #ffffff; box-shadow: 0 8px 20px rgba(148,163,184,.14); position: relative; font-size: 12px; }
.panel { border: 1px solid #dbe4f3; border-radius: 14px; padding: 14px; background: #ffffff; }
.content { overflow: auto; flex: 1; min-height: 0; border: none; background: transparent; box-shadow: none; }
.center { min-width: 0; display: flex; }
.question-panel { flex: 1; min-height: 0; overflow: auto; border: none; background: transparent; }
.question-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.question-item { font-family: 'JetBrains Mono', monospace; color: #0f766e; font-size: 12px; line-height: 1.55; }
.question-item .prompt, .question-item .question-text { color: #0f766e; }
.terminal-line { margin: 0; display: flex; align-items: flex-start; white-space: pre-wrap; }
.prompt { margin-right: 8px; }
.question-text { flex: 1; }
.terminal-wait { color: #94a3b8; }
.cursor { display: inline-block; animation: cursor-blink 900ms steps(1,end) infinite; }
@keyframes cursor-blink { 0%,45%{opacity:1;}46%,100%{opacity:0;} }
.hero { min-height: 100%; display: grid; place-content: center; text-align: center; gap: 10px; }
.hero-brand { margin: 0; font-size: 32px; background: linear-gradient(90deg, #60a5fa 0%, #22d3ee 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero-subtitle { margin: 0; color: #64748b; }
.conversation { display: flex; flex-direction: column; gap: 42px; padding-bottom: 12px; }
.turn { display: flex; flex-direction: column; gap: 10px; }
.turn-result, .streaming-tip { width: 92%; min-width: 640px; margin: 0 auto; }
.turn-result { background: #ffffff; border: 1px solid #dbe4f3; border-radius: 16px; padding: 12px; box-shadow: 0 6px 16px rgba(148,163,184,.12); }
.bubble-assistant { width: 100%; background: transparent; }
.streaming-tip { border: 1px solid #bfdbfe; border-radius: 12px; padding: 10px 12px; position: relative; overflow: hidden; background: linear-gradient(135deg, #eff6ff, #f8fafc); box-shadow: inset 0 0 0 1px rgba(59,130,246,.08); }
.streaming-tip-core { display: inline-flex; align-items: center; gap: 8px; position: relative; z-index: 1; }
.streaming-ping { width: 9px; height: 9px; border-radius: 999px; background: #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,.35); animation: streaming-pulse 1.25s ease-in-out infinite; }
.streaming-label { font-size: 12px; letter-spacing: .08em; color: #1e3a8a; }
.streaming-dots { display: inline-flex; gap: 4px; }
.streaming-dots i { width: 4px; height: 4px; border-radius: 999px; background: #60a5fa; animation: streaming-dot-wave 1s ease-in-out infinite; }
.streaming-dots i:nth-child(2){animation-delay:120ms;} .streaming-dots i:nth-child(3){animation-delay:240ms;}
.streaming-scanline { position: absolute; inset: 0; background: linear-gradient(115deg, transparent 0%, rgba(59,130,246,.05) 48%, transparent 100%); transform: translateX(-120%); animation: streaming-scan 2.2s linear infinite; }
@keyframes streaming-pulse { 0%,100%{transform:scale(.85);opacity:.8;}50%{transform:scale(1.15);opacity:1;} }
@keyframes streaming-dot-wave { 0%,100%{transform:translateY(0);opacity:.45;}50%{transform:translateY(-3px);opacity:1;} }
@keyframes streaming-scan { 0%{transform:translateX(-120%);}100%{transform:translateX(120%);} }
.surface { width: 100%; }
.error { color: #dc2626; }
.result-toolbar { margin-top: 10px; padding-top: 10px; border-top: 1px solid #e2e8f0; }
.view-output-btn, .output-close { height: 28px; border-radius: 8px; border: 1px solid #bfdbfe; background: #eff6ff; color: #1e3a8a; padding: 0 10px; cursor: pointer; }
.composer { padding-top: 6px; }
.composer-sidebar { margin-top: auto; position: relative; }
.composer-inner { width: 100%; border-radius: 12px; border: 1px solid #dbe4f3; background: #fff; display: flex; align-items: center; padding: 8px; }
.output-overlay { position: absolute; inset: 0; border-radius: 14px; border: 1px solid #dbe4f3; background: #fff; box-shadow: 0 12px 28px rgba(148,163,184,.2); padding: 12px; display: flex; flex-direction: column; gap: 10px; z-index: 20; }
.output-overlay-header { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #1e3a8a; }
.output-card { border: 1px solid #dbe4f3; background: #f8fbff; border-radius: 12px; padding: 10px; flex: 1; min-height: 0; display: flex; flex-direction: column; }
.output-card h4 { margin: 0 0 8px; color: #1e3a8a; font-size: 12px; }
.output-card-content { margin: 0; flex: 1; min-height: 0; overflow: auto; white-space: pre-wrap; word-break: break-word; color: #0f766e; font-size: 12px; line-height: 1.6; }
.raw-line { margin: 0 0 8px; display: flex; gap: 8px; }
.raw-index { color: #94a3b8; }
.raw-text-data-model { color: #b45309; }
.output-panel-enter-active, .output-panel-leave-active { transition: opacity 220ms ease, transform 260ms cubic-bezier(0.22,1,0.36,1); }
.output-panel-enter-from, .output-panel-leave-to { opacity: 0; transform: translateY(8px) scale(.98); }
.content, .sidebar { scrollbar-width: thin; scrollbar-color: rgba(148,163,184,.7) transparent; }
.content::-webkit-scrollbar, .sidebar::-webkit-scrollbar { width: 6px; }
.content::-webkit-scrollbar-thumb, .sidebar::-webkit-scrollbar-thumb { background: rgba(148,163,184,.7); border-radius: 999px; }
.composer-inner input { flex: 1; border: none; outline: none; background: transparent; color: #0f172a; padding: 10px 12px; font-family: 'JetBrains Mono', monospace; }
.composer-inner input::placeholder { color: #94a3b8; }
.mode-select { height: 34px; border-radius: 8px; border: 1px solid #dbe4f3; background: #fff; color: #334155; margin-right: 6px; }
.composer-inner button { height: 34px; min-width: 72px; border: 1px solid #bfdbfe; border-radius: 10px; background: #eff6ff; color: #1e3a8a; cursor: pointer; }
.sending { display: inline-flex; align-items: center; gap: 6px; }
.sending-dot { width: 8px; height: 8px; border-radius: 999px; background: #3b82f6; animation: sending-pulse 1s ease-in-out infinite; }
@keyframes sending-pulse { 0%,100%{opacity:.35;transform:scale(.85);}50%{opacity:1;transform:scale(1);} }
</style>
