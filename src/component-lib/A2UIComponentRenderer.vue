<script setup>
import { computed } from 'vue'
import { defaultRegistry } from './defaultRegistry'
import { defaultTheme } from './theme'
import { extractChildIds, normalizePayload } from './components/utils'

defineOptions({ name: 'A2UIComponentRenderer' })

const props = defineProps({
  nodeId: { type: String, required: true },
  componentsById: { type: Object, required: true },
  dataModel: { type: Object, required: true },
  surfaceId: { type: String, required: true },
  registry: { type: Object, default: () => defaultRegistry },
  theme: { type: Object, default: () => defaultTheme },
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
  const normalized = normalizePayload(raw)

  const usageHint = normalized.usageHint || 'default'
  const themeClassMap = props.theme?.components?.[k] ?? {}
  const themeAdditionalStyles = props.theme?.additionalStyles?.[k] ?? {}

  return {
    ...normalized,
    usageHint,
    __themeClassMap: themeClassMap,
    __themeAdditionalStyles: themeAdditionalStyles,
  }
})

const resolvedComponent = computed(() => props.registry.resolve(kind.value))

const childIds = computed(() => {
  const p = payload.value
  if (kind.value === 'Column' || kind.value === 'Row' || kind.value === 'List') {
    return extractChildIds(p.children ?? p.items)
  }
  if (kind.value === 'Card' || kind.value === 'Modal' || kind.value === 'Button') {
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
        :theme="theme"
        :on-action="onAction"
      />
    </component>

    <div v-else class="fallback">Unregistered component type: {{ kind || 'Unknown' }}</div>
  </div>
</template>

<style scoped>
.a2ui-node {
  transform-origin: top center;
  animation: atom-grow-in 240ms cubic-bezier(0.22, 1, 0.36, 1);
}

.fallback {
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px;
  color: rgba(255, 255, 255, 0.7);
}

@keyframes atom-grow-in {
  0% {
    opacity: 0;
    transform: translateY(6px) scale(0.97);
    filter: blur(1.5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
</style>
