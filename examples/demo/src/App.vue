<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { A2UIRenderer } from 'coworkUI'
import FlowNodeGraph from './components/FlowNodeGraph.vue'
import { useAutoScroll } from './modules/ui/useAutoScroll'
import { streamChat } from './modules/network/chatStreamClient'
import { createTurn, applyMessage } from './modules/message/messageApplier'
import { applyObjectsProgressively } from './modules/message/progressiveScheduler'
import { NODE_INPUTS } from './modules/flow/nodeInputs'
import { DEFAULT_MODEL_LABEL, MODEL_OPTIONS, getSavedModelLabel, saveModelLabel, withModelParam } from './modules/network/modelConfig'

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

const loading = ref(false)
const error = ref('')
const activeQuestion = ref('')
const currentNodeId = ref('')
const activeEdgeId = ref('')
const activeAbortController = ref(null)
const runVersion = ref(0)
const nodeStates = reactive({})
const nodeResults = reactive({})
const cardRefs = new Map()

const inputRefs = new Map()
const renderRefs = new Map()
const inputExpanded = reactive({})
const ioViewMode = reactive({})
const selectedModelLabel = ref(getSavedModelLabel())
const modelOptions = MODEL_OPTIONS
const streamEndpoint = computed(() => withModelParam(endpoint, selectedModelLabel.value))


const { contentRef: inputPanelRef, directive: inputAutoScrollDirective } = useAutoScroll()
const { contentRef: renderPanelRef, directive: renderAutoScrollDirective } = useAutoScroll()
const vInputAutoScroll = inputAutoScrollDirective
const vRenderAutoScroll = renderAutoScrollDirective

for (const node of nodeDefs) nodeStates[node.id] = 'idle'

const started = computed(() => Boolean(activeQuestion.value))
const resultCards = computed(() => nodeDefs.map((node) => nodeResults[node.id]).filter(Boolean))

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

function formatRawLine(line) {
  return String(line || '').replace(/\\/g, '')
}

function isInputExpanded(nodeId) {
  return Boolean(inputExpanded[nodeId])
}

function toggleInputExpanded(nodeId) {
  inputExpanded[nodeId] = !inputExpanded[nodeId]
}

function getIoViewMode(nodeId) {
  return ioViewMode[nodeId] || 'raw'
}

function setIoViewMode(nodeId, mode) {
  ioViewMode[nodeId] = mode
}

function onModelChange() {
  saveModelLabel(selectedModelLabel.value || DEFAULT_MODEL_LABEL)
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

function setInputRef(nodeId, el) {
  if (el) inputRefs.set(nodeId, el)
  else inputRefs.delete(nodeId)
}

function setRenderRef(nodeId, el) {
  if (el) renderRefs.set(nodeId, el)
  else renderRefs.delete(nodeId)
}

function scrollToNodeSections(nodeId) {
  const inputEl = inputRefs.get(nodeId)
  const renderEl = renderRefs.get(nodeId)
  if (inputEl) inputEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
  if (renderEl) renderEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    streaming: true,
  })

  nodeResults[node.id] = result
  currentNodeId.value = node.id
  nodeStates[node.id] = 'running'

  await nextTick()

  const controller = new AbortController()
  activeAbortController.value = controller

  await streamChat({
    endpoint: streamEndpoint.value,
    payload: { message: node.input },
    signal: controller.signal,
    onObjects: async (objects) => {
      await applyObjectsProgressively(turn, objects, { applyMessageFn: (targetTurn, payload) => applyMessage(targetTurn, payload) })
      for (const item of objects || []) appendRawLine(result, stringifyPretty(item))
      syncParsed(result)
      await nextTick()
    },
    onError: (e) => {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    },
  })

  result.streaming = false
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

  inputRefs.clear()
  renderRefs.clear()
  for (const node of nodeDefs) {
    nodeStates[node.id] = 'idle'
    delete nodeResults[node.id]
    delete inputExpanded[node.id]
    delete ioViewMode[node.id]
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
  inputRefs.clear()
  renderRefs.clear()
  for (const node of nodeDefs) {
    nodeStates[node.id] = 'idle'
    delete nodeResults[node.id]
    delete inputExpanded[node.id]
    delete ioViewMode[node.id]
  }
}

