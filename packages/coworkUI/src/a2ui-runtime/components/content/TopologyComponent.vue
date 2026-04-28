<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveText, resolveValue } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
})

const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

const containerRef = ref(null)
const graphError = ref('')
const graphHeight = ref(420)
let graph = null
let G6Lib = null

const rawSpec = computed(() => resolveValue(props.dataModel, props.payload?.spec ?? props.payload?.topologySpec))

function parseJsonLike(value, fallback) {
  if (value == null || value === '') return fallback

  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return fallback
    }
  }

  if (typeof value === 'object') {
    const wrapped = value.valueString ?? value.stringData ?? value.valueJson ?? value.jsonData
    if (typeof wrapped === 'string') {
      try {
        return JSON.parse(wrapped)
      } catch {
        return fallback
      }
    }
    return value
  }

  return fallback
}

const spec = computed(() => parseJsonLike(rawSpec.value, {}))
const title = computed(() => resolveText(props.dataModel, spec.value?.title || props.payload?.title || '拓扑图'))

const alarmIcon = new URL('../../assets/alarm.svg', import.meta.url).href
const kpiIcon = new URL('../../assets/kpi.svg', import.meta.url).href
const normalIcon = new URL('../../assets/normal.png', import.meta.url).href

const laneColorPalette = [
  'l(0) 0:#9ca3af 1:#6b7280',
  'l(0) 0:#94a3b8 1:#64748b',
  'l(0) 0:#818cf8 1:#6366f1',
  'l(0) 0:#60a5fa 1:#2563eb',
  'l(0) 0:#34d399 1:#059669',
]

function normalizeGroup(viewGroup = '') {
  const text = String(viewGroup || '').trim()
  if (!text) return '未分组对象'
  const cleaned = text
    .replace(/[：:]/g, '-')
    .split('-')
    .map((part) => part.trim())
    .filter(Boolean)
  return cleaned[0] || text
}

function edgeEndpoints(edge = {}) {
  return {
    source: edge.srcVid || edge.source || edge.from || edge.from_id,
    target: edge.dstVid || edge.target || edge.to || edge.to_id,
  }
}

function shortLabel(raw = '') {
  const text = String(raw || '')
  const last = text.split(':')[3] || text
  return last.length > 16 ? `${last.slice(0, 16)}...` : last
}

function pickNodeIcon(name = '') {
  const text = String(name || '')
  if (text.includes('Alarm') || text.includes('告警')) return alarmIcon
  if (text.includes('KPI')) return kpiIcon
  return normalIcon
}

function registerLaneNodeIfNeeded(G6) {
  if (G6.__trapezoidLaneRegistered) return
  G6.registerNode(
    'trapezoid-lane',
    {
      draw(cfg, group) {
        const width = Number(cfg?.size?.[0] ?? 920)
        const height = Number(cfg?.size?.[1] ?? 82)
        const skew = Number(cfg?.skew ?? 24)
        const fill = String(cfg?.color ?? laneColorPalette[0])
        const label = String(cfg?.label ?? '')
        const path = [
          ['M', -width / 2 + skew, -height / 2],
          ['L', width / 2 - skew, -height / 2],
          ['L', width / 2, height / 2],
          ['L', -width / 2, height / 2],
          ['Z'],
        ]

        const shape = group.addShape('path', {
          attrs: {
            path,
            fill,
            opacity: 0.9,
            stroke: '#d1d5db',
            lineWidth: 1.2,
            shadowBlur: 8,
            shadowColor: 'rgba(15, 23, 42, 0.12)',
            shadowOffsetY: 2,
          },
          name: 'lane-bg',
        })

        const labelWidth = Math.max(72, label.length * 11 + 16)
        const labelHeight = 20
        group.addShape('rect', {
          attrs: {
            x: -width / 2 + 10,
            y: height / 2 - 18 - labelHeight / 2,
            width: labelWidth,
            height: labelHeight,
            radius: 4,
            fill: 'rgba(255, 255, 255, 0.18)',
            stroke: '#cbd5e1',
            lineWidth: 1,
          },
          name: 'lane-label-bg',
        })

        group.addShape('text', {
          attrs: {
            x: -width / 2 + 18,
            y: height / 2 - 18,
            text: label,
            fill: '#f8fafc',
            fontSize: 11,
            textAlign: 'left',
            textBaseline: 'middle',
            fontWeight: 700,
          },
          name: 'lane-label',
        })

        return shape
      },
    },
    'single-node',
  )
  G6.__trapezoidLaneRegistered = true
}

