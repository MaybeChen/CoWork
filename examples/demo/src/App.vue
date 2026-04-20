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
                    <span class="raw-text">{{ line }}</span>
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
          <transition name="output-panel">
            <section v-if="outputPanelVisible && hasActiveOutput" class="output-overlay">
              <header class="output-overlay-header">
                <strong>输出预览</strong>
                <button type="button" class="output-close" @click="closeOutputPanel">关闭</button>
              </header>
              <section class="output-card">
                <h4>Raw</h4>
                <div ref="rawContentRef" class="output-card-content">
                  <p v-for="(line, index) in outputRawLines" :key="`${activeOutputTurnId}-raw-${index}`" class="raw-line">{{ line }}</p>
                </div>
              </section>
              <section class="output-card">
                <h4>Parsed</h4>
                <pre ref="parsedContentRef" class="output-card-content">{{ outputParsedText }}</pre>
              </section>
            </section>
          </transition>
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
	              <div v-if="turn.streaming" class="streaming-tip">渲染中…（渐进更新）</div>
                <div v-if="Object.values(turn.surfaces).some((s) => s.ready)" class="turn-result">
                  <div class="bubble bubble-assistant">
                    <article v-for="surface in Object.values(turn.surfaces).filter((s) => s.ready)" :key="surface.id" class="surface">
                      <A2UIRenderer :surface="surface" :data-model="turn.dataModels[surface.id] || {}" :on-action="(action) => handleAction(turn, action)" />
                    </article>
                  </div>
                  <div class="result-toolbar">
                    <button
                      type="button"
                      class="view-output-btn"
                      :disabled="loading || turn.streaming"
                      @click="openOutputPanel(turn)"
                    >
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
.page {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 18% 14%, rgba(124, 151, 255, 0.12) 0%, transparent 34%),
    radial-gradient(circle at 84% 8%, rgba(99, 216, 255, 0.08) 0%, transparent 30%),
    linear-gradient(180deg, #08111f 0%, #0b1220 52%, #0e1728 100%);
  color: #b8c7e6;
  overflow: hidden;
}

.page::before,
.page::after {
  content: '';
  position: absolute;
  inset: -20%;
  pointer-events: none;
}

.page::before {
  background:
    radial-gradient(circle at 14% 18%, rgba(124, 151, 255, 0.16) 0%, transparent 30%),
    radial-gradient(circle at 82% 14%, rgba(99, 216, 255, 0.1) 0%, transparent 26%);
  filter: blur(46px);
  opacity: 0.35;
}

.page::after {
  background:
    radial-gradient(circle at 66% 82%, rgba(124, 151, 255, 0.09) 0%, transparent 34%),
    radial-gradient(circle at 30% 48%, rgba(99, 216, 255, 0.08) 0%, transparent 38%);
  filter: blur(42px);
  opacity: 0.3;
}

.global-header,
.workspace {
  position: relative;
  z-index: 1;
}

