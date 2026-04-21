<script setup>
import { computed, reactive, ref } from 'vue'
import { A2UIRenderer } from 'coworkUI'
import { streamChat } from './modules/network/chatStreamClient'
import { createTurn, applyMessage } from './modules/message/messageApplier'
import { applyObjectsProgressively } from './modules/message/progressiveScheduler'
import { NODE_INPUTS } from './modules/flow/nodeInputs'

const endpoint = '/api/chat/stream'

const sampleQuestions = [
  { id: 'q1', text: '请从日志、告警和工单信息中定位故障根因并给出处理建议' },
  { id: 'q2', text: '基于当前业务异常，结合指标和拓扑信息生成排障路径' },
  { id: 'q3', text: '请按节点流程自动分析风险并输出最终推理结论' },
]

const nodeDefs = [
  { id: 'log', title: '日志', input: NODE_INPUTS.log },
  { id: 'alert', title: '告警', input: NODE_INPUTS.alert },
  { id: 'ticket', title: '工单', input: NODE_INPUTS.ticket },
  { id: 'metric', title: '指标', input: NODE_INPUTS.metric },
  { id: 'topology', title: '拓扑', input: NODE_INPUTS.topology },
  { id: 'knowledge', title: '知识', input: NODE_INPUTS.knowledge },
  { id: 'command', title: '命令', input: NODE_INPUTS.command },
  { id: 'judge', title: '结果判断', input: NODE_INPUTS.judge },
  { id: 'inference', title: '推理结果', input: NODE_INPUTS.inference },
]

const edgeDefs = nodeDefs.slice(0, -1).map((node, index) => ({ id: `${node.id}-${nodeDefs[index + 1].id}`, from: node.id, to: nodeDefs[index + 1].id }))

const loading = ref(false)
const error = ref('')
const activeQuestion = ref('')
const currentNodeId = ref('')
const activeEdgeId = ref('')
const activeAbortController = ref(null)
const runVersion = ref(0)
const nodeStates = reactive({})
const nodeResults = reactive({})

for (const node of nodeDefs) {
  nodeStates[node.id] = 'idle'
}

const started = computed(() => Boolean(activeQuestion.value))
const hasCurrentNode = computed(() => Boolean(currentNodeId.value && nodeResults[currentNodeId.value]))
const currentResult = computed(() => (hasCurrentNode.value ? nodeResults[currentNodeId.value] : null))

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

function getRawLineToneClass(line) {
  const raw = String(line || '').toLowerCase()
  if (raw.includes('datamodelupdate')) return 'raw-text-data-model'
  return 'raw-text-surface'
}

function formatNodeInputPreview(inputText) {
  const text = String(inputText || '').replace(/\s+/g, ' ').trim()
  if (text.length <= 18) return text
  return `${text.slice(0, 18)}...`
}

function appendRawLine(result, line) {
  if (!line) return
  const cleaned = String(line).trimEnd()
  if (!cleaned) return
  result.rawLines.push(cleaned)
}

function syncParsed(result) {
  result.parsedText = stringifyPretty(buildParsedPayload(result.turn))
}

async function runSingleNode(node) {
  const turn = reactive(createTurn(node.input, 'default'))
  const result = reactive({
    nodeId: node.id,
    title: node.title,
    inputText: node.input,
    turn,
    rawLines: [],
    parsedText: '',
  })
  nodeResults[node.id] = result
  currentNodeId.value = node.id
  nodeStates[node.id] = 'running'

  const controller = new AbortController()
  activeAbortController.value = controller

  await streamChat({
    endpoint,
    payload: { message: node.input },
    signal: controller.signal,
    onObjects: async (objects) => {
      await applyObjectsProgressively(turn, objects, { applyMessageFn: (targetTurn, payload) => applyMessage(targetTurn, payload) })
      for (const item of objects || []) appendRawLine(result, stringifyPretty(item))
      syncParsed(result)
    },
    onError: (e) => {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    },
  })

  nodeStates[node.id] = error.value ? 'error' : 'done'
  syncParsed(result)
}

async function startFlow(question) {
  if (loading.value) return
  runVersion.value += 1
  const currentRun = runVersion.value
  activeQuestion.value = question
  error.value = ''
  currentNodeId.value = ''
  activeEdgeId.value = ''
  loading.value = true

  for (const node of nodeDefs) {
    nodeStates[node.id] = 'idle'
    delete nodeResults[node.id]
  }

  for (let i = 0; i < nodeDefs.length; i += 1) {
    if (currentRun !== runVersion.value) break
    const node = nodeDefs[i]
    const next = nodeDefs[i + 1]
    activeEdgeId.value = next ? `${node.id}-${next.id}` : ''
    await runSingleNode(node)
    if (error.value) break
  }

  activeEdgeId.value = ''
  loading.value = false
  activeAbortController.value = null
}

