<script setup>
import { computed, ref, watch } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveActionName, resolveText } from '../utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel:{type:Object,default:()=>({})}, onAction:{type:Function,default:null}, node:{type:Object,default:null}, surfaceId:{type:String,default:''} })
const value = ref('')
const action = computed(() => props.payload?.action ?? {})
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

watch(() => [props.payload?.value, props.dataModel], () => {
  value.value = resolveText(props.dataModel, props.payload?.value)
}, { immediate: true, deep: true })

function emit(){ props.onAction?.({ actionName: resolveActionName(action.value, 'change_datetime'), componentId: props.node?.id, surfaceId: props.surfaceId, args:{ ...(action.value?.args || {}), value: value.value } }) }
</script>
<template><input v-if="!hidden" class="a2-dt" :class="customClasses" :style="styleObject" type="datetime-local" v-model="value" @change="emit"/></template>
<style scoped>.a2-dt{padding:var(--swt-space-size-8) var(--swt-space-size-12);border-radius: var(--swt-radius-size-medium);background:var(--swt-color-text-primary);color:var(--swt-color-white);border:1px solid var(--swt-color-gray11-opacity20)}</style>
