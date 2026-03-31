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

const specRaw = computed(() => resolveValue(props.dataModel, props.payload?.spec ?? props.payload?.tableSpec))
const spec = computed(() => {
  const raw = specRaw.value
  if (!raw) return {}
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return {}
    }
  }
  return typeof raw === 'object' ? raw : {}
})

const title = computed(() => resolveText(props.dataModel, spec.value?.title || ''))
const columns = computed(() => (Array.isArray(spec.value?.columns) ? spec.value.columns : []))
const rows = computed(() => (Array.isArray(spec.value?.rows) ? spec.value.rows : []))

function normalizeWidth(width) {
  if (!width || width === 'auto') return undefined
  return String(width)
}
</script>

<template>
  <div v-if="!hidden" class="a2-table-wrap" :class="customClasses" :style="styleObject">
    <div v-if="title" class="a2-table-title">{{ title }}</div>
    <sweet-table :data="rows" style="width: 100%">
      <sweet-table-column
        v-for="col in columns"
        :key="col.key"
        :prop="col.key"
        :label="col.label"
        :align="col.align || 'left'"
        :width="normalizeWidth(col.width)"
      />
    </sweet-table>
  </div>
</template>

<style scoped>
.a2-table-wrap { width: 100%; }
.a2-table-title { margin-bottom: 8px; font-weight: 600; color: inherit; }
</style>