function backToHome() {
  activeAbortController.value?.abort()
  runVersion.value += 1
  loading.value = false
  error.value = ''
  activeQuestion.value = ''
  currentNodeId.value = ''
  activeEdgeId.value = ''
  activeAbortController.value = null
  for (const node of nodeDefs) {
    nodeStates[node.id] = 'idle'
    delete nodeResults[node.id]
  }
}

function selectNode(nodeId) {
  if (!nodeResults[nodeId]) return
  currentNodeId.value = nodeId
}

async function handleAction(nodeId, action) {
  const result = nodeResults[nodeId]
  if (!result) return
  await streamChat({
    endpoint,
    payload: { message: JSON.stringify({ userAction: action }) },
    onObjects: async (objects) => {
      await applyObjectsProgressively(result.turn, objects, { applyMessageFn: (targetTurn, payload) => applyMessage(targetTurn, payload) })
      for (const item of objects || []) appendRawLine(result, stringifyPretty(item))
      syncParsed(result)
    },
    onError: (e) => {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    },
  })
}
</script>

<template>
  <main class="page">
    <header class="global-header">
      <button type="button" class="brand" @click="backToHome">COWORKER</button>
    </header>

    <section class="workspace">
      <section v-if="!started" class="hero panel">
        <h1 class="hero-brand">无形之界，无限之能</h1>
        <p class="hero-subtitle">界面随需而生，协作自由生长</p>
        <div class="example-list">
          <button v-for="item in sampleQuestions" :key="item.id" class="example-btn" @click="startFlow(item.text)">
            <span class="chart-icon" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span class="example-text">{{ item.text }}</span>
          </button>
        </div>
      </section>

      <section v-else class="flow-layout">
        <section class="graph panel">
          <h3>流程节点图谱</h3>
          <div class="graph-track">
            <div
              v-for="edge in edgeDefs"
              :key="edge.id"
              :class="['edge', { 'edge-active': activeEdgeId === edge.id }]"
            />
            <button
              v-for="node in nodeDefs"
              :key="node.id"
              type="button"
              :class="['node', `state-${nodeStates[node.id]}`, { selected: currentNodeId === node.id }]"
              @click="selectNode(node.id)"
            >
              <span class="node-title">{{ node.title }}</span>
              <small class="node-input">输入: {{ formatNodeInputPreview(node.input) }}</small>
            </button>
          </div>
        </section>

        <section class="result-stage panel">
          <section v-if="hasCurrentNode" class="result-card">
            <aside class="result-left">
              <article class="data-card input-card">
                <h4>Input</h4>
                <pre>{{ currentResult.inputText }}</pre>
              </article>
              <article class="data-card raw-card">
                <h4>Raw</h4>
                <div class="scroll-content">
                  <p v-for="(line, index) in currentResult.rawLines" :key="`${currentResult.nodeId}-raw-${index}`" class="raw-line">
                    <span class="raw-index">{{ index + 1 }}.</span>
                    <span :class="['raw-text', getRawLineToneClass(line)]">{{ line }}</span>
                  </p>
                </div>
              </article>
              <article class="data-card parsed-card">
                <h4>Parsed</h4>
                <pre class="scroll-content">{{ currentResult.parsedText }}</pre>
              </article>
            </aside>

            <article class="result-right">
              <div v-if="Object.values(currentResult.turn.surfaces).some((s) => s.ready)" class="surface-wrap">
                <article
                  v-for="surface in Object.values(currentResult.turn.surfaces).filter((s) => s.ready)"
                  :key="surface.id"
                  class="surface"
                >
                  <A2UIRenderer
                    :surface="surface"
                    :data-model="currentResult.turn.dataModels[surface.id] || {}"
                    :on-action="(action) => handleAction(currentResult.nodeId, action)"
                  />
                </article>
              </div>
              <div v-else class="empty-render">节点执行中，等待 GenUI 卡片数据...</div>
            </article>
          </section>
          <section v-else class="empty-render">正在准备节点结果...</section>
        </section>

        <p v-if="error" class="error">Error: {{ error }}</p>
      </section>
    </section>
  </main>
</template>

