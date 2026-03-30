<script setup>
import { computed, ref, watch } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveActionName, resolveText } from './utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  onAction: { type: Function, default: null },
  node: { type: Object, default: null },
  surfaceId: { type: String, default: '' },
})

const val = ref('')
const placeholder = computed(() => resolveText(props.dataModel, props.payload?.placeholder || { literalString: '' }))
const action = computed(() => props.payload?.action ?? props.payload?.onSubmit ?? {})
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

watch(
  () => [props.payload?.text, props.payload?.value, props.dataModel],
  () => {
    val.value = resolveText(props.dataModel, props.payload?.text || props.payload?.value)
  },
  { immediate: true, deep: true },
)

function submit() {
  props.onAction?.({
    actionName: resolveActionName(action.value, 'submit_text'),
    componentId: props.node?.id,
    surfaceId: props.surfaceId,
    args: { ...(action.value?.args || {}), value: val.value },
  })
}
</script>

<template>
  <div v-if="!hidden" class="a2-tf" :class="customClasses" :style="styleObject">
    <input v-model="val" :placeholder="placeholder" @keydown.enter.prevent="submit" />
  </div>
</template>

<style scoped>
.a2-tf input { width:100%; padding:8px 10px; border-radius:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,.2); }
</style>
