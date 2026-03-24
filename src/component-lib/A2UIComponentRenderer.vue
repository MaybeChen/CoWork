<script setup>
import { computed } from 'vue'
import { defaultRegistry } from './defaultRegistry'

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
  return k ? node.value.component[k] : {}
})
const resolvedComponent = computed(() => props.registry.resolve(kind.value))
const childIds = computed(() => {
  if (kind.value === 'Column' || kind.value === 'Row' || kind.value === 'List') {
    return payload.value?.children?.explicitList ?? payload.value?.items?.explicitList ?? []
  }
  if (kind.value === 'Card' || kind.value === 'Modal') {
    return payload.value?.child ? [payload.value.child] : []
  }
  if (kind.value === 'Tabs') {
    return payload.value?.tabs?.explicitList ?? payload.value?.children?.explicitList ?? []
  }
  return []
})

function triggerAction(eventName = 'tap') {
  if (!props.onAction || !node.value) return
  props.onAction({
    actionName: eventName,
    componentId: node.value.id,
    surfaceId: props.surfaceId,
    args: {},
  })
}
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
      @click="triggerAction()"
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

    <div v-else class="fallback" @click="triggerAction()">Unregistered component type: {{ kind || 'Unknown' }}</div>
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