<style scoped>
.page { height: 100vh; display: flex; flex-direction: column; background: linear-gradient(180deg, #f8fbff, #eef3fa); color: #334155; }
.global-header { height: 52px; border-bottom: 1px solid #d7e3f3; display: flex; align-items: center; padding: 0 16px; background: rgba(255,255,255,.78); backdrop-filter: blur(8px); }
.brand { font-weight: 800; letter-spacing: .08em; text-transform: uppercase; border: none; background: linear-gradient(90deg, #2563eb, #06b6d4); -webkit-background-clip: text; background-clip: text; color: transparent; cursor: pointer; padding: 0; }
.workspace { flex: 1; padding: 16px; min-height: 0; }
.panel { border: none; border-radius: 0; background: transparent; box-shadow: none; }
.hero { height: 100%; display: grid; place-content: center; text-align: center; gap: 14px; padding: 24px; }
.hero-brand { margin: 0; font-size: 34px; background: linear-gradient(90deg, #1d4ed8 0%, #2563eb 45%, #0ea5e9 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hero-subtitle { margin: 0; color: #64748b; }
.example-list { display: grid; grid-template-columns: repeat(3, minmax(220px, 1fr)); gap: 12px; max-width: 1080px; }
.example-btn { border: 1px solid #d5e5fb; background: #ffffff; color: #1e3a8a; border-radius: 14px; padding: 14px; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 12px; min-height: 86px; }
.example-btn:hover { background: #f8fbff; border-color: #93c5fd; box-shadow: 0 8px 16px rgba(148,163,184,.16); }
.chart-icon { width: 34px; height: 34px; border-radius: 10px; border: 1px solid #bfdbfe; background: #eff6ff; display: flex; align-items: flex-end; justify-content: center; gap: 3px; padding: 6px; flex: 0 0 auto; }
.chart-icon i { display: inline-block; width: 5px; background: linear-gradient(180deg, #60a5fa, #2563eb); border-radius: 4px; }
.chart-icon i:nth-child(1) { height: 8px; }
.chart-icon i:nth-child(2) { height: 14px; }
.chart-icon i:nth-child(3) { height: 11px; }
.example-text { line-height: 1.4; }
.flow-layout { height: 100%; display: grid; grid-template-rows: 160px 1fr auto; gap: 12px; }
.graph { padding: 10px 0; overflow: hidden; }
.graph h3 { margin: 0 0 10px; font-size: 14px; color: #334155; }
.graph-track { position: relative; display: grid; grid-template-columns: repeat(9, minmax(110px, 1fr)); gap: 12px; align-items: center; height: calc(100% - 28px); }
.node { z-index: 2; border: 1px solid #bfdbfe; border-radius: 12px; background: #eff6ff; color: #1e3a8a; padding: 8px; cursor: pointer; display: grid; gap: 4px; min-height: 72px; }
.node-title { font-weight: 600; }
.node-input { opacity: .86; }
.state-running { box-shadow: 0 0 0 1px rgba(37,99,235,.35), 0 0 16px rgba(147,197,253,.9); border-color: #60a5fa; background: #dbeafe; }
.state-done { background: #dcfce7; border-color: #86efac; color: #166534; }
.state-error { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
.node.selected { outline: 2px solid #60a5fa; }
.edge { position: absolute; top: 50%; height: 3px; background: #cbd5e1; transform: translateY(-50%); z-index: 1; border-radius: 999px; }
.graph-track .edge:nth-child(1) { left: 8%; width: 10%; }
.graph-track .edge:nth-child(2) { left: 19.6%; width: 10%; }
.graph-track .edge:nth-child(3) { left: 31.2%; width: 10%; }
.graph-track .edge:nth-child(4) { left: 42.8%; width: 10%; }
.graph-track .edge:nth-child(5) { left: 54.4%; width: 10%; }
.graph-track .edge:nth-child(6) { left: 66%; width: 10%; }
.graph-track .edge:nth-child(7) { left: 77.6%; width: 10%; }
.graph-track .edge:nth-child(8) { left: 89.2%; width: 10%; }
.edge-active { background: linear-gradient(90deg, rgba(59,130,246,.12), rgba(59,130,246,.95), rgba(59,130,246,.12)); background-size: 220% 100%; animation: flow 1.2s linear infinite; box-shadow: 0 0 12px rgba(59,130,246,.35); }
@keyframes flow { from { background-position: 220% 0; } to { background-position: -20% 0; } }

.result-stage { min-height: 0; padding: 0; }
.result-card { height: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.result-left { min-height: 0; display: grid; grid-template-rows: 2fr 4fr 4fr; gap: 10px; }
.data-card { border: 1px solid #dbe4f3; border-radius: 12px; padding: 10px; background: #ffffff; min-height: 0; }
.data-card h4 { margin: 0 0 8px; }
.scroll-content { overflow: auto; max-height: 100%; margin: 0; }
.raw-line { margin: 0 0 6px; font-size: 12px; display: flex; gap: 6px; }
.raw-index { color: #94a3b8; }
.raw-text { white-space: pre-wrap; word-break: break-word; }
.raw-text-data-model { color: #b45309; }
.raw-text-surface { color: #0f766e; }
.result-right { min-height: 0; border: 1px solid #dbe4f3; border-radius: 12px; background: #f8fafc; padding: 10px; overflow: auto; }
.surface-wrap { display: grid; gap: 12px; }
.empty-render { height: 100%; display: grid; place-content: center; color: #64748b; }
.error { margin: 0; color: #dc2626; }

@media (max-width: 1080px) {
  .example-list { grid-template-columns: 1fr; max-width: 820px; }
}
</style>
