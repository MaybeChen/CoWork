<script setup>
import { computed, reactive, ref } from 'vue'
import A2UIRenderer from './components/A2UIRenderer.vue'
import { streamChat } from './modules/network/chatStreamClient'
import { createTurn, applyMessage } from './modules/message/messageApplier'
import { applyObjectsProgressively } from './modules/message/progressiveScheduler'
import { useAutoScroll } from './modules/ui/useAutoScroll'

const endpoint = '/api/chat/stream'

const message = ref('')
const loading = ref(false)
const error = ref('')
const turns = ref([])
const expandedUserTurns = ref(new Set())

const { contentRef, scheduleAutoScroll } = useAutoScroll()
const hasTurns = computed(() => turns.value.length > 0)

const applyMessageFn = (turn, payload) => applyMessage(turn, payload, { onChanged: scheduleAutoScroll })

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

async function submit() {
  const text = message.value.trim()
  if (!text || loading.value) return

  const turn = reactive(createTurn(text))
  turns.value.push(turn)
  scheduleAutoScroll()

  await send(turn, { message: text })
  message.value = ''
}

async function handleAction(turn, action) {
  await send(turn, { message: JSON.stringify({ userAction: action }) })
}

function fillPreset(text) {
  message.value = text
}

function isUserTextExpanded(turnId) {
  return expandedUserTurns.value.has(turnId)
}

function canExpandUserText(text) {
  return typeof text === 'string' && text.length > 80
}

function toggleUserTextExpand(turnId) {
  const next = new Set(expandedUserTurns.value)
  if (next.has(turnId)) next.delete(turnId)
  else next.add(turnId)
  expandedUserTurns.value = next
}

async function copyUserText(text) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    error.value = '复制失败，请检查浏览器权限'
  }
}
</script>

<template>
  <main class="page">
    <section ref="contentRef" class="content">
      <header class="topbar">GTS-CoWorker</header>

      <div v-if="!hasTurns" class="hero">
        <h1>What would you like to explore?</h1>
        <p>
          Ask about weather, GitHub repos, crypto prices, or Hacker News — the agent will fetch
          real data and build a dashboard.
        </p>

        <div class="suggestions">
          <button @click="fillPreset('Compare weather in NYC, London, and Tokyo')">⚡ Weather comparison</button>
          <button @click="fillPreset('Show stats for github.com/vercel/ai')">⚡ GitHub repo stats</button>
          <button @click="fillPreset('Build a crypto dashboard for BTC and ETH')">⚡ Crypto dashboard</button>
          <button @click="fillPreset('Show today\'s Hacker News top stories')">⚡ Hacker News top stories</button>
        </div>
      </div>

      <div v-else class="conversation">
        <div v-for="turn in turns" :key="turn.id" class="turn">
          <div class="bubble bubble-user">
            <div class="bubble-user-text" :class="{ 'is-collapsed': !isUserTextExpanded(turn.id) }">{{ turn.userText }}</div>
            <div class="bubble-user-actions">
              <button
                v-if="canExpandUserText(turn.userText)"
                type="button"
                class="bubble-action-btn"
                @click="toggleUserTextExpand(turn.id)"
              >
                {{ isUserTextExpanded(turn.id) ? '收起' : '展开' }}
              </button>
              <button type="button" class="bubble-action-btn" @click="copyUserText(turn.userText)">复制</button>
            </div>
          </div>
          <div v-if="turn.streaming" class="streaming-tip">渲染中…（渐进更新）</div>

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

      <p v-if="error" class="error">Error: {{ error }}</p>
    </section>

    <footer class="composer">
      <form class="composer-inner" @submit.prevent="submit">
        <input
          v-model="message"
          placeholder="e.g., Compare weather in NYC, London, and Tokyo..."
          :disabled="loading"
        />
        <button type="submit" :disabled="loading || !message.trim()">{{ loading ? '…' : '➜' }}</button>
      </form>
    </footer>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  width: min(1080px, 92vw);
  margin: 0 auto;
  padding: 20px 0 130px;
}

.topbar {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  letter-spacing: 0.02em;
  margin-bottom: 20px;
}

.hero {
  min-height: 60vh;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 10px;
}

.hero h1 {
  margin: 0;
  font-size: clamp(24px, 3vw, 36px);
}

.hero p {
  margin: 0;
  color: rgba(255, 255, 255, 0.68);
}

.suggestions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.suggestions button {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 7px 12px;
  cursor: pointer;
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

.bubble {
}

.bubble-user {
  align-self: flex-end;
  max-width: 82%;
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.4);
  border-color: rgba(96, 165, 250, 0.4);
  border-radius: 12px;
  padding: 10px 12px;
}

.bubble-user-text {
  white-space: pre-wrap;
  line-height: 1.5;
}

.bubble-user-text.is-collapsed {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.bubble-user-actions {
  margin-top: 8px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.bubble-action-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}

.bubble-assistant {
  align-self: stretch;
  background: rgba(255, 255, 255, 0.03);
}

.streaming-tip {
  color: rgba(125, 211, 252, 0.95);
  font-size: 12px;
  padding-left: 8px;
}

.surface {
  margin-top: 8px;
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
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  display: flex;
  justify-content: center;
  background: linear-gradient(180deg, rgba(3, 4, 7, 0), rgba(3, 4, 7, 0.9) 55%, rgba(3, 4, 7, 1));
}

.composer-inner {
  width: min(860px, 92vw);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(15, 18, 25, 0.9);
  display: flex;
  align-items: center;
  padding: 6px;
}

.composer-inner input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: #f9fafb;
  padding: 10px 12px;
}

.composer-inner button {
  height: 34px;
  min-width: 34px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: #f9fafb;
  cursor: pointer;
}
</style>
