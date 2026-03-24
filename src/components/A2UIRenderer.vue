<script setup>
const props = defineProps({
  surface: {
    type: Object,
    required: true,
  },
  dataModel: {
    type: Object,
    required: true,
  },
  onAction: {
    type: Function,
    default: null,
  },
})

const getNode = (id) => props.surface?.componentsById?.[id] ?? null

const readPath = (path) => {
  if (!path || typeof path !== 'string') return undefined
  const normalized = path.replace(/^\//, '')
  if (!normalized) return props.dataModel
  return normalized.split('/').filter(Boolean).reduce((acc, key) => (acc == null ? undefined : acc[key]), props.dataModel)
}

const decodeTextValue = (textDef) => {
  if (textDef == null) return ''
  if (typeof textDef === 'string') return textDef
  if (typeof textDef.valueString === 'string') return textDef.valueString
  if (typeof textDef.path === 'string') {
    const val = readPath(textDef.path)
    return val == null ? '' : String(val)
  }
  return ''
}

const kindOf = (node) => {
  const data = node?.component
  if (!data || typeof data !== 'object') return null
  return Object.keys(data)[0] ?? null
}

const payloadOf = (node) => {
  const kind = kindOf(node)
  return kind ? node.component[kind] : null
}

const childrenOf = (node) => {
  const kind = kindOf(node)
  const payload = payloadOf(node) || {}

  if (kind === 'Column' || kind === 'Row') {
    return payload?.children?.explicitList ?? []
  }

  if (kind === 'Card') {
    return payload?.child ? [payload.child] : []
  }

  return []
}

const triggerAction = (node, eventName = 'tap') => {
  if (!props.onAction) return
  props.onAction({
    actionName: eventName,
    componentId: node.id,
    surfaceId: props.surface.id,
    args: {},
  })
}
</script>

<template>
  <RenderNode
    v-if="surface.root"
    :node-id="surface.root"
    :get-node="getNode"
    :children-of="childrenOf"
    :kind-of="kindOf"
    :payload-of="payloadOf"
    :decode-text-value="decodeTextValue"
    :trigger-action="triggerAction"
  />
</template>

<script>
const RenderNode = {
  name: 'RenderNode',
  props: {
    nodeId: { type: String, required: true },
    getNode: { type: Function, required: true },
    childrenOf: { type: Function, required: true },
    kindOf: { type: Function, required: true },
    payloadOf: { type: Function, required: true },
    decodeTextValue: { type: Function, required: true },
    triggerAction: { type: Function, required: true },
  },
  computed: {
    node() {
      return this.getNode(this.nodeId)
    },
    kind() {
      return this.kindOf(this.node)
    },
    payload() {
      return this.payloadOf(this.node) || {}
    },
    childIds() {
      return this.childrenOf(this.node)
    },
  },
  methods: {
    textTag() {
      const hint = this.payload?.usageHint
      if (hint === 'h1') return 'h1'
      if (hint === 'h2') return 'h2'
      return 'p'
    },
  },
  template: `
    <div v-if="node" class="render-node" :class="'kind-' + (kind || 'Unknown')">
      <template v-if="kind === 'Column' || kind === 'Row'">
        <div class="layout" :class="kind === 'Row' ? 'layout-row' : 'layout-col'">
          <RenderNode
            v-for="cid in childIds"
            :key="cid"
            :node-id="cid"
            :get-node="getNode"
            :children-of="childrenOf"
            :kind-of="kindOf"
            :payload-of="payloadOf"
            :decode-text-value="decodeTextValue"
            :trigger-action="triggerAction"
          />
        </div>
      </template>

      <template v-else-if="kind === 'Card'">
        <div class="card">
          <RenderNode
            v-for="cid in childIds"
            :key="cid"
            :node-id="cid"
            :get-node="getNode"
            :children-of="childrenOf"
            :kind-of="kindOf"
            :payload-of="payloadOf"
            :decode-text-value="decodeTextValue"
            :trigger-action="triggerAction"
          />
        </div>
      </template>

      <template v-else-if="kind === 'Text'">
        <component :is="textTag()" class="text">{{ decodeTextValue(payload.text) }}</component>
      </template>

      <template v-else>
        <div class="unknown" @click="triggerAction(node)">
          Unsupported component: {{ kind || 'Unknown' }}
        </div>
      </template>
    </div>
  `,
}

export default {
  name: 'A2UIRenderer',
  components: { RenderNode },
}
</script>

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