function normalizeObjects(specValue) {
  if (Array.isArray(specValue?.objects)) return specValue.objects
  if (Array.isArray(specValue?.nodes)) {
    return specValue.nodes.map((node) => ({
      id: node.id,
      standardName: node.standardName || node.label || node.id,
      viewGroup: node.viewGroup || node.group || '知识层对象',
    }))
  }
  return []
}

function normalizeEdges(specValue) {
  if (Array.isArray(specValue?.edges)) return specValue.edges
  return []
}

function deriveGroupMeta(objects = [], edges = []) {
  const nodeGroupById = new Map()
  const groupCountMap = new Map()
  const firstSeenGroups = []

  objects.forEach((item) => {
    const groupName = normalizeGroup(item.viewGroup)
    nodeGroupById.set(item.id, groupName)
    groupCountMap.set(groupName, (groupCountMap.get(groupName) || 0) + 1)
    if (!firstSeenGroups.includes(groupName)) firstSeenGroups.push(groupName)
  })

  const graph = new Map(firstSeenGroups.map((name) => [name, new Set()]))
  const indegree = new Map(firstSeenGroups.map((name) => [name, 0]))

  edges.forEach((edge) => {
    const { source, target } = edgeEndpoints(edge)
    if (!source || !target) return
    const srcGroup = nodeGroupById.get(source)
    const dstGroup = nodeGroupById.get(target)
    if (!srcGroup || !dstGroup || srcGroup === dstGroup) return
    const set = graph.get(srcGroup)
    if (!set || set.has(dstGroup)) return
    set.add(dstGroup)
    indegree.set(dstGroup, (indegree.get(dstGroup) || 0) + 1)
  })

  const queue = firstSeenGroups.filter((name) => (indegree.get(name) || 0) === 0)
  const orderedGroups = []

  while (queue.length) {
    const current = queue.shift()
    orderedGroups.push(current)
    const neighbors = graph.get(current) || new Set()
    neighbors.forEach((next) => {
      indegree.set(next, (indegree.get(next) || 0) - 1)
      if ((indegree.get(next) || 0) === 0) queue.push(next)
    })
  }

  firstSeenGroups.forEach((name) => {
    if (!orderedGroups.includes(name)) orderedGroups.push(name)
  })

  const laneStart = 48
  const laneGap = 38
  const groupMetaMap = new Map()
  let currentTop = laneStart

  orderedGroups.forEach((groupName, index) => {
    const count = groupCountMap.get(groupName) || 1
    const rows = Math.max(1, Math.ceil(count / 4))
    const laneHeight = Math.max(86, 86 + Math.max(rows - 1, 0) * 78)
    const centerY = currentTop + laneHeight / 2
    groupMetaMap.set(groupName, {
      y: centerY,
      color: laneColorPalette[index % laneColorPalette.length],
      index,
      rows,
      laneHeight,
    })
    currentTop += laneHeight + laneGap
  })

  return {
    orderedGroups,
    groupMetaMap,
    nodeGroupById,
    totalHeight: Math.max(300, currentTop + 16),
  }
}

function arrangeGraphLayers() {
  if (!graph) return
  graph.getNodes().forEach((nodeItem) => {
    const model = nodeItem.getModel()
    if (model.isLayer) nodeItem.toBack()
  })
  graph.getEdges().forEach((edgeItem) => edgeItem.toFront())
  graph.getNodes().forEach((nodeItem) => {
    const model = nodeItem.getModel()
    if (!model.isLayer) nodeItem.toFront()
  })
}

