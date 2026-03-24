<script setup>
import { computed } from 'vue'
import SweetCard from './sweetui/SweetCard.vue'
import SweetStack from './sweetui/SweetStack.vue'
import SweetText from './sweetui/SweetText.vue'

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
  if (kind.value === 'Column' || kind.value === 'Row') return payload.value?.children?.explicitList ?? []
  if (kind.value === 'Card') return payload.value?.child ? [payload.value.child] : []
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
      <SweetStack :direction="kind === 'Row' ? 'row' : 'column'" :gap="12">
        <RenderNode
          v-for="cid in childIds"
          :key="cid"
          :node-id="cid"
          :components-by-id="componentsById"
          :data-model="dataModel"
          :surface-id="surfaceId"
          :on-action="onAction"
        />
      </SweetStack>
    </template>

    <template v-else-if="kind === 'Card'">
      <SweetCard>
        <RenderNode
          v-for="cid in childIds"
          :key="cid"
          :node-id="cid"
          :components-by-id="componentsById"
          :data-model="dataModel"
          :surface-id="surfaceId"
          :on-action="onAction"
        />
      </SweetCard>
    </template>

    <template v-else-if="kind === 'Text'">
      <SweetText :as="textTag()">{{ decodeTextValue(payload.text) }}</SweetText>
    </template>

    <template v-else>
      <SweetCard interactive @click="triggerAction()">
        <div class="unknown">Unsupported component: {{ kind || 'Unknown' }}</div>
      </SweetCard>
    </template>
  </div>
</template>

<style scoped>
.unknown {
  color: rgba(255, 255, 255, 0.6);
}
</style>
