<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const START_NODE_ID = '__start__'

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  nodeStates: { type: Object, default: () => ({}) },
  activeNodeId: { type: String, default: '' },
  activeEdgeId: { type: String, default: '' },
})

const emit = defineEmits(['select-node'])

const trackRef = ref(null)
const canvasRef = ref(null)
const nodeRects = new Map()
let resizeObserver
let rafId = 0
let animationStart = 0

function getDisplayNodes() {
  return [{ id: START_NODE_ID, title: '开始', virtual: true }, ...props.nodes.map((node) => ({ ...node, virtual: false }))]
}

function getNodeState(node) {
  if (node.virtual) return 'start'
  return props.nodeStates[node.id] || 'idle'
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function resolveNodePalette(node, selected) {
  const state = getNodeState(node)
  if (state === 'start') {
    return {
      fill: '#eff6ff',
      stroke: '#93c5fd',
      text: '#1e3a8a',
      shadow: selected ? 'rgba(59,130,246,0.3)' : '',
    }
  }
  if (state === 'running') {
    return { fill: '#dbeafe', stroke: '#60a5fa', text: '#1e3a8a', shadow: 'rgba(59,130,246,0.35)' }
  }
  if (state === 'done') {
    return { fill: '#dcfce7', stroke: '#86efac', text: '#166534', shadow: '' }
  }
  if (state === 'error') {
    return { fill: '#fee2e2', stroke: '#fca5a5', text: '#991b1b', shadow: '' }
  }
  return { fill: '#eff6ff', stroke: '#bfdbfe', text: '#1e3a8a', shadow: '' }
}

function drawGraph(elapsed = 0) {
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

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, rect.width, rect.height)

  const displayNodes = getDisplayNodes()
  if (!displayNodes.length) return

  const horizontalPadding = 12
  const gap = 12
  const nodeWidth = Math.max(90, (rect.width - horizontalPadding * 2 - gap * (displayNodes.length - 1)) / displayNodes.length)
  const nodeHeight = 72
  const top = Math.max(8, (rect.height - nodeHeight) / 2)

  nodeRects.clear()
  const centers = displayNodes.map((node, index) => {
    const x = horizontalPadding + index * (nodeWidth + gap)
    const y = top
    nodeRects.set(node.id, { x, y, width: nodeWidth, height: nodeHeight, node })
    return { id: node.id, x: x + nodeWidth / 2, y: y + nodeHeight / 2, virtual: node.virtual }
  })

  for (let i = 0; i < centers.length - 1; i += 1) {
    const from = centers[i]
    const to = centers[i + 1]
    const edgeId = `${from.id}-${to.id}`
    const active = !from.virtual && !to.virtual && props.activeEdgeId === edgeId

    ctx.save()
    ctx.strokeStyle = active ? '#3b82f6' : '#cbd5e1'
    ctx.lineWidth = active ? 3 : 2
    if (from.virtual || to.virtual) ctx.setLineDash([5, 4])
    if (active) {
      ctx.shadowColor = 'rgba(59,130,246,0.35)'
      ctx.shadowBlur = 8
    }
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.restore()

    if (active) {
      const progress = ((elapsed % 1200) / 1200)
      const dotX = from.x + (to.x - from.x) * progress
      const dotY = from.y + (to.y - from.y) * progress

      ctx.save()
      const gradient = ctx.createRadialGradient(dotX, dotY, 0, dotX, dotY, 7)
      gradient.addColorStop(0, 'rgba(191,219,254,1)')
      gradient.addColorStop(0.5, 'rgba(96,165,250,0.95)')
      gradient.addColorStop(1, 'rgba(59,130,246,0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(dotX, dotY, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  for (const node of displayNodes) {
    const rectInfo = nodeRects.get(node.id)
    if (!rectInfo) continue

    const selected = !node.virtual && props.activeNodeId === node.id
    const palette = resolveNodePalette(node, selected)

    ctx.save()
    if (palette.shadow) {
      ctx.shadowColor = palette.shadow
      ctx.shadowBlur = 12
    }
    roundedRect(ctx, rectInfo.x, rectInfo.y, rectInfo.width, rectInfo.height, 12)
    ctx.fillStyle = palette.fill
    ctx.strokeStyle = palette.stroke
    ctx.lineWidth = selected ? 2 : 1
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = palette.text
    ctx.font = '600 14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.title, rectInfo.x + rectInfo.width / 2, rectInfo.y + rectInfo.height / 2)
    ctx.restore()
  }
}

function renderFrame(timestamp) {
  if (!animationStart) animationStart = timestamp
  drawGraph(timestamp - animationStart)
  if (props.activeEdgeId) rafId = requestAnimationFrame(renderFrame)
}

function startAnimation() {
  stopAnimation()
  if (!props.activeEdgeId) {
    nextTick(() => drawGraph(0))
    return
  }
  animationStart = 0
  rafId = requestAnimationFrame(renderFrame)
}

function stopAnimation() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

function handleTrackClick(event) {
  const trackEl = trackRef.value
  if (!trackEl) return
  const rect = trackEl.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  for (const [, hit] of nodeRects) {
    const inside = x >= hit.x && x <= hit.x + hit.width && y >= hit.y && y <= hit.y + hit.height
    if (!inside) continue
    if (hit.node.virtual) return
    emit('select-node', hit.node.id)
    return
  }
}

onMounted(() => {
  startAnimation()
  window.addEventListener('resize', startAnimation)

  if (typeof ResizeObserver === 'function' && trackRef.value) {
    resizeObserver = new ResizeObserver(() => {
      startAnimation()
    })
    resizeObserver.observe(trackRef.value)
  }
})

onBeforeUnmount(() => {
  stopAnimation()
  window.removeEventListener('resize', startAnimation)
  if (resizeObserver) resizeObserver.disconnect()
})

watch(
  () => [props.nodes, props.nodeStates, props.activeNodeId],
  () => nextTick(() => drawGraph(0)),
  { deep: true },
)

watch(() => props.activeEdgeId, () => nextTick(startAnimation))
</script>

<template>
  <div ref="trackRef" class="graph-track" @click="handleTrackClick">
    <canvas ref="canvasRef" class="graph-canvas" aria-label="流程节点图谱" role="img" />
  </div>
</template>

<style scoped>
.graph-track {
  position: relative;
  height: calc(100% - 28px);
  min-height: 96px;
}

.graph-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
}
</style>