function applyZoom(nextZoom) {
  if (!graph || !containerRef.value) return
  const value = Math.max(0.4, Math.min(2.5, nextZoom))
  graph.zoomTo(value, {
    x: Math.max(containerRef.value.clientWidth, 760) / 2,
    y: graphHeight.value / 2,
  })
}

function zoomIn() {
  if (!graph) return
  applyZoom(graph.getZoom() + 0.1)
}

function zoomOut() {
  if (!graph) return
  applyZoom(graph.getZoom() - 0.1)
}

async function ensureG6Loaded() {
  if (G6Lib) return G6Lib
  const module = await import('@antv/g6')
  G6Lib = module.default || module
  registerLaneNodeIfNeeded(G6Lib)
  return G6Lib
}

function cleanupGraph() {
  if (graph) {
    graph.destroy()
    graph = null
  }
}

async function renderGraph() {
  if (!containerRef.value || hidden.value) return
  const objects = normalizeObjects(spec.value)
  const edgesInput = normalizeEdges(spec.value)
  if (!objects.length) {
    cleanupGraph()
    return
  }

  try {
    graphError.value = ''
    const G6 = await ensureG6Loaded()
    cleanupGraph()

    const width = Math.max(containerRef.value.clientWidth, 760)
    const { orderedGroups, groupMetaMap, totalHeight } = deriveGroupMeta(objects, edgesInput)
    graphHeight.value = totalHeight

    const groups = new Map()
    objects.forEach((obj) => {
      const group = normalizeGroup(obj.viewGroup)
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group).push(obj)
    })

    const laneNodes = orderedGroups.map((group) => ({
      id: `layer-${group}`,
      type: 'trapezoid-lane',
      x: Math.round(width / 2),
      y: groupMetaMap.get(group).y,
      label: group,
      size: [Math.max(width - 60, 560), groupMetaMap.get(group)?.laneHeight || 86],
      color: groupMetaMap.get(group).color,
      skew: 24,
      isLayer: true,
    }))

    const dataNodes = Array.from(groups.entries()).flatMap(([group, items]) => {
      const sorted = [...items].sort((a, b) => String(a.standardName || '').localeCompare(String(b.standardName || '')))
      const groupMeta = groupMetaMap.get(group)
      const rowGap = 78
      const yStart = (groupMeta?.y ?? totalHeight - 120) - (Math.max((groupMeta?.rows ?? 1) - 1, 0) * rowGap) / 2

      return sorted.map((item, index) => ({
        ...(function position() {
          const rowIndex = Math.floor(index / 4)
          const colIndex = index % 4
          const rowCount = Math.min(4, sorted.length - rowIndex * 4)
          const spacing = width / (rowCount + 1)
          return {
            x: Math.round((colIndex + 1) * spacing),
            y: Math.round(yStart + rowIndex * rowGap),
          }
        })(),
        id: item.id,
        label: shortLabel(item.standardName || item.id),
        fullLabel: item.standardName || item.id,
        group,
        type: 'image',
        img: pickNodeIcon(item.standardName || item.id),
        size: 32,
        isLayer: false,
        labelCfg: {
          style: {
            fontSize: 9,
            fill: '#f8fafc',
            fontWeight: 400,
          },
          position: 'bottom',
          offset: 10,
        },
      }))
    })

    const edges = edgesInput
      .map((edge, index) => {
        const { source, target } = edgeEndpoints(edge)
        if (!source || !target) return null

        const functionDescription = edge.function?.description || edge.function?.desc || ''
        const isThreshold = edge.function?.type === 'Threshold'
        const label = functionDescription
          || (isThreshold
            ? `${edge.function?.operator || ''} ${edge.function?.value ?? ''}`.trim()
            : edge.bizSemanticRel || edge.label || '')

        return {
          id: `e-${index}`,
          source,
          target,
          label,
          style: {
            stroke: '#9ca3af',
            lineWidth: 1,
            endArrow: true,
            lineDash: undefined,
            opacity: 1,
          },
          labelCfg: {
            autoRotate: true,
            style: {
              fill: '#6b7280',
              fontSize: 10,
              fontWeight: 400,
            },
          },
        }
      })
      .filter(Boolean)

    graph = new G6.Graph({
      container: containerRef.value,
      width,
      height: totalHeight,
      modes: { default: ['drag-canvas', 'zoom-canvas'] },
      defaultNode: { type: 'circle' },
      defaultEdge: { type: 'cubic-horizontal' },
      nodeStateStyles: {
        selected: {
          lineWidth: 3,
          stroke: '#facc15',
          shadowBlur: 14,
          shadowColor: 'rgba(250, 204, 21, 0.95)',
          shadowOffsetX: 0,
          shadowOffsetY: 0,
        },
      },
      edgeStateStyles: {
        hover: {
          stroke: '#22c55e',
          lineWidth: 3,
          opacity: 1,
        },
        active: {
          stroke: '#facc15',
          lineWidth: 3,
          shadowBlur: 14,
          shadowColor: 'rgba(37, 99, 235, 0.85)',
          opacity: 1,
        },
      },
    })

    graph.data({ nodes: [...laneNodes, ...dataNodes], edges })
    graph.render()

    arrangeGraphLayers()

    graph.on('node:click', (evt) => {
      const currentNode = evt.item
      if (!currentNode) return
      const currentModel = currentNode.getModel()
      if (currentModel.isLayer) return

      graph.getNodes().forEach((nodeItem) => {
        const model = nodeItem.getModel()
        graph.setItemState(nodeItem, 'selected', !model.isLayer && nodeItem.getID() === currentNode.getID())
      })

      graph.getEdges().forEach((edge) => {
        const model = edge.getModel()
        const connected = model.source === currentNode.getID() || model.target === currentNode.getID()
        graph.setItemState(edge, 'active', connected)
        if (!connected) graph.clearItemStates(edge, ['hover'])
        if (connected) edge.toFront()
      })
    })

    graph.on('edge:mouseenter', (evt) => {
      const edge = evt.item
      if (!edge || edge.hasState('active')) return
      graph.setItemState(edge, 'hover', true)
      edge.toFront()
    })

    graph.on('edge:mouseleave', (evt) => {
      const edge = evt.item
      if (!edge || edge.hasState('active')) return
      graph.setItemState(edge, 'hover', false)
    })

    graph.on('canvas:click', () => {
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node, ['selected'])
      })
      graph.getEdges().forEach((edge) => {
        graph.clearItemStates(edge, ['active', 'hover'])
      })
      arrangeGraphLayers()
    })
  } catch (error) {
    cleanupGraph()
    graphError.value = `拓扑组件渲染失败：${error?.message || '未知错误'}`
  }
}

