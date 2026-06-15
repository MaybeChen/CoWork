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
.a2-table-wrap {
  color: var(--swt-color-text-primary);
  --el-table-bg-color: var(--swt-color-bg-primary);
  --el-table-tr-bg-color: var(--swt-color-bg-primary);
  --el-table-header-bg-color: var(--swt-color-bg-secondary);
  --el-table-text-color: var(--swt-color-text-primary);
  --el-table-header-text-color: var(--swt-color-text-primary);
  --el-table-border-color: var(--swt-color-dividing-line-secondary);
  --el-table-row-hover-bg-color: var(--swt-color-bg-selected);
  --el-table-current-row-bg-color: var(--swt-color-bg-selected);
  --el-fill-color-lighter: var(--swt-color-overlay-gray1-and-gray12-opacity5);
}
.a2-table-title {
  margin-bottom: var(--swt-space-size-8);
  font-weight: var(--swt-font-weight-bold);
  color: var(--swt-color-text-primary);
}
.a2-table-wrap :deep(.el-table),
.a2-table-wrap :deep(.el-table__inner-wrapper),
.a2-table-wrap :deep(.el-table th.el-table__cell),
.a2-table-wrap :deep(.el-table td.el-table__cell) {
  background-color: var(--swt-color-bg-primary);
  color: var(--swt-color-text-primary);
  border-color: var(--swt-color-dividing-line-secondary);
}
.a2-table-wrap :deep(.el-table th.el-table__cell) {
  background-color: var(--swt-color-bg-secondary);
}
.a2-table-wrap :deep(.el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: var(--swt-color-overlay-gray1-and-gray12-opacity5);
}
.a2-table-cell {
  margin: 0;
  border-radius: var(--swt-space-size-8);
  padding: var(--swt-space-size-4) var(--swt-space-size-8);
  color: inherit;
  white-space: normal;
  width: fit-content;
  max-width: 100%;
}
</style>
