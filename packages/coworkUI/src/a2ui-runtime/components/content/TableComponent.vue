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
}
.a2-table-wrap :deep(.el-table) {
  --el-table-bg-color: var(--swt-color-bg-primary);
  --el-table-tr-bg-color: var(--swt-color-bg-primary);
  --el-table-header-bg-color: var(--swt-color-bg-secondary);
  --el-table-text-color: var(--swt-color-text-primary);
  --el-table-header-text-color: var(--swt-color-text-primary);
  --el-table-border-color: var(--swt-color-dividing-line-secondary);
  --el-table-row-hover-bg-color: var(--swt-color-bg-selected);
  --el-table-current-row-bg-color: var(--swt-color-bg-selected);
  --el-bg-color: var(--swt-color-bg-primary);
  --el-bg-color-overlay: var(--swt-color-bg-primary);
  --el-fill-color-blank: var(--swt-color-bg-primary);
  --el-fill-color-lighter: var(--swt-color-bg-secondary);
  --el-text-color-primary: var(--swt-color-text-primary);
  --el-text-color-regular: var(--swt-color-text-primary);
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
  background-color: var(--swt-color-bg-primary) !important;
  color: var(--swt-color-text-primary) !important;
  border-color: var(--swt-color-dividing-line-secondary) !important;
}
.a2-table-wrap :deep(.el-table th.el-table__cell) {
  background-color: var(--swt-color-bg-secondary) !important;
}
.a2-table-wrap :deep(.el-table__body tr.el-table__row--striped td.el-table__cell) {
  background-color: var(--swt-color-bg-secondary) !important;
}
.a2-table-wrap :deep(.el-table__body tr:hover > td.el-table__cell) {
  background-color: var(--swt-color-bg-selected) !important;
}
.a2-table-wrap :deep(.el-table .cell) {
  color: inherit !important;
}
.a2-table-wrap :deep(table) {
  background-color: var(--swt-color-bg-primary);
  color: var(--swt-color-text-primary);
}
.a2-table-wrap :deep(thead th) {
  background-color: var(--swt-color-bg-secondary) !important;
  color: var(--swt-color-text-primary) !important;
}
.a2-table-wrap :deep(tbody tr) {
  background-color: var(--swt-color-bg-primary) !important;
  color: var(--swt-color-text-primary) !important;
}
.a2-table-wrap :deep(tbody tr:nth-child(even)) {
  background-color: var(--swt-color-bg-secondary) !important;
}
.a2-table-wrap :deep(tbody td) {
  background-color: inherit !important;
  color: inherit !important;
}
.a2-table-cell {
  margin: 0;
  border-radius: var(--swt-space-size-8);
  padding: var(--swt-space-size-4) var(--swt-space-size-8);
  color: var(--swt-color-text-primary);
  white-space: normal;
  width: fit-content;
  max-width: 100%;
}
.a2-table-cell.a2-vw-6 { background: var(--a2-vw-6-bg); color: var(--a2-vw-6-fg); }
.a2-table-cell.a2-vw-5 { background: var(--a2-vw-5-bg); color: var(--a2-vw-5-fg); }
.a2-table-cell.a2-vw-4 { background: var(--a2-vw-4-bg); color: var(--a2-vw-4-fg); }
.a2-table-cell.a2-vw-3 { background: var(--a2-vw-3-bg); color: var(--a2-vw-3-fg); }
.a2-table-cell.a2-vw-2 { background: var(--a2-vw-2-bg); color: var(--a2-vw-2-fg); }
.a2-table-cell.a2-vw-1 { background: var(--a2-vw-1-bg); color: var(--a2-vw-1-fg); }
</style>
