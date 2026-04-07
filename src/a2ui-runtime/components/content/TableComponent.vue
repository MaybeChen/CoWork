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

function readCellValue(cell) {
  if (cell && typeof cell === 'object' && !Array.isArray(cell) && 'value' in cell) return cell.value
  return cell
}

function readVisualWeight(cell) {
  if (!cell || typeof cell !== 'object' || Array.isArray(cell)) return null
  const n = Number(cell.visual_weight)
  if (!Number.isFinite(n)) return null
  return n
}

function cellText(cell) {
  const value = readCellValue(cell)
  if (value == null) return ''
  return String(value)
}

function weightClass(cell) {
  const weight = readVisualWeight(cell)
  if (weight >= 1 && weight <= 6) return `a2-vw-${weight}`
  return ''
}
</script>

<template>
  <div v-if="!hidden" class="a2-table-wrap" :class="customClasses" :style="styleObject">
    <div v-if="title" class="a2-table-title">{{ title }}</div>
    <sweet-table
      :data="rows"
      :stripe="striped"
      :border="true"
      :row-key="rowKey"
      style="width: 100%;"
    >
      <sweet-table-column
        v-for="col in columns"
        :key="col.key"
        :label="col.label"
      >
        <template #default="scope">
          <p class="a2-table-cell" :class="weightClass(scope.row[col.key])">
            {{ cellText(scope.row[col.key]) }}
          </p>
        </template>
      </sweet-table-column>
    </sweet-table>
  </div>
</template>

<style scoped>
.a2-table-title { margin-bottom: 8px; font-weight: 600; color: inherit; }
.a2-table-cell {
  margin: 0;
  border-radius: 6px;
  padding: 4px 8px;
}
.a2-vw-1 { background: rgba(34, 197, 94, 0.12); }
.a2-vw-2 { background: rgba(132, 204, 22, 0.14); }
.a2-vw-3 { background: rgba(250, 204, 21, 0.16); }
.a2-vw-4 { background: rgba(251, 146, 60, 0.18); }
.a2-vw-5 { background: rgba(248, 113, 113, 0.2); }
.a2-vw-6 { background: rgba(239, 68, 68, 0.26); }
</style>
