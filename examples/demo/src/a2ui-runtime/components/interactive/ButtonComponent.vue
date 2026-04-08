<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveActionName, resolveText } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  onAction: { type: Function, default: null },
  node: { type: Object, default: null },
  surfaceId: { type: String, default: '' },
})

const action = computed(() => props.payload?.action ?? props.payload?.onClick ?? {})
const label = computed(() => resolveText(props.dataModel, props.payload?.label ?? props.payload?.text ?? { literalString: 'Button' }))
const hasChild = computed(() => Boolean(props.payload?.child))
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

function emitAction() {
  props.onAction?.({
    actionName: resolveActionName(action.value, 'click'),
    componentId: props.node?.id,
    surfaceId: props.surfaceId,
    args: action.value?.args || action.value?.payload || {},
  })
}
</script>

<template>
  <button v-if="!hidden" class="a2-btn" :class="[{ primary: payload.primary }, customClasses]" :style="styleObject" :disabled="payload.disabled" @click.stop="emitAction">
    <slot v-if="hasChild" />
    <span v-else>{{ label }}</span>
  </button>
</template>

<style scoped>
.a2-btn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.a2-btn.primary {
  background: #2563eb;
  border-color: #2563eb;
}
</style>
