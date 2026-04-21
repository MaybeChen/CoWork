<script setup>
import { computed, reactive, ref } from 'vue'
import { A2UIRenderer } from 'coworkUI'
import { streamChat } from './modules/network/chatStreamClient'
import { createTurn, applyMessage } from './modules/message/messageApplier'
import { applyObjectsProgressively } from './modules/message/progressiveScheduler'

const endpoint = '/api/chat/stream'

const sampleQuestions = [
  '请从日志、告警和工单信息中定位故障根因并给出处理建议',
  '基于当前业务异常，结合指标和拓扑信息生成排障路径',
  '请按节点流程自动分析风险并输出最终推理结论',
]

const nodeDefs = [
  { id: 'log', title: '日志', input: '111' },
  { id: 'alert', title: '告警', input: '222' },
  { id: 'ticket', title: '工单', input: '333' },
  { id: 'metric', title: '指标', input: '444' },
  { id: 'topology', title: '拓扑', input: '555' },
  { id: 'knowledge', title: '知识', input: '666' },
  { id: 'command', title: '命令', input: '777' },
  { id: 'judge', title: '结果判断', input: '999' },
  { id: 'inference', title: '推理结果', input: '结果123456' },
]

const edgeDefs = nodeDefs.slice(0, -1).map((node, index) => ({ id: `${node.id}-${nodeDefs[index + 1].id}`, from: node.id, to: nodeDefs[index + 1].id }))

const loading = ref(false)
const error = ref('')
const activeQuestion = ref('')
const currentNodeId = ref('')
const activeEdgeId = ref('')
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

  await streamChat({
    endpoint,
    payload: { message: node.input },
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
    const node = nodeDefs[i]
    const next = nodeDefs[i + 1]
    activeEdgeId.value = next ? `${node.id}-${next.id}` : ''
    await runSingleNode(node)
    if (error.value) break
  }

  activeEdgeId.value = ''
  loading.value = false
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
      <div class="brand">CoWorker</div>
    </header>

    <section class="workspace">
      <section v-if="!started" class="hero panel">
        <h1 class="hero-brand">形之界，无限之能</h1>
        <p class="hero-subtitle">界面随需而生，协作自由生长</p>
        <div class="example-list">
          <button v-for="item in sampleQuestions" :key="item" class="example-btn" @click="startFlow(item)">
            {{ item }}
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
              <small class="node-input">输入: {{ node.input }}</small>
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
.page { height: 100vh; display: flex; flex-direction: column; background: linear-gradient(180deg, #08111f, #0e1728); color: #b8c7e6; }
.global-header { height: 52px; border-bottom: 1px solid rgba(138, 164, 255, 0.14); display: flex; align-items: center; padding: 0 16px; }
.brand { font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.workspace { flex: 1; padding: 16px; min-height: 0; }
.panel { border: 1px solid rgba(138, 164, 255, 0.14); border-radius: 16px; background: rgba(11,18,32,.88); }
.hero { height: 100%; display: grid; place-content: center; text-align: center; gap: 14px; padding: 24px; }
.hero-brand { margin: 0; font-size: 34px; }
.hero-subtitle { margin: 0; color: #7f90b4; }
.example-list { display: grid; gap: 10px; max-width: 840px; }
.example-btn { border: 1px solid rgba(99,216,255,.36); background: rgba(49,82,180,.22); color: #d9e7ff; border-radius: 12px; padding: 12px 14px; text-align: left; cursor: pointer; }
.flow-layout { height: 100%; display: grid; grid-template-rows: 160px 1fr auto; gap: 12px; }
.graph { padding: 14px; overflow: hidden; }
.graph h3 { margin: 0 0 10px; font-size: 14px; }
.graph-track { position: relative; display: grid; grid-template-columns: repeat(9, minmax(110px, 1fr)); gap: 12px; align-items: center; height: calc(100% - 28px); }
.node { z-index: 2; border: 1px solid rgba(118,143,220,.4); border-radius: 12px; background: rgba(51, 85, 186, 0.3); color: #e3edff; padding: 8px; cursor: pointer; display: grid; gap: 4px; min-height: 72px; }
.node-title { font-weight: 600; }
.node-input { opacity: .86; }
.state-running { box-shadow: 0 0 0 1px rgba(99,216,255,.65), 0 0 20px rgba(99,216,255,.4); border-color: rgba(99,216,255,.8); }
.state-done { background: rgba(40,121,92,.32); border-color: rgba(74,222,128,.7); }
.state-error { background: rgba(166,58,58,.36); border-color: rgba(248,113,113,.8); }
.node.selected { outline: 2px solid rgba(179,201,255,.75); }
.edge { position: absolute; top: 50%; height: 3px; background: rgba(140,158,201,.35); transform: translateY(-50%); z-index: 1; border-radius: 999px; }
.graph-track .edge:nth-child(1) { left: 8%; width: 10%; }
.graph-track .edge:nth-child(2) { left: 19.6%; width: 10%; }
.graph-track .edge:nth-child(3) { left: 31.2%; width: 10%; }
.graph-track .edge:nth-child(4) { left: 42.8%; width: 10%; }
.graph-track .edge:nth-child(5) { left: 54.4%; width: 10%; }
.graph-track .edge:nth-child(6) { left: 66%; width: 10%; }
.graph-track .edge:nth-child(7) { left: 77.6%; width: 10%; }
.graph-track .edge:nth-child(8) { left: 89.2%; width: 10%; }
.edge-active { background: linear-gradient(90deg, rgba(99,216,255,.1), rgba(99,216,255,.95), rgba(99,216,255,.1)); background-size: 220% 100%; animation: flow 1.2s linear infinite; box-shadow: 0 0 16px rgba(99,216,255,.5); }
@keyframes flow { from { background-position: 220% 0; } to { background-position: -20% 0; } }

.result-stage { min-height: 0; padding: 12px; }
.result-card { height: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.result-left { min-height: 0; display: grid; grid-template-rows: 2fr 4fr 4fr; gap: 10px; }
.data-card { border: 1px solid rgba(138,164,255,.18); border-radius: 12px; padding: 10px; background: rgba(8,17,31,.55); min-height: 0; }
.data-card h4 { margin: 0 0 8px; }
.scroll-content { overflow: auto; max-height: 100%; margin: 0; }
.raw-line { margin: 0 0 6px; font-size: 12px; display: flex; gap: 6px; }
.raw-index { color: #7f90b4; }
.raw-text { white-space: pre-wrap; word-break: break-word; }
.raw-text-data-model { color: #fbbf24; }
.raw-text-surface { color: #7dd3fc; }
.result-right { min-height: 0; border: 1px solid rgba(138,164,255,.18); border-radius: 12px; background: rgba(8,17,31,.46); padding: 10px; overflow: auto; }
.surface-wrap { display: grid; gap: 12px; }
.empty-render { height: 100%; display: grid; place-content: center; color: #7f90b4; }
.error { margin: 0; color: #fda4af; }
</style>
