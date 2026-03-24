<script setup>
import { computed } from 'vue'
import { resolveText } from './utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  onAction: { type: Function, default: null },
  node: { type: Object, default: null },
  surfaceId: { type: String, default: '' },
})

const action = computed(() => props.payload?.action ?? props.payload?.onClick ?? {})
const label = computed(() => resolveText(props.dataModel, props.payload?.label ?? props.payload?.text ?? { literalString: 'Button' }))

function emitAction() {
  props.onAction?.({
    actionName: action.value?.name || action.value?.actionName || 'click',
    componentId: props.node?.id,
    surfaceId: props.surfaceId,
    args: action.value?.args || action.value?.payload || {},
  })
}
</script>

<template>
  <button class="a2-btn" :disabled="payload.disabled" @click.stop="emitAction">{{ label }}</button>
</template>

<style scoped>
.a2-btn { padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.08); color:#fff; }
</style>
