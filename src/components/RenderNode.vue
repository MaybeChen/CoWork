<script setup>
import { computed } from 'vue'
defineOptions({ name: 'RenderNode' })

const props = defineProps({
  nodeId: { type: String, required: true },
  componentsById: { type: Object, required: true },
  dataModel: { type: Object, required: true },
  surfaceId: { type: String, required: true },
  onAction: { type: Function, default: null },
})

const node = computed(() => props.componentsById?.[props.nodeId] ?? null)
const kind = computed(() => {
  const data = node.value?.component
  if (!data || typeof data !== 'object') return null
  return Object.keys(data)[0] ?? null
})

const payload = computed(() => {
  const k = kind.value
  return k ? node.value.component[k] : {}
})

const childIds = computed(() => {
  if (kind.value === 'Column' || kind.value === 'Row') {
    return payload.value?.children?.explicitList ?? []
  }
  if (kind.value === 'Card') {
    return payload.value?.child ? [payload.value.child] : []
  }
  return []
})

function readPath(path) {
  if (!path || typeof path !== 'string') return undefined
  const normalized = path.replace(/^\//, '')
  if (!normalized) return props.dataModel
  return normalized
    .split('/')
    .filter(Boolean)
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), props.dataModel)
}

function decodeTextValue(textDef) {
  if (textDef == null) return ''
  if (typeof textDef === 'string') return textDef
  if (typeof textDef.valueString === 'string') return textDef.valueString
  if (typeof textDef.path === 'string') {
    const val = readPath(textDef.path)
    return val == null ? '' : String(val)
  }
  return ''
}

function textTag() {
  const hint = payload.value?.usageHint
  if (hint === 'h1') return 'h1'
  if (hint === 'h2') return 'h2'
  return 'p'
}

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
  <div v-if="node" class="render-node" :class="'kind-' + (kind || 'Unknown')">
    <template v-if="kind === 'Column' || kind === 'Row'">
      <div class="layout" :class="kind === 'Row' ? 'layout-row' : 'layout-col'">
        <RenderNode
          v-for="cid in childIds"
          :key="cid"
          :node-id="cid"
          :components-by-id="componentsById"
          :data-model="dataModel"
          :surface-id="surfaceId"
          :on-action="onAction"
        />
      </div>
    </template>

    <template v-else-if="kind === 'Card'">
      <div class="card">
        <RenderNode
          v-for="cid in childIds"
          :key="cid"
          :node-id="cid"
          :components-by-id="componentsById"
          :data-model="dataModel"
          :surface-id="surfaceId"
          :on-action="onAction"
        />
      </div>
    </template>

    <template v-else-if="kind === 'Text'">
      <component :is="textTag()" class="text">{{ decodeTextValue(payload.text) }}</component>
    </template>

    <template v-else>
      <div class="unknown" @click="triggerAction()">Unsupported component: {{ kind || 'Unknown' }}</div>
    </template>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  gap: 12px;
}

.layout-col {
  flex-direction: column;
}

.layout-row {
  flex-direction: row;
  flex-wrap: wrap;
}

.card {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
}

.text {
  margin: 0;
  color: #e5e7eb;
  line-height: 1.6;
}

h1.text {
  font-size: 28px;
  margin-bottom: 8px;
}

h2.text {
  font-size: 22px;
}

.unknown {
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
