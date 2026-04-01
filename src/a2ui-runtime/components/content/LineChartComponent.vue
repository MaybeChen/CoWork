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

const specRaw = computed(() => resolveValue(props.dataModel, props.payload?.spec ?? props.payload?.lineChartSpec))

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
const width = computed(() => String(spec.value?.width || props.payload?.width || '100%'))
const settings = computed(() => {
  const raw = spec.value?.settings ?? spec.value?.chartSettings ?? props.payload?.settings
  return parseJsonLike(raw, {})
})
const chartData = computed(() => {
  const raw = spec.value?.chartData ?? spec.value?.chart_data ?? props.payload?.chartData
  if (typeof raw === 'string') {
    const parsed = parseJsonLike(raw, [])
    return Array.isArray(parsed) ? parsed : []
  }
  return Array.isArray(raw) ? raw : []
})
</script>

<template>
  <div v-if="!hidden" class="a2-line-chart-wrap" :class="customClasses" :style="styleObject">
    <div v-if="title" class="a2-line-chart-title">{{ title }}</div>
    <sweet-line-chart
      v-if="chartData && chartData.length > 0"
      :settings="settings"
      :chartData="chartData"
      :width="width"
    />
  </div>
</template>

<style scoped>
.a2-line-chart-wrap {
  width: 100%;
  max-width: 100%;
}

.a2-line-chart-title {
  margin-bottom: 8px;
  font-weight: 600;
  color: inherit;
}
</style>
