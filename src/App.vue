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
      <div class="brand">CoWorker</div>
      <nav class="top-nav">
        <a href="#">故障诊断</a>
        <a href="#">健康预测</a>
      </nav>
    </header>

    <section class="workspace">
      <aside class="sidebar left">
        <section class="panel">
          <h3>待办工单清单</h3>
          <div class="todo-toolbar">
            <button type="button" class="todo-icon-btn">☰</button>
            <button type="button" class="todo-icon-btn">📋</button>
          </div>
          <div class="todo-search">
            <span>输入工单名称/阶段名称</span>
            <span class="search-icon">⌕</span>
          </div>
          <div class="todo-board">
            <div class="todo-node n1 red"><b>工单名称</b><small>阶段</small></div>
            <div class="todo-node n2 yellow"><b>工单名称</b><small>阶段</small></div>
            <div class="todo-node n3 red"><b>工单名称</b><small>阶段</small></div>
            <div class="todo-node n4 red"><b>工单名称</b><small>阶段</small></div>
            <div class="todo-node n5 blue"><b>工单名称</b><small>阶段</small></div>
          </div>
          <div class="todo-footer">
            目前共有 <strong>19</strong> 个故障单
            <div class="todo-dots"><span class="active"></span><span></span><span></span><span></span></div>
          </div>
        </section>
        <section class="panel">
          <h3>最近</h3>
          <ul class="list">
            <li><span class="list-title">推理模型应时延过长</span> <em>2026-03-31</em></li>
            <li><span class="list-title">转发引擎整体功能失效告警转工单</span> <em>2026-03-30</em></li>
            <li><span class="list-title">License试用</span> <em>2026-03-29</em></li>
            <li><span class="list-title">内存使用率过高</span> <em>2026-03-28</em></li>
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
          <div class="stage-tabs">
            <span class="active">信息丰富与本体子图检索</span>
            <span>规划与执行</span>
            <span>推理</span>
          </div>
          <div class="stage-canvas">
            <span class="stage-step">第1轮 ▾</span>
            <span class="stage-node blue n-start">开始</span>
            <span class="stage-node blue strong n-search">本体定义子图</span>
            <span class="stage-node purple n-instance">本体实例图</span>
            <span class="stage-node green n-state">状态图</span>
            <span class="stage-node cyan n-knowledge">知识图</span>
            <span class="stage-node dark-green n-reason">推理图</span>

            <svg class="stage-lines" viewBox="0 0 960 300" preserveAspectRatio="none" aria-hidden="true">
              <path d="M120,165 C170,165 180,165 225,165" />
              <path d="M335,165 C390,140 430,108 470,100" />
              <path d="M335,165 C390,180 430,206 470,215" />
              <path d="M590,100 C670,100 730,122 790,150" />
              <path d="M590,215 C670,215 730,188 790,160" />
            </svg>
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

        <footer class="composer">
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
          <div class="tool-head">
            <div class="tool-tabs">
              <span class="active">热门工具</span>
              <span>我收藏的</span>
            </div>
            <div class="tool-lib">⛓ 工具库</div>
          </div>
          <div class="tool-search">
            <span>工具名称</span>
            <span class="search-icon">⌕</span>
          </div>
          <ul class="tool-list">
            <li>
              <div class="tool-item-top"><span class="tool-icon">🧰</span><b>工单速写</b><em>★</em></div>
              <p>这里是工具的简要用途说明，这里是工具的简要用途说明</p>
            </li>
            <li>
              <div class="tool-item-top"><span class="tool-icon">🧪</span><b>预案生成</b><em>☆</em></div>
              <p>这里是工具的简要用途说明，这里是工具的简要用途说明</p>
            </li>
            <li>
              <div class="tool-item-top"><span class="tool-icon">🧠</span><b>智能调优</b><em>☆</em></div>
              <p>这里是工具的简要用途说明，这里是工具的简要用途说明</p>
            </li>
            <li>
              <div class="tool-item-top"><span class="tool-icon">🟣</span><b>报告生成</b><em>☆</em></div>
              <p>这里是工具的简要用途说明，这里是工具的简要用途说明</p>
            </li>
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
  grid-template-columns: 320px 1fr 320px;
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
  overflow-y: auto;
  overflow-x: hidden;
}

.center {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 10px;
  min-width: 0;
}

.panel {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 10px;
}

.panel h3 {
  margin: 0 0 10px;
  font-size: 13px;
  color: #d6d8dd;
}

.content {
  overflow: auto;
}

.todo-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 8px;
}

.todo-icon-btn {
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #dbe6ff;
  width: 32px;
  height: 22px;
  cursor: pointer;
}

.todo-search {
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #7f8ba2;
  padding: 0 10px;
  margin-bottom: 10px;
  font-size: 12px;
}

