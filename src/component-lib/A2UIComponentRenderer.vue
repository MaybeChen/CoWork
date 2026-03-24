<script setup>
import { computed } from 'vue'
import { defaultRegistry } from './defaultRegistry'
import { extractChildIds, normalizePayload } from './components/utils'

defineOptions({ name: 'A2UIComponentRenderer' })

const props = defineProps({
  nodeId: { type: String, required: true },
  componentsById: { type: Object, required: true },
  dataModel: { type: Object, required: true },
  surfaceId: { type: String, required: true },
  registry: { type: Object, default: () => defaultRegistry },
  onAction: { type: Function, default: null },
})

const node = computed(() => props.componentsById?.[props.nodeId] ?? null)
const kind = computed(() => {
  const component = node.value?.component
  if (!component || typeof component !== 'object') return null
  return Object.keys(component)[0] ?? null
})
const payload = computed(() => {
  const k = kind.value
  const raw = k ? node.value.component[k] : {}
  return normalizePayload(raw)
})
const resolvedComponent = computed(() => props.registry.resolve(kind.value))

const childIds = computed(() => {
  const p = payload.value
  if (kind.value === 'Column' || kind.value === 'Row' || kind.value === 'List') {
    return extractChildIds(p.children ?? p.items)
  }
  if (kind.value === 'Card' || kind.value === 'Modal') {
    return extractChildIds(p.child ? [p.child] : p.children)
  }
  if (kind.value === 'Tabs') {
    return extractChildIds(p.tabs ?? p.children)
  }
  return []
})

</script>

<template>
  <div v-if="node" class="a2ui-node">
    <component
      v-if="resolvedComponent"
      :is="resolvedComponent"
      :node="node"
      :kind="kind"
      :payload="payload"
      :data-model="dataModel"
      :surface-id="surfaceId"
      :on-action="onAction"
    >
      <A2UIComponentRenderer
        v-for="cid in childIds"
        :key="cid"
        :node-id="cid"
        :components-by-id="componentsById"
        :data-model="dataModel"
        :surface-id="surfaceId"
        :registry="registry"
        :on-action="onAction"
      />
    </component>

    <div v-else class="fallback">Unregistered component type: {{ kind || 'Unknown' }}</div>
  </div>
</template>

<style scoped>
.fallback {
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
