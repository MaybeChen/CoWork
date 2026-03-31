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
    try {
      const el = document.createElement('textarea')
      el.setAttribute('readonly', '')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    } catch {
      error.value = '复制失败，请检查浏览器权限'
    }
  }
}
</script>

<template>
  <main class="page">
    <header class="global-header">
      <div class="brand">FAE</div>
      <nav class="top-nav">
        <a href="#">故障诊断</a>
        <a href="#">健康预测</a>
      </nav>
    </header>

    <section class="workspace">
      <aside class="sidebar left">
        <section class="panel">
          <h3>待办工单清单</h3>
          <div class="fake-input">输入工单名称阶段名称</div>
          <div class="tag-cloud">
            <span>工单名称A</span><span>工单名称B</span><span>工单名称C</span><span>工单名称D</span>
            <span>工单名称E</span><span>工单名称F</span>
          </div>
        </section>
        <section class="panel">
          <h3>最近</h3>
          <ul class="list">
            <li>这是早工单名称名称 <em>2026-03-31</em></li>
            <li>这是工单名称名称 <em>2026-03-30</em></li>
            <li>这是早工单名称名称 <em>2026-03-29</em></li>
          </ul>
        </section>
        <section class="panel">
          <h3>外部信息导入</h3>
          <div class="file-grid">
            <span>文件夹</span><span>文档</span><span>表格</span><span>图片</span>
          </div>
        </section>
      </aside>

      <section class="center">
        <div class="panel stage-map">
          <h3>工作台</h3>
          <div class="flow-mock">
            <span>开始</span><span>本体定义子图</span><span>状态感知</span><span>推理图</span>
          </div>
        </div>

        <section ref="contentRef" class="content panel">
          <div v-if="!hasTurns" class="hero">
            <h1>智能体对话区</h1>
            <p>输入问题后，系统将逐步生成结构化界面。</p>
            <div class="suggestions">
              <button @click="fillPreset('Compare weather in NYC, London, and Tokyo')">⚡ Weather comparison</button>
              <button @click="fillPreset('Show stats for github.com/vercel/ai')">⚡ GitHub repo stats</button>
              <button @click="fillPreset('Build a crypto dashboard for BTC and ETH')">⚡ Crypto dashboard</button>
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

        <footer class="composer panel">
          <form class="composer-inner" @submit.prevent="submit">
            <input
              v-model="message"
              placeholder="请输入问题，例如：查询故障工单并给出分析..."
              :disabled="loading"
            />
            <button type="submit" :disabled="loading || !message.trim()">{{ loading ? '…' : '➜' }}</button>
          </form>
        </footer>
      </section>

      <aside class="sidebar right">
        <section class="panel">
          <h3>我的工具</h3>
          <ul class="tool-list">
            <li>工单填写</li>
            <li>预案生成</li>
            <li>智能调优</li>
            <li>报告生成</li>
          </ul>
        </section>
        <section class="panel">
          <h3>状态可视化</h3>
          <div class="graph-mock"></div>
        </section>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #d9d9d9;
  color: #d5def0;
}

.global-header {
  height: 52px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #0a0d12;
}

.brand {
  color: #e6f0ff;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.top-nav {
  display: flex;
  gap: 24px;
}

.top-nav a {
  color: #5da6e6;
  text-decoration: none;
}

.workspace {
  flex: 1;
  display: grid;
  grid-template-columns: 260px 1fr 260px;
  gap: 8px;
  padding: 10px;
  overflow: hidden;
  background: #07090d;
}

.sidebar,
.center {
  min-height: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.center {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
  min-width: 0;
}

.panel {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(24, 27, 33, 0.96);
  border-radius: 6px;
  padding: 10px;
}

.panel h3 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #9db2d6;
}

.content {
  overflow: auto;
}

.fake-input {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 6px 8px;
  color: #7d8da8;
  margin-bottom: 10px;
  font-size: 12px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-cloud span {
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.list li {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.list em {
  color: #6b7e9b;
  font-style: normal;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.file-grid span {
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.02);
  padding: 8px 6px;
  text-align: center;
}

.stage-map .flow-mock {
  min-height: 70px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(11, 13, 17, 0.9);
  padding: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.flow-mock span {
  font-size: 12px;
  border-radius: 999px;
  padding: 6px 10px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(14, 165, 233, 0.35));
}

.tool-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.tool-list li {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 6px;
  padding: 8px;
  font-size: 12px;
}

.graph-mock {
  height: 220px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background:
    radial-gradient(circle at 20% 40%, rgba(34, 197, 94, 0.5) 2px, transparent 3px),
    radial-gradient(circle at 58% 62%, rgba(59, 130, 246, 0.55) 2px, transparent 3px),
    radial-gradient(circle at 78% 38%, rgba(168, 85, 247, 0.55) 2px, transparent 3px),
    rgba(255, 255, 255, 0.02);
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

.hero p {
  margin: 0;
  color: rgba(203, 213, 225, 0.8);
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

.bubble-user {
  align-self: flex-end;
  max-width: 82%;
  background: rgba(96, 165, 250, 0.15);
  border: 1px solid rgba(96, 165, 250, 0.25);
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
  background: rgba(11, 15, 22, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
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
  padding: 8px;
}

.composer-inner {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(19, 21, 26, 0.95);
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
  background: rgba(255, 255, 255, 0.08);
  color: #f9fafb;
  cursor: pointer;
}
</style>