function onResize() {
  renderGraph()
}

onMounted(() => {
  renderGraph()
  window.addEventListener('resize', onResize)
})

watch([spec, hidden], () => {
  renderGraph()
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  cleanupGraph()
})
</script>

<template>
  <div v-if="!hidden" class="a2-topology-wrap" :class="customClasses" :style="styleObject">
    <div class="a2-topology-title">{{ title }}</div>
    <div class="a2-topology-toolbar">
      <button type="button" class="a2-topology-btn" @click="zoomOut">-</button>
      <button type="button" class="a2-topology-btn" @click="zoomIn">+</button>
    </div>
    <div ref="containerRef" class="a2-topology-graph" :style="{ minHeight: `${graphHeight}px` }" />
    <div v-if="graphError" class="a2-topology-error">{{ graphError }}</div>
  </div>
</template>

<style scoped>
.a2-topology-wrap {
  width: 100%;
  min-width: 680px;
  max-width: 100%;
  border: 1px solid var(--n-20, #dbeafe);
  border-radius: 12px;
  padding: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 8px 20px rgba(148, 163, 184, 0.16);
}

.a2-topology-title {
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--n-90, #0f172a);
}

.a2-topology-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.a2-topology-btn {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #0f172a;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 12px;
  cursor: pointer;
}

.a2-topology-graph {
  width: 100%;
  min-height: 320px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: linear-gradient(180deg, #f3f4f6 0%, #e5e7eb 100%);
}

.a2-topology-error {
  margin-top: 8px;
  font-size: 12px;
  color: #dc2626;
}
</style>
