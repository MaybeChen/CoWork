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
const columns = computed(() => {
  if (Array.isArray(spec.value?.columns) && spec.value.columns.length) return spec.value.columns
  const firstRow = Array.isArray(spec.value?.rows) ? spec.value.rows[0] : null
  if (!firstRow || typeof firstRow !== 'object') return []
  return Object.keys(firstRow).map((key) => ({ key, label: key, align: 'left' }))
})
const rows = computed(() => (Array.isArray(spec.value?.rows) ? spec.value.rows : []))
const striped = computed(() => Boolean(spec.value?.striped))
const rowKey = computed(() => (spec.value?.row_key ? String(spec.value.row_key) : undefined))
const headerCellStyle = { background: '#12151d', color: '#b4bfd3' }
const rowStyle = { background: '#12151d', color: '#dce4f2' }
const cellStyle = { background: '#12151d', color: '#dce4f2' }

function normalizeWidth(width) {
  if (!width || width === 'auto') return undefined
  return String(width)
}
</script>

<template>
  <div v-if="!hidden" class="a2-table-wrap" :class="customClasses" :style="styleObject">
    <div v-if="title" class="a2-table-title">{{ title }}</div>
    <el-table
      :data="rows"
      :stripe="striped"
      :border="true"
      :row-key="rowKey"
      :header-cell-style="headerCellStyle"
      :row-style="rowStyle"
      :cell-style="cellStyle"
      style="width: 100%; --el-table-border-color: rgba(120, 130, 148, 0.45);"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.key"
        :prop="col.key"
        :label="col.label"
        :align="col.align || 'left'"
        :width="normalizeWidth(col.width)"
      />
    </el-table>
  </div>
</template>

<style scoped>
.a2-table-wrap { width: 100%; }
.a2-table-title { margin-bottom: 8px; font-weight: 600; color: inherit; }
</style>
