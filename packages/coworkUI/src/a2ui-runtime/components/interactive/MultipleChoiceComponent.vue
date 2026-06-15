<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, normalizeChildren, resolveActionName, resolveText } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  onAction: { type: Function, default: null },
  node: { type: Object, default: null },
  surfaceId: { type: String, default: '' },
})

const options = computed(() => normalizeChildren(props.payload?.options ?? props.payload?.choices))
const action = computed(() => props.payload?.action ?? {})
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

function labelOf(opt) {
  return resolveText(props.dataModel, opt?.label ?? opt?.text ?? opt?.value ?? opt)
}

function valueOf(opt) {
  return resolveText(props.dataModel, opt?.value ?? opt?.label ?? opt)
}

function choose(opt) {
  props.onAction?.({
    actionName: resolveActionName(action.value, 'select_choice'),
    componentId: props.node?.id,
    surfaceId: props.surfaceId,
    args: { ...(action.value?.args || {}), value: valueOf(opt) },
  })
}
</script>

<template>
  <div v-if="!hidden" class="a2-choices" :class="customClasses" :style="styleObject">
    <button v-for="(opt, idx) in options" :key="idx" @click.stop="choose(opt)">{{ labelOf(opt) }}</button>
  </div>
</template>

<style scoped>
.a2-choices { display:flex; gap:var(--swt-space-size-8); flex-wrap:wrap; }
.a2-choices button { padding:var(--swt-space-size-8) var(--swt-space-size-12); border-radius: var(--swt-radius-size-infinity); border:1px solid var(--swt-color-gray11-opacity20); background:var(--swt-color-overlay-gray1-and-gray12-opacity5); color:var(--swt-color-white); }
</style>
