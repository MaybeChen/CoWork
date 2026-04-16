<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveText, resolveValue } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
})

const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

const specRaw = computed(() => resolveValue(props.dataModel, props.payload?.spec ?? props.payload?.pieChartSpec))

function parseJsonLike(value, fallback) {
  if (value == null || value === '') return fallback
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return fallback
    }
  }
  return typeof value === 'object' ? value : fallback
}

const spec = computed(() => {
  return parseJsonLike(specRaw.value, {})
})

const title = computed(() => resolveText(props.dataModel, spec.value?.title || props.payload?.title || ''))
function normalizeWidth(value) {
  if (value == null || value === '') return '100%'
  if (typeof value === 'number') return `${value}px`
  const widthValue = String(value).trim()
  if (/^\d+(\.\d+)?$/.test(widthValue)) return `${widthValue}px`
  return widthValue
}

const width = computed(() => normalizeWidth(spec.value?.width ?? props.payload?.width))
const settings = computed(() => {
  const raw = spec.value?.settings ?? props.payload?.settings
  return parseJsonLike(raw, {})
})
const chartData = computed(() => {
  const raw = spec.value?.chartData ?? spec.value?.chart_data ?? props.payload?.chartData
  let datas = []
  if (typeof raw === 'string') {
    const parsed = parseJsonLike(raw, [])
    datas = Array.isArray(parsed) ? parsed : []
  } else {
    datas = Array.isArray(raw) ? raw : []
  }
  datas.forEach(item => (item.radius = '50%'))
  return datas
})
</script>

<template>
  <div v-if="!hidden" class="a2-pie-chart-wrap" :class="customClasses" :style="styleObject">
    <div v-if="title" class="a2-pie-chart-title">{{ title }}</div>
    <sweet-pie-chart
      v-if="chartData && chartData.length > 0"
      :settings="settings"
      :chartData="chartData"
      :width="width"
    />
  </div>
</template>

<style scoped>
.a2-pie-chart-wrap {
  width: 100%;
  max-width: 100%;
  border: 1px solid rgba(138, 164, 255, 0.14);
  border-radius: 8px;
  padding: 22px 22px 18px;
  background: linear-gradient(180deg, #0b1220 0%, #0d1526 100%);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.a2-pie-chart-title {
  margin-bottom: 8px;
  font-weight: 600;
  color: inherit;
}
</style>
