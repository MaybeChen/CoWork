<script setup>
import { computed } from 'vue'
import { resolveText, resolveValue } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
})

const specObject = computed(() => {
  const raw = resolveValue(props.dataModel, props.payload?.spec)
  if (!raw) return null
  if (typeof raw === 'object') return raw
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }
  return null
})

const title = computed(() => {
  if (!specObject.value) return resolveText(props.dataModel, props.payload?.title)
  return specObject.value.title || '流程图'
})

const nodes = computed(() => specObject.value?.nodes || [])
const edges = computed(() => specObject.value?.edges || [])

const orderedNodes = computed(() =>
  [...nodes.value].sort((a, b) => {
    const laneDiff = Number(a.lane || 0) - Number(b.lane || 0)
    if (laneDiff !== 0) return laneDiff
    return Number(a.column || 0) - Number(b.column || 0)
  }),
)
</script>

<template>
  <div class="flow-wrap">
    <h3 class="flow-title">{{ title }}</h3>

    <div class="flow-grid-scroll">
      <div v-if="nodes.length" class="flow-grid" >
        <div v-for="node in orderedNodes" :key="node.id" class="flow-node" :class="`kind-${node.kind || 'process'}`" >
          <strong>{{ node.label || node.id }}</strong>
        </div>
      </div>
    </div>

    <div v-if="edges.length" class="flow-edges">
      <div v-for="(e, idx) in edges" :key="idx" class="edge-item">
        <span>{{ e.from_id }} → {{ e.to_id }}</span>
        <em v-if="e.label">（{{ e.label }}）</em>
      </div>
    </div>
  </div>
</template>

<style scoped>
.flow-wrap {
  width: 100%;
  max-width: 100%;
  border: var(--swt-border-width-thin) var(--swt-border-style-solid) var(--swt-color-overlay-gray1-and-gray12-opacity10);
  border-radius: var(--swt-radius-size-big);
  padding: var(--swt-space-size-12);
  background: var(--swt-color-gray6-opacity5);
  overflow: hidden;
}

.flow-title {
  margin: 0 0 var(--swt-space-size-8);
  font-size: var(--swt-font-size-normal1);
  word-break: break-word;
}

.flow-grid-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.flow-grid {
  display: grid;
  gap: var(--swt-space-size-12);
  grid-template-columns: repeat(auto-fill, minmax(180px, 180px));
  justify-content: flex-start;
}

.flow-node {
  border: var(--swt-border-width-thin) var(--swt-border-style-solid) var(--swt-color-gray11-opacity20);
  border-radius: var(--swt-radius-size-medium);
  padding: var(--swt-space-size-8);
  background: var(--swt-color-overlay-gray1-and-gray12-opacity5);
  min-height: 52px;
  width: 180px;
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.flow-node.kind-start { border-color: var(--swt-color-function-success-normal); }
.flow-node.kind-end { border-color: var(--swt-color-function-important-normal); }
.flow-node.kind-decision { border-color: var(--swt-color-accent-text-normal); }

.flow-edges {
  margin-top: var(--swt-space-size-12);
  display: flex;
  flex-direction: column;
  gap: var(--swt-space-size-4);
  color: var(--swt-color-text-primary);
  word-break: break-word;
}

.edge-item em {
  color: var(--swt-color-text-secondary);
  font-style: normal;
}
</style>