.global-header {
  height: 52px;
  border-bottom: 1px solid rgba(138, 164, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  background: rgba(8, 17, 31, 0.82);
  backdrop-filter: blur(8px);
}

.brand {
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: linear-gradient(102deg, #e8f0ff 0%, #b8c7e6 45%, #7c97ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 12px rgba(124, 151, 255, 0.18);
}

.workspace {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  padding: 20px;
  overflow: hidden;
  background:
    radial-gradient(circle, rgba(138, 164, 255, 0.1) 1px, transparent 1px) 0 0 / 18px 18px,
    linear-gradient(160deg, rgba(8, 17, 31, 0.7) 0%, rgba(11, 18, 32, 0.48) 55%, rgba(14, 23, 40, 0.62) 100%);
}

.sidebar,
.center {
  min-height: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 16px;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(130, 160, 255, 0.12);
  background: linear-gradient(180deg, rgba(11, 18, 32, 0.92), rgba(13, 21, 38, 0.9));
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden;
  overflow-x: hidden;
}

.panel {
  border: 1px solid rgba(138, 164, 255, 0.14);
  border-radius: 16px;
  padding: 16px;
  background: linear-gradient(180deg, rgba(11, 18, 32, 0.92), rgba(13, 21, 38, 0.9));
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.panel h3 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #d6d8dd;
}

.content {
  overflow: auto;
  flex: 1;
  min-height: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

.center {
  min-width: 0;
  display: flex;
}

.question-panel {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border-radius: 16px;
  border: none;
  background: transparent;
  padding: 16px;
}

.question-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.question-item {
  font-family: 'JetBrains Mono', 'Fira Code', 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  color: #4ade80 !important;
  font-size: 13px;
  line-height: 1.55;
}

.question-item .prompt,
.question-item .question-text {
  color: #4ade80;
}

.terminal-line {
  margin: 0;
  display: flex;
  align-items: flex-start;
  white-space: pre-wrap;
}

.prompt {
  margin-right: 8px;
  flex: 0 0 auto;
}

.question-text {
  flex: 1;
}

.terminal-wait {
  margin-top: 6px;
  color: #7f90b4;
}

.cursor {
  display: inline-block;
  animation: cursor-blink 900ms steps(1, end) infinite;
}

@keyframes cursor-blink {
  0%,
  45% {
    opacity: 1;
  }
  46%,
  100% {
    opacity: 0;
  }
}

.hero {
  min-height: 100%;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 10px;
}

.hero h1 {
  margin: 0;
  font-size: clamp(22px, 2vw, 30px);
}

.hero-brand {
  font-size: clamp(28px, 2.2vw, 32px) !important;
  font-weight: 700;
  letter-spacing: 0.06em;
  background: linear-gradient(112deg, #e8f0ff 0%, #b8c7e6 60%, #7c97ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  margin: 0;
  color: #b8c7e6;
}

.hero-subtitle {
  font-size: clamp(13px, 1.2vw, 15px);
  letter-spacing: 0.02em;
  color: #7f90b4 !important;
}

.conversation {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 12px;
}

.turn {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.turn-result {
  width: 90%;
  min-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.bubble-assistant {
  width: 100%;
  border-radius: 22px;
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.streaming-tip {
  color: rgba(127, 144, 180, 0.9);
  font-size: 12px;
  width: 90%;
  min-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.surface {
  margin-top: 0;
  width: 100%;
  padding: 0;
  transform-origin: top center;
  animation: surface-grow-in 280ms cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes surface-grow-in {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.error {
  color: #fca5a5;
}

.result-toolbar {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(138, 164, 255, 0.2);
  display: flex;
  justify-content: flex-start;
}

.view-output-btn {
  height: 24px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: #ffffff;
  padding: 0 10px;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}

.view-output-btn:disabled {
  cursor: not-allowed;
  color: rgba(220, 230, 255, 0.45);
  border-color: rgba(138, 164, 255, 0.12);
  background: rgba(14, 23, 40, 0.45);
}

.composer {
  padding: 8px 0 0;
}

.composer-sidebar {
  margin-top: auto;
  padding-top: 0;
  position: relative;
}

.composer-inner {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(138, 164, 255, 0.14);
  background: rgba(11, 18, 32, 0.9);
  display: flex;
  align-items: center;
  padding: 10px;
}

.output-overlay {
  position: absolute;
  inset: 0;
  height: 100%;
  border-radius: 14px;
  border: 1px solid rgba(138, 164, 255, 0.14);
  background: rgba(11, 18, 32, 0.9);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 20;
}

.output-overlay-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #4ade80;
}

.output-close {
  border: 1px solid rgba(138, 164, 255, 0.14);
  background: rgba(11, 18, 32, 0.9);
  color: #4ade80;
  border-radius: 8px;
  height: 28px;
  padding: 0 10px;
  cursor: pointer;
}

.output-card {
  border: 1px solid rgba(138, 164, 255, 0.14);
  background: rgba(11, 18, 32, 0.9);
  border-radius: 14px;
  padding: 10px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.output-card h4 {
  margin: 0 0 8px;
  color: #4ade80;
  font-size: 12px;
}

.output-card-content {
  margin: 0;
  flex: 1;
  min-height: 0;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: #4ade80;
  font-size: 12px;
  line-height: 1.6;
}

.raw-line {
  margin: 0 0 10px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.raw-line:last-child {
  margin-bottom: 0;
}

.raw-index {
  flex: 0 0 auto;
  color: #4ade80;
}

.raw-text {
  white-space: pre-wrap;
  word-break: break-word;
}

.output-panel-enter-active,
.output-panel-leave-active {
  transition: opacity 220ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: bottom center;
}

.output-panel-enter-from,
.output-panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.content,
.sidebar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.content::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track,
.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.content::-webkit-scrollbar-thumb,
.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 999px;
}

.composer-inner input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #e8f0ff;
  padding: 10px 12px;
  font-family: 'JetBrains Mono', 'Fira Code', 'SFMono-Regular', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.composer-inner input::placeholder {
  color: rgba(127, 144, 180, 0.9);
}

.mode-select {
  height: 34px;
  border-radius: 8px;
  border: 1px solid rgba(138, 164, 255, 0.14);
  background: rgba(14, 23, 40, 0.9);
  color: #e8f0ff;
  margin-right: 6px;
}

.composer-inner button {
  height: 34px;
  min-width: 72px;
  border: 1px solid rgba(138, 164, 255, 0.16);
  border-radius: 10px;
  background: linear-gradient(120deg, rgba(17, 27, 46, 0.92), rgba(23, 38, 61, 0.92));
  color: #e8f0ff;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
}

.sending {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sending-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #63d8ff;
  animation: sending-pulse 1s ease-in-out infinite;
}

@keyframes sending-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

</style>
