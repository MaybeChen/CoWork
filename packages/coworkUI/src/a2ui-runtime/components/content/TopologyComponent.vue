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
        const skew = Number(cfg?.skew ?? 42)
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

        group.addShape('text', {
          attrs: {
            x: -width / 2 + 14,
            y: height / 2 - 8,
            text: label,
            fill: '#e5e7eb',
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
  const firstSeenGroups = []

  objects.forEach((item) => {
    const groupName = normalizeGroup(item.viewGroup)
    nodeGroupById.set(item.id, groupName)
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

  const laneStart = 90
  const laneGap = 160
  const groupMetaMap = new Map()

  orderedGroups.forEach((groupName, index) => {
    groupMetaMap.set(groupName, {
      y: laneStart + index * laneGap,
      color: laneColorPalette[index % laneColorPalette.length],
      index,
    })
  })

  return {
    orderedGroups,
    groupMetaMap,
    nodeGroupById,
    totalHeight: Math.max(760, laneStart + Math.max(orderedGroups.length - 1, 0) * laneGap + 180),
  }
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
      size: [Math.max(width - 60, 560), 86],
      color: groupMetaMap.get(group).color,
      skew: 48,
      isLayer: true,
    }))

    const dataNodes = Array.from(groups.entries()).flatMap(([group, items]) => {
      const sorted = [...items].sort((a, b) => String(a.standardName || '').localeCompare(String(b.standardName || '')))
      const spacing = width / (sorted.length + 1)
      const y = groupMetaMap.get(group)?.y ?? totalHeight - 120

      return sorted.map((item, index) => ({
        id: item.id,
        label: shortLabel(item.standardName || item.id),
        fullLabel: item.standardName || item.id,
        group,
        type: 'image',
        img: pickNodeIcon(item.standardName || item.id),
        x: Math.round((index + 1) * spacing),
        y,
        size: 32,
        isLayer: false,
        labelCfg: {
          style: {
            fontSize: 10,
            fill: '#f8fafc',
            fontWeight: 600,
          },
          position: 'bottom',
          offset: 8,
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
              fill: '#0f172a',
              fontSize: 11,
              fontWeight: 600,
              background: {
                fill: '#f8fafce6',
                radius: 2,
                padding: [2, 4, 2, 4],
              },
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

    graph.getEdges().forEach((edgeItem) => edgeItem.toFront())
    graph.getNodes().forEach((nodeItem) => {
      const model = nodeItem.getModel()
      if (!model.isLayer) nodeItem.toFront()
    })

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
      })
    })

    graph.on('edge:mouseenter', (evt) => {
      const edge = evt.item
      if (!edge || graph.hasItemState(edge, 'active')) return
      graph.setItemState(edge, 'hover', true)
    })

    graph.on('edge:mouseleave', (evt) => {
      const edge = evt.item
      if (!edge || graph.hasItemState(edge, 'active')) return
      graph.setItemState(edge, 'hover', false)
    })

    graph.on('canvas:click', () => {
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node, ['selected'])
      })
      graph.getEdges().forEach((edge) => {
        graph.clearItemStates(edge, ['active', 'hover'])
      })
    })
  } catch (error) {
    cleanupGraph()
    graphError.value = `拓扑组件渲染失败：${error?.message || '未知错误'}`
  }
}

function onResize() {
  if (!graph || !containerRef.value) return
  graph.changeSize(Math.max(containerRef.value.clientWidth, 760), graph.get('height'))
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
    <div ref="containerRef" class="a2-topology-graph" />
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

.a2-topology-graph {
  width: 100%;
  min-height: 760px;
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
