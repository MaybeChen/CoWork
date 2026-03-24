<script setup>
import { computed, ref, watch } from 'vue'
import { resolveText } from './utils'

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

watch(
  () => [props.payload?.text, props.payload?.value, props.dataModel],
  () => {
    val.value = resolveText(props.dataModel, props.payload?.text || props.payload?.value)
  },
  { immediate: true, deep: true },
)

function submit() {
  props.onAction?.({
    actionName: action.value?.name || action.value?.actionName || 'submit_text',
    componentId: props.node?.id,
    surfaceId: props.surfaceId,
    args: { ...(action.value?.args || {}), value: val.value },
  })
}
</script>

<template>
  <div class="a2-tf">
    <input v-model="val" :placeholder="placeholder" @keydown.enter.prevent="submit" />
  </div>
</template>

<style scoped>
.a2-tf input { width:100%; padding:8px 10px; border-radius:8px; background:#0f172a; color:#fff; border:1px solid rgba(255,255,255,.2); }
</style>