.search-icon {
  color: #ffffff;
  font-size: 18px;
  line-height: 1;
}

.todo-board {
  position: relative;
  height: 220px;
  margin-bottom: 8px;
  overflow: hidden;
}

.todo-node {
  position: absolute;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
}

.todo-node b {
  font-size: 12px;
  font-weight: 600;
}

.todo-node small {
  font-size: 10px;
  color: #93a0bb;
}

.todo-node.red {
  border: 1px solid rgba(248, 113, 113, 0.75);
  box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.2), 0 0 18px rgba(248, 113, 113, 0.4);
}

.todo-node.yellow {
  border: 1px solid rgba(250, 204, 21, 0.8);
  box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.2), 0 0 16px rgba(250, 204, 21, 0.3);
}

.todo-node.blue {
  border: 1px solid rgba(96, 165, 250, 0.75);
  box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.18), 0 0 14px rgba(96, 165, 250, 0.28);
}

.todo-node.n1 { left: 12px; top: 72px; }
.todo-node.n2 { left: 96px; top: 18px; }
.todo-node.n3 { left: 176px; top: 72px; }
.todo-node.n4 { left: 96px; top: 142px; }
.todo-node.n5 { left: 12px; top: 148px; width: 64px; height: 64px; }

.todo-footer {
  text-align: center;
  color: #a3afc5;
  font-size: 13px;
}

.todo-footer strong {
  color: #6ea8ff;
}

.todo-dots {
  margin-top: 6px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.todo-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
}

.todo-dots .active {
  width: 14px;
  border-radius: 999px;
  background: #6ea8ff;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0 0 10px;
  display: grid;
  gap: 8px;
}

.list li {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  column-gap: 8px;
  font-size: 12px;
}

.list-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.stage-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 10px;
}

.stage-tabs span {
  text-align: center;
  font-size: 12px;
  color: #8d98ae;
  padding: 7px 10px;
}

.stage-tabs .active {
  color: #4ea0ff;
  background: rgba(78, 160, 255, 0.08);
}

.stage-canvas {
  position: relative;
  min-height: 188px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: rgba(11, 13, 17, 0.92);
  padding: 18px 16px 16px;
  overflow: hidden;
}

.stage-node {
  position: absolute;
  border-radius: 10px;
  font-size: 13px;
  padding: 8px 18px;
  color: #e8efff;
  border: 1px solid transparent;
  z-index: 2;
}

.stage-node.blue { background: #2997e3; }
.stage-node.blue.strong { background: #3166ee; box-shadow: 0 0 0 2px rgba(49, 102, 238, 0.35); }
.stage-node.purple { background: #6d55e6; }
.stage-node.green { background: #1b6f61; }
.stage-node.cyan { background: #10a8b8; }
.stage-node.dark-green { background: #2f6a4a; }

.stage-step {
  position: absolute;
  right: 14px;
  top: 10px;
  font-size: 12px;
  color: #c6d0e4;
  z-index: 3;
}

.n-start { left: 18px; top: 106px; }
.n-search { left: 122px; top: 106px; }
.n-instance { left: 352px; top: 64px; }
.n-state { left: 502px; top: 64px; }
.n-knowledge { left: 502px; top: 144px; }
.n-reason { right: 18px; top: 106px; }

.stage-lines {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.stage-lines path {
  fill: none;
  stroke: rgba(216, 225, 241, 0.55);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.tool-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.tool-tabs {
  display: flex;
  gap: 14px;
  font-size: 13px;
  color: #a7b2c8;
}

.tool-tabs .active {
  color: #4ea0ff;
  border-bottom: 2px solid #4ea0ff;
  padding-bottom: 3px;
}

.tool-lib {
  color: #c7d3e8;
  font-size: 12px;
}

.tool-search {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  min-height: 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  color: #7f8ba2;
  font-size: 12px;
  margin-bottom: 10px;
}

.tool-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.tool-list li {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  padding: 10px;
}

.tool-item-top {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: 10px;
}

.tool-item-top b {
  font-size: 18px;
  font-weight: 500;
}

.tool-item-top em {
  font-style: normal;
  color: #f5d14f;
}

.tool-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(78, 160, 255, 0.25);
}

.tool-list li p {
  margin: 8px 0 0;
  color: #b5bfd3;
  font-size: 12px;
  line-height: 1.55;
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
  border: 1px solid rgba(255, 255, 255, 0.16);
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
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.streaming-tip {
  color: rgba(125, 211, 252, 0.95);
  font-size: 12px;
  padding-left: 8px;
}

.surface {
  margin-top: 8px;
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

.composer-inner {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(19, 21, 26, 0.95);
  display: flex;
  align-items: center;
  padding: 6px;
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
