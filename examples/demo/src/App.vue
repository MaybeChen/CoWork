<script setup>
import { computed, reactive, ref } from 'vue'
import { A2UIRenderer } from 'coworkUI'
import { streamChat } from './modules/network/chatStreamClient'
import { streamChatByWs } from './modules/network/chatWsStreamClient'
import { createTurn, applyMessage } from './modules/message/messageApplier'
import { applyObjectsProgressively } from './modules/message/progressiveScheduler'
import { useAutoScroll } from './modules/ui/useAutoScroll'

const endpoint = '/api/chat/stream'
const wsEndpoint = '/ws/debug'

const message = ref('')
const streamMode = ref('default')
const loading = ref(false)
const error = ref('')
const turns = ref([])

const { contentRef, scheduleAutoScroll } = useAutoScroll()
const hasTurns = computed(() => turns.value.length > 0)
const centerTurns = computed(() => turns.value.filter((turn) => turn.mode !== 'ws_stream'))

const applyMessageFn = (turn, payload) => applyMessage(turn, payload, { onChanged: () => scheduleAutoScroll({ force: true }) })

async function send(turn, payload) {
  loading.value = true
  turn.streaming = true
  error.value = ''

  await streamChat({
    endpoint,
    payload,
    onObjects: async (objects) => {
      await applyObjectsProgressively(turn, objects, { applyMessageFn })
    },
    onError: (e) => {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    },
  })

  turn.streaming = false
  loading.value = false
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
      scheduleAutoScroll({ force: true })
    },
    onObjects: async (objects) => {
      await applyObjectsProgressively(turn, objects, { applyMessageFn })
    },
    onError: (e) => {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    },
  })

  turn.streaming = false
  loading.value = false
}

async function submit() {
  const text = message.value.trim()
  if (!text || loading.value) return

  const turn = reactive(createTurn(text, streamMode.value))
  turns.value.push(turn)
  scheduleAutoScroll({ force: true })

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
        <section class="panel question-panel">
          <h3>输入历史</h3>
          <ul v-if="hasTurns" class="question-list">
            <li v-for="turn in turns" :key="`q-${turn.id}`">
              <template v-if="turn.mode === 'ws_stream'">
                <p class="question-label question-label-full">原问题</p>
                <p class="question-full">{{ turn.userText }}</p>
                <p class="question-label question-label-progress">渐进流式</p>
                <p class="question-progress">{{ turn.streamPreviewText || '正在渐进输出...' }}</p>
              </template>
              <template v-else>
                {{ turn.userText }}
              </template>
            </li>
          </ul>
          <div v-else class="question-empty">
            <p>问题输入后会展示在这里。</p>
          </div>
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
              <div v-if="turn.streaming" class="streaming-tip">渲染中…（渐进更新）</div>

              <div v-if="turn.mode === 'ws_stream'" class="bubble bubble-user">
                {{ turn.userText }}
              </div>

              <div v-if="turn.mode === 'ws_stream'" class="bubble bubble-stream-preview">
                {{ turn.streamPreviewText || '正在渐进输出...' }}
              </div>

              <div class="bubble bubble-assistant">
                <template v-if="Object.values(turn.surfaces).some((s) => s.ready)">
                  <article v-for="surface in Object.values(turn.surfaces).filter((s) => s.ready)" :key="surface.id" class="surface">
                    <A2UIRenderer :surface="surface" :data-model="turn.dataModels[surface.id] || {}" :on-action="(action) => handleAction(turn, action)" />
                  </article>
                </template>
                <template v-else>
                  <span class="placeholder">正在等待 beginRendering（已缓冲更新）...</span>
                </template>
              </div>
            </div>
          </div>
          <div v-else-if="hasTurns" class="hero">
            <h1>卡片结果展示区</h1>
            <p>流式问题与渐进输出仅在左侧展示。</p>
          </div>
          <p v-if="error" class="error">Error: {{ error }}</p>
        </section>
      </section>

    </section>
  </main>
</template>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.14) 0%, transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(244, 114, 182, 0.1) 0%, transparent 32%),
    #020617;
  color: #e5e7eb;
}

.global-header {
  height: 52px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 16px;
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(8px);
}

.brand {
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: linear-gradient(100deg, #e2e8f0 0%, #c4b5fd 55%, #f5d0fe 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 20px rgba(196, 181, 253, 0.3);
}

.workspace {
  flex: 1;
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 8px;
  padding: 10px;
  overflow: hidden;
  background:
    radial-gradient(circle, rgba(148, 163, 184, 0.2) 1px, transparent 1px) 0 0 / 12px 12px,
    linear-gradient(135deg, #020617 0%, #0b1220 45%, #0f172a 100%);
}

.sidebar,
.center {
  min-height: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(2, 6, 23, 0.72);
  overflow: hidden;
  overflow-x: hidden;
}

.panel {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 10px;
  background: rgba(2, 6, 23, 0.82);
  box-shadow:
    inset 0 0 0 1px rgba(15, 23, 42, 0.5),
    0 10px 30px rgba(2, 6, 23, 0.5);
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
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.88);
  padding: 12px;
}

.question-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.question-list li {
  font-size: 12px;
  line-height: 1.5;
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.16);
  white-space: pre-wrap;
}

.question-full,
.question-progress {
  margin: 0;
}

.question-label {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.question-label-full {
  color: #c4b5fd;
}

.question-label-progress {
  color: #86efac;
  margin-top: 6px;
}

.question-full {
  color: #ede9fe;
}

.question-progress {
  margin-top: 0;
  padding-top: 6px;
  border-top: 1px dashed rgba(255, 255, 255, 0.18);
  color: #dcfce7;
}

.question-empty p {
  margin: 0 0 10px;
  color: rgba(203, 213, 225, 0.8);
  font-size: 13px;
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
  font-size: 34px !important;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: lowercase;
  background: linear-gradient(120deg, #60a5fa 0%, #34d399 45%, #f59e0b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  margin: 0;
  color: rgba(203, 213, 225, 0.8);
}

.hero-subtitle {
  font-size: clamp(13px, 1.35vw, 16px);
  letter-spacing: 0.02em;
  color: rgba(148, 163, 184, 0.95) !important;
}

.conversation {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 12px;
}

.turn {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bubble-assistant {
  width: 80%;
  min-width: 640px;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  border: none;
  background: #060b18;
  padding: 0;
}

.streaming-tip {
  color: rgba(244, 114, 182, 0.92);
  font-size: 12px;
  width: 80%;
  min-width: 640px;
  max-width: 1080px;
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

.composer {
  padding: 8px 0 0;
}

.composer-sidebar {
  margin-top: auto;
  padding-top: 0;
}

.composer-inner {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.92);
  display: flex;
  align-items: center;
  padding: 8px;
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
  color: #f9fafb;
  padding: 10px 12px;
}

.mode-select {
  height: 34px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: #121720;
  color: #ffffff;
  margin-right: 6px;
}

.composer-inner button {
  height: 34px;
  min-width: 72px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: linear-gradient(120deg, rgba(30, 41, 59, 0.92), rgba(51, 65, 85, 0.92));
  color: #f9fafb;
  cursor: pointer;
  box-shadow: 0 0 14px rgba(148, 163, 184, 0.18);
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
  background: #f472b6;
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