function selectNode(nodeId) {
  if (!nodeResults[nodeId]) return
  currentNodeId.value = nodeId
  scrollToNodeSections(nodeId)
}

async function handleAction(nodeId, action) {
  const result = nodeResults[nodeId]
  if (!result) return
  result.streaming = true
  await streamChat({
    endpoint: streamEndpoint.value,
    payload: { message: JSON.stringify({ userAction: action }) },
    onObjects: async (objects) => {
      await applyObjectsProgressively(result.turn, objects, { applyMessageFn: (targetTurn, payload) => applyMessage(targetTurn, payload) })
      for (const item of objects || []) appendRawLine(result, stringifyPretty(item))
      syncParsed(result)
      await nextTick()
    },
    onError: (e) => {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    },
  })
  result.streaming = false
}
</script>

<template>
  <main class="page">
    <header class="global-header">
      <button type="button" class="brand" @click="backToHome">COWORKER</button>
      <div class="header-actions">
        <label class="model-picker">
          <span>模型</span>
          <select v-model="selectedModelLabel" class="model-select" @change="onModelChange">
            <option v-for="item in modelOptions" :key="item.value" :value="item.label">{{ item.label }}</option>
          </select>
        </label>
        <RouterLink class="chat-nav-btn" to="/chat">Chat</RouterLink>
      </div>
    </header>

    <section class="workspace">
      <section v-if="!started" class="hero panel">
        <h1 class="hero-brand">无形之界，无限之能</h1>
        <p class="hero-subtitle">界面随需而生，协作自由生长</p>
        <div class="example-list">
          <button v-for="item in sampleQuestions" :key="item.id" class="example-btn" @click="startFlow(item.text)">
            <span class="chart-icon" aria-hidden="true"><i /><i /><i /></span>
            <span class="example-text">{{ item.text }}</span>
          </button>
        </div>
      </section>

      <section v-else class="flow-layout">
        <section class="graph panel">
          <h3>流程节点图谱</h3>
          <FlowNodeGraph
            :nodes="nodeDefs"
            :node-states="nodeStates"
            :active-node-id="currentNodeId"
            :active-edge-id="activeEdgeId"
            @select-node="selectNode"
          />
        </section>

        <section class="result-stage panel">
          <section v-if="resultCards.length" class="result-dual-pane">
            <section ref="inputPanelRef" v-input-auto-scroll class="data-pane">
              <article
                v-for="result in resultCards"
                :key="`input-${result.nodeId}`"
                :ref="(el) => setInputRef(result.nodeId, el)"
                :class="['io-card', { active: currentNodeId === result.nodeId }]"
              >
                <header class="io-head">
                  <h4>{{ result.title }}</h4>
                </header>
                <article class="data-card input-card no-border">
                  <header class="io-mini-head">
                    <h5>Input</h5>
                    <button type="button" class="mini-toggle" @click="toggleInputExpanded(result.nodeId)">
                      {{ isInputExpanded(result.nodeId) ? '收起' : '展开' }}
                    </button>
                  </header>
                  <pre :class="['input-pre', { collapsed: !isInputExpanded(result.nodeId) }]">{{ result.inputText }}</pre>
                </article>
                <article class="data-card io-combined-card">
                  <header class="io-mini-head">
                    <h5>Output</h5>
                    <div class="tab-switch">
                      <button type="button" :class="['tab-btn', { active: getIoViewMode(result.nodeId) === 'raw' }]" @click="setIoViewMode(result.nodeId, 'raw')">Raw</button>
                      <button type="button" :class="['tab-btn', { active: getIoViewMode(result.nodeId) === 'parsed' }]" @click="setIoViewMode(result.nodeId, 'parsed')">Parsed</button>
                    </div>
                  </header>
                  <div v-if="getIoViewMode(result.nodeId) === 'raw'">
                    <p v-for="(line, index) in result.rawLines" :key="`${result.nodeId}-raw-${index}`" class="raw-line">
                      <span class="raw-index">{{ index + 1 }}.</span>
                      <span :class="['raw-text', getRawLineToneClass(line)]">{{ formatRawLine(line) }}</span>
                    </p>
                  </div>
                  <pre v-else class="parsed-pre">{{ result.parsedText }}</pre>
                </article>
              </article>
            </section>

            <section ref="renderPanelRef" v-render-auto-scroll class="render-pane">
              <article
                v-for="result in resultCards"
                :key="`render-${result.nodeId}`"
                :ref="(el) => setRenderRef(result.nodeId, el)"
                :class="['render-card', { active: currentNodeId === result.nodeId }]"
                @click="selectNode(result.nodeId)"
              >
                <div v-if="result.streaming" class="streaming-tip" aria-live="polite">
                  <span class="streaming-tip-core">
                    <span class="streaming-ping" />
                    <span class="streaming-label">渲染中</span>
                    <span class="streaming-dots"><i /><i /><i /></span>
                  </span>
                  <span class="streaming-scanline" />
                </div>

                <div v-if="Object.values(result.turn.surfaces).some((s) => s.ready)" class="surface-wrap">
                  <article
                    v-for="surface in Object.values(result.turn.surfaces).filter((s) => s.ready)"
                    :key="surface.id"
                    class="surface"
                  >
                    <A2UIRenderer
                      :surface="surface"
                      :data-model="result.turn.dataModels[surface.id] || {}"
                      :on-action="(action) => handleAction(result.nodeId, action)"
                    />
                  </article>
                </div>
                <div v-else-if="!result.streaming" class="empty-render">节点执行中，等待 GenUI 卡片数据...</div>
              </article>
            </section>
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
.global-header { height: 52px; border-bottom: 1px solid #d7e3f3; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: rgba(255,255,255,.78); backdrop-filter: blur(8px); }
.brand { font-weight: 800; letter-spacing: .08em; text-transform: uppercase; border: none; background: linear-gradient(90deg, #2563eb, #06b6d4); -webkit-background-clip: text; background-clip: text; color: transparent; cursor: pointer; padding: 0; }
.header-actions { display: flex; align-items: center; gap: 8px; }
.model-picker { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #1e3a8a; }
.model-select { height: 30px; border-radius: 8px; border: 1px solid #bfdbfe; background: #eff6ff; color: #1e3a8a; padding: 0 8px; }
.chat-nav-btn { text-decoration: none; font-size: 12px; color: #1e3a8a; border: 1px solid #bfdbfe; background: #eff6ff; border-radius: 10px; padding: 6px 10px; }
.chat-nav-btn:hover { background: #dbeafe; }
.workspace { flex: 1; padding: 16px; min-height: 0; }
.panel { border: none; border-radius: 0; background: transparent; box-shadow: none; }
.hero { height: 100%; display: grid; place-content: center; text-align: center; gap: 14px; padding: 24px; }
.hero-brand { margin: 0; font-size: 34px; background: linear-gradient(90deg, #60a5fa 0%, #38bdf8 48%, #22d3ee 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
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

.result-stage { min-height: 0; padding: 0; }
.result-dual-pane { height: 100%; display: grid; grid-template-columns: 1fr 2fr; gap: 12px; min-height: 0; }
.data-pane { overflow: auto; min-height: 0; display: flex; flex-direction: column; gap: 16px; padding-right: 6px; }
.render-pane { overflow: auto; }
.io-card, .render-card { border: 1px solid #dbe4f3; border-radius: 12px; background: #fff; padding: 12px; margin-bottom: 2px; }
.io-card { margin-top: 20px; }
.io-card.active, .render-card.active { border-color: #60a5fa; box-shadow: 0 0 0 2px rgba(96,165,250,.2); }
.io-card { font-size: 12px; }
.io-head { display: flex; align-items: baseline; margin-bottom: 8px; }
.io-head h4 { margin: 0; }
.data-card { border: 1px solid #dbe4f3; border-radius: 12px; padding: 10px; background: #ffffff; margin-top: 10px; }
.data-card h5 { margin: 0 0 8px; }

.raw-line { margin: 0 0 6px; font-size: 12px; display: flex; gap: 6px; white-space: pre-wrap; }
.raw-index { color: #94a3b8; }
.raw-text { white-space: pre-wrap; word-break: break-word; font-size: 12px; line-height: 1.5; }
.raw-text-data-model { color: #b45309; }
.raw-text-surface { color: #0f766e; }

.io-mini-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.io-mini-head h5 { margin: 0; font-size: 16px; font-weight: 600; }
.mini-toggle { border: 1px solid #bfdbfe; background: #eff6ff; color: #1e3a8a; border-radius: 8px; padding: 2px 8px; font-size: 12px; cursor: pointer; }
.no-border { border: none; background: transparent; padding: 0; }
.input-pre, .parsed-pre { margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 12px; line-height: 1.5; }
.input-pre.collapsed { display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
.io-combined-card { margin-top: 10px; }
.tab-switch { display: inline-flex; gap: 6px; }
.tab-btn { border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; border-radius: 8px; padding: 2px 8px; font-size: 12px; cursor: pointer; }
.tab-btn.active { border-color: #60a5fa; background: #dbeafe; color: #1e3a8a; }
.render-card { cursor: pointer; min-height: 180px; position: relative; overflow: hidden; margin-top: 20px; }

.surface-wrap { display: grid; gap: 12px; }
.empty-render { min-height: 120px; display: grid; place-content: center; color: #64748b; }
.error { margin: 0; color: #dc2626; }

.streaming-tip {
  position: relative;
  margin: 8px 0 12px;
  border: 1px solid rgba(59, 130, 246, 0.35);
  background: linear-gradient(90deg, rgba(59,130,246,.08), rgba(56,189,248,.12));
  border-radius: 10px;
  padding: 8px 10px;
  overflow: hidden;
}
.streaming-tip-core { display: inline-flex; align-items: center; gap: 8px; color: #1d4ed8; font-size: 13px; font-weight: 600; }
.streaming-ping { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; box-shadow: 0 0 0 0 rgba(59,130,246,.45); animation: ping 1.2s infinite; }
.streaming-dots i { display: inline-block; width: 4px; height: 4px; margin-left: 3px; border-radius: 50%; background: #2563eb; animation: dot-flash 1.2s infinite; }
.streaming-dots i:nth-child(2) { animation-delay: .2s; }
.streaming-dots i:nth-child(3) { animation-delay: .4s; }
.streaming-scanline { position: absolute; top: 0; bottom: 0; width: 28%; background: linear-gradient(90deg, transparent, rgba(191,219,254,.55), transparent); animation: scanline 1.5s linear infinite; }
@keyframes ping { 0% { box-shadow: 0 0 0 0 rgba(59,130,246,.45); } 70% { box-shadow: 0 0 0 8px rgba(59,130,246,0); } 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); } }
@keyframes dot-flash { 0%, 80%, 100% { opacity: .35; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-2px); } }
@keyframes scanline { from { transform: translateX(-120%); } to { transform: translateX(420%); } }

@media (max-width: 1080px) {
  .example-list { grid-template-columns: 1fr; max-width: 820px; }
  .result-dual-pane { grid-template-columns: 1fr; }
}
</style>
