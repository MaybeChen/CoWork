<script setup>
import { computed, ref } from 'vue'
import A2UIRenderer from './components/A2UIRenderer.vue'

const endpoint = 'http://10.136.125.119:8010/api/chat/stream'

const message = ref('')
const loading = ref(false)
const error = ref('')
const turns = ref([])

const hasTurns = computed(() => turns.value.length > 0)

function createTurn(userText) {
  return {
    id: `turn-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    userText,
    surfaces: {},
    dataModel: {},
  }
}

function normalizeProtocolMessage(raw) {
  if (raw.beginRendering) {
    return {
      type: 'createSurface',
      surfaceId: raw.beginRendering.surfaceId,
      root: raw.beginRendering.root,
    }
  }

  if (raw.surfaceUpdate) {
    return {
      type: 'surfaceUpdate',
      surfaceId: raw.surfaceUpdate.surfaceId,
      components: raw.surfaceUpdate.components ?? [],
    }
  }

  if (raw.dataModelUpdate) {
    return {
      type: 'dataModelUpdate',
      surfaceId: raw.dataModelUpdate.surfaceId,
      path: raw.dataModelUpdate.path,
      contents: raw.dataModelUpdate.contents ?? [],
    }
  }

  return raw
}

function ensureSurface(turn, surfaceId) {
  if (!turn.surfaces[surfaceId]) {
    turn.surfaces[surfaceId] = {
      id: surfaceId,
      root: null,
      componentsById: {},
    }
  }
  return turn.surfaces[surfaceId]
}

function applyMessage(turn, rawPayload) {
  const payload = normalizeProtocolMessage(rawPayload)
  const type = payload.type || payload.messageType

  if (type === 'createSurface') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid) return
    const surface = ensureSurface(turn, sid)
    surface.root = payload.root || payload.surface?.root || surface.root
    if (Array.isArray(payload.components)) {
      for (const item of payload.components) {
        if (!item?.id) continue
        surface.componentsById[item.id] = item
      }
    }
    turn.surfaces = { ...turn.surfaces }
    return
  }

  if (type === 'surfaceUpdate' || type === 'updateComponents') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid) return
    const surface = ensureSurface(turn, sid)
    const list = payload.components || payload.patch || []
    if (Array.isArray(list)) {
      for (const item of list) {
        if (!item?.id) continue
        surface.componentsById[item.id] = item
      }
    }
    turn.surfaces = { ...turn.surfaces }
    return
  }

  if (type === 'dataModelUpdate' || type === 'updateDataModel') {
    if (Array.isArray(payload.contents)) {
      for (const entry of payload.contents) {
        const key = entry.key
        if (!key) continue
        if ('valueString' in entry) turn.dataModel[key] = entry.valueString
        else if ('valueNumber' in entry) turn.dataModel[key] = entry.valueNumber
        else if ('valueBool' in entry) turn.dataModel[key] = entry.valueBool
        else if ('valueJson' in entry) turn.dataModel[key] = entry.valueJson
      }
      turn.dataModel = { ...turn.dataModel }
      return
    }

    const update = payload.data || payload.dataModel || payload.patch || {}
    Object.assign(turn.dataModel, update)
    turn.dataModel = { ...turn.dataModel }
    return
  }
}

function extractJsonObjects(input) {
  const objects = []
  let depth = 0
  let start = -1
  let inString = false
  let escaped = false
  let lastConsumedIndex = 0

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === '"') {
        inString = false
      }
      continue
    }

    if (ch === '"') {
      inString = true
      continue
    }

    if (ch === '{') {
      if (depth === 0) start = i
      depth += 1
      continue
    }

    if (ch === '}') {
      depth -= 1
      if (depth === 0 && start >= 0) {
        objects.push(input.slice(start, i + 1))
        lastConsumedIndex = i + 1
        start = -1
      }
    }
  }

  return {
    objects,
    remainder: input.slice(lastConsumedIndex),
  }
}

async function send(turn, payload) {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (!res.body) throw new Error('Response body is empty')

    const reader = res.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      const { objects, remainder } = extractJsonObjects(buffer)
      buffer = remainder

      for (const raw of objects) {
        try {
          applyMessage(turn, JSON.parse(raw))
        } catch {
          // skip malformed object in stream
        }
      }
    }

    if (buffer.trim()) {
      const { objects } = extractJsonObjects(buffer)
      for (const raw of objects) {
        try {
          applyMessage(turn, JSON.parse(raw))
        } catch {
          // skip malformed object in stream tail
        }
      }
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

async function submit() {
  const text = message.value.trim()
  if (!text || loading.value) return

  const turn = createTurn(text)
  turns.value.push(turn)

  await send(turn, { message: text })
  message.value = ''
}

async function handleAction(turn, action) {
  await send(turn, { message: JSON.stringify({ userAction: action }) })
}

function fillPreset(text) {
  message.value = text
}
</script>

<template>
  <main class="page">
    <section class="content">
      <header class="topbar">json-render Chat Example</header>

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
          <div class="bubble bubble-user">{{ turn.userText }}</div>

          <div class="bubble bubble-assistant">
            <template v-if="Object.keys(turn.surfaces).length">
              <article v-for="surface in Object.values(turn.surfaces)" :key="surface.id" class="surface">
                <A2UIRenderer :surface="surface" :data-model="turn.dataModel" :on-action="(action) => handleAction(turn, action)" />
              </article>
            </template>
            <template v-else>
              <span class="placeholder">正在等待后端 UI 响应...</span>
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 12px 14px;
}

.bubble-user {
  align-self: flex-end;
  max-width: 82%;
  background: rgba(96, 165, 250, 0.15);
  border-color: rgba(96, 165, 250, 0.4);
}

.bubble-assistant {
  align-self: stretch;
  background: rgba(255, 255, 255, 0.03);
}

.surface {
  margin-top: 8px;
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
