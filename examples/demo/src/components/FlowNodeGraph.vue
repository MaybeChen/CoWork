<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  nodeStates: { type: Object, default: () => ({}) },
  activeNodeId: { type: String, default: '' },
  activeEdgeId: { type: String, default: '' },
  formatNodeInputPreview: { type: Function, required: true },
})

const emit = defineEmits(['select-node'])

const trackRef = ref(null)
const canvasRef = ref(null)
const nodeRefs = new Map()
let resizeObserver

function setNodeRef(nodeId, el) {
  if (el) nodeRefs.set(nodeId, el)
  else nodeRefs.delete(nodeId)
}

function drawGraph() {
  const trackEl = trackRef.value
  const canvasEl = canvasRef.value
  if (!trackEl || !canvasEl) return

  const rect = trackEl.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvasEl.width = Math.max(1, Math.floor(rect.width * dpr))
  canvasEl.height = Math.max(1, Math.floor(rect.height * dpr))
  canvasEl.style.width = `${rect.width}px`
  canvasEl.style.height = `${rect.height}px`

  const ctx = canvasEl.getContext('2d')
  if (!ctx) return
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, rect.width, rect.height)

  const centerPoints = props.nodes
    .map((node) => {
      const nodeEl = nodeRefs.get(node.id)
      if (!nodeEl) return null
      const nodeRect = nodeEl.getBoundingClientRect()
      return {
        id: node.id,
        x: nodeRect.left - rect.left + nodeRect.width / 2,
        y: nodeRect.top - rect.top + nodeRect.height / 2,
      }
    })
    .filter(Boolean)

  for (let i = 0; i < centerPoints.length - 1; i += 1) {
    const from = centerPoints[i]
    const to = centerPoints[i + 1]
    const edgeId = `${from.id}-${to.id}`
    const active = props.activeEdgeId === edgeId

    ctx.save()
    ctx.strokeStyle = active ? '#3b82f6' : '#cbd5e1'
    ctx.lineWidth = active ? 3 : 2
    if (active) {
      ctx.shadowColor = 'rgba(59,130,246,0.35)'
      ctx.shadowBlur = 8
    }
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.restore()
  }
}

function handleNodeClick(nodeId) {
  emit('select-node', nodeId)
}

onMounted(() => {
  nextTick(drawGraph)
  window.addEventListener('resize', drawGraph)

  if (typeof ResizeObserver === 'function' && trackRef.value) {
    resizeObserver = new ResizeObserver(() => {
      drawGraph()
    })
    resizeObserver.observe(trackRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', drawGraph)
  if (resizeObserver) resizeObserver.disconnect()
})

watch(
  () => [props.nodes, props.nodeStates, props.activeNodeId, props.activeEdgeId],
  () => nextTick(drawGraph),
  { deep: true },
)
</script>

<template>
  <div ref="trackRef" class="graph-track">
    <canvas ref="canvasRef" class="graph-canvas" aria-hidden="true" />
    <button
      v-for="node in nodes"
      :key="node.id"
      type="button"
      :class="['node', `state-${nodeStates[node.id]}`, { selected: activeNodeId === node.id }]"
      :ref="(el) => setNodeRef(node.id, el)"
      @click="handleNodeClick(node.id)"
    >
      <span class="node-title">{{ node.title }}</span>
      <small class="node-input">输入: {{ formatNodeInputPreview(node.input) }}</small>
    </button>
  </div>
</template>

<style scoped>
.graph-track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(9, minmax(110px, 1fr));
  gap: 12px;
  align-items: center;
  height: calc(100% - 28px);
}

.graph-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.node {
  z-index: 2;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #eff6ff;
  color: #1e3a8a;
  padding: 8px;
  cursor: pointer;
  display: grid;
  gap: 4px;
  min-height: 72px;
}

.node-title { font-weight: 600; }
.node-input { opacity: .86; }
.state-running { box-shadow: 0 0 0 1px rgba(37,99,235,.35), 0 0 16px rgba(147,197,253,.9); border-color: #60a5fa; background: #dbeafe; }
.state-done { background: #dcfce7; border-color: #86efac; color: #166534; }
.state-error { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
.node.selected { outline: 2px solid #60a5fa; }
</style>
