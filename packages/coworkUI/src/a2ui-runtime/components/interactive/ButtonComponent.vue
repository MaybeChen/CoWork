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
  padding: var(--swt-space-size-8) var(--swt-space-size-12);
  border-radius: var(--swt-radius-size-medium);
  border: var(--swt-border-width-thin) var(--swt-border-style-solid) var(--swt-color-gray11-opacity20);
  background: var(--swt-color-overlay-gray1-and-gray12-opacity10);
  color: var(--swt-color-white);
}
.a2-btn.primary {
  background: var(--swt-color-accent-normal);
  border-color: var(--swt-color-accent-normal);
}
</style>
