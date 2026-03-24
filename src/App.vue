<script setup>
import { computed, ref } from 'vue'
import A2UIRenderer from './components/A2UIRenderer.vue'

const endpoint = 'http://localhost:8010/api/chat/stream'

const message = ref('')
const loading = ref(false)
const error = ref('')

const surfaces = ref(new Map())
const dataModel = ref({})

const hasSurfaces = computed(() => surfaces.value.size > 0)
const orderedSurfaces = computed(() => Array.from(surfaces.value.values()))

function applyMessage(payload) {
  const type = payload.type || payload.messageType
  if (!type) return

  if (type === 'createSurface') {
    const surface = payload.surface || {
      id: payload.surfaceId || `surface-${Date.now()}`,
      components: payload.components || payload.rootComponents || [],
      title: payload.title,
    }
    surfaces.value.set(surface.id, {
      components: [],
      ...surface,
    })
    return
  }

  if (type === 'updateComponents') {
    const sid = payload.surfaceId || payload.surface?.id
    if (!sid || !surfaces.value.has(sid)) return
    const current = surfaces.value.get(sid)
    const incoming = payload.components || payload.patch || []
    current.components = Array.isArray(incoming) ? incoming : current.components
    surfaces.value.set(sid, { ...current })
    return
  }

  if (type === 'updateDataModel') {
    const update = payload.data || payload.dataModel || payload.patch || {}
    dataModel.value = { ...dataModel.value, ...update }
    return
  }

  if (type === 'deleteSurface') {
    const sid = payload.surfaceId || payload.id
    if (sid) surfaces.value.delete(sid)
  }
}

function processRawChunk(chunk) {
  const text = chunk.trim()
  if (!text) return

  if (text.startsWith('data:')) {
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)

    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const raw = line.slice(5).trim()
      if (!raw || raw === '[DONE]') continue
      try {
        applyMessage(JSON.parse(raw))
      } catch {
        // ignore malformed data line
      }
    }
    return
  }

  for (const line of text.split('\n')) {
    const raw = line.trim()
    if (!raw) continue
    try {
      applyMessage(JSON.parse(raw))
    } catch {
      // ignore malformed json chunk
    }
  }
}

async function send(payload) {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

      const segments = buffer.split('\n\n')
      buffer = segments.pop() ?? ''
      for (const seg of segments) processRawChunk(seg)

      if (!buffer.includes('\n')) continue
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''
      for (const line of lines) processRawChunk(line)
    }

    if (buffer.trim()) processRawChunk(buffer)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

async function submit() {
  const text = message.value.trim()
  if (!text || loading.value) return
  await send({ message: text })
  message.value = ''
}

async function handleAction(action) {
  await send({
    message: JSON.stringify({ userAction: action }),
  })
}

function fillPreset(text) {
  message.value = text
}
</script>

<template>
  <main class="page">
    <section class="content">
      <header class="topbar">json-render Chat Example</header>

      <div v-if="!hasSurfaces" class="hero">
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

      <div v-else class="surface-list">
        <article v-for="surface in orderedSurfaces" :key="surface.id" class="surface">
          <h3 v-if="surface.title" class="surface-title">{{ surface.title }}</h3>
          <A2UIRenderer :surface="surface" :data-model="dataModel" :on-action="handleAction" />
        </article>
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
  margin-bottom: 40px;
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

.surface-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.surface {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
}

.surface-title {
  margin-top: 0;
  margin-bottom: 10px;
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
