<script setup>
import { computed } from 'vue'
import { resolveText, resolveValue } from './utils'

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
const colCount = computed(() => Math.max(0, ...nodes.value.map((n) => Number(n.column || 0))) + 1)

function nodeStyle(n) {
  return {
    gridColumn: String(Number(n.column || 0) + 1),
    gridRow: String(Number(n.lane || 0) + 1),
  }
}
</script>

<template>
  <div class="flow-wrap">
    <h3 class="flow-title">{{ title }}</h3>

    <div class="flow-grid-scroll">
      <div v-if="nodes.length" class="flow-grid" :style="{ gridTemplateColumns: `repeat(${colCount}, minmax(160px, 1fr))` }">
        <div v-for="node in nodes" :key="node.id" class="flow-node" :class="`kind-${node.kind || 'process'}`" :style="nodeStyle(node)">
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
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
}

.flow-title {
  margin: 0 0 8px;
  font-size: 16px;
  word-break: break-word;
}

.flow-grid-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

.flow-grid {
  display: grid;
  gap: 10px;
  min-width: fit-content;
}

.flow-node {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.04);
  min-height: 52px;
  max-width: 280px;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.flow-node.kind-start { border-color: #22c55e; }
.flow-node.kind-end { border-color: #f59e0b; }
.flow-node.kind-decision { border-color: #60a5fa; }

.flow-edges {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}

.edge-item em {
  color: rgba(255, 255, 255, 0.6);
  font-style: normal;
}
</style>
