<script setup>
import { computed, ref, watch } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveActionName, resolveNumber } from './utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel:{type:Object,default:()=>({})}, onAction:{type:Function,default:null}, node:{type:Object,default:null}, surfaceId:{type:String,default:''} })
const value = ref(0)
const action = computed(() => props.payload?.action ?? {})
const min = computed(() => resolveNumber(props.dataModel, props.payload?.min, 0))
const max = computed(() => resolveNumber(props.dataModel, props.payload?.max, 100))
const step = computed(() => resolveNumber(props.dataModel, props.payload?.step, 1))
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

watch(() => [props.payload?.value, props.dataModel], () => {
  value.value = resolveNumber(props.dataModel, props.payload?.value, min.value)
}, { immediate: true, deep: true })

function emit(){ props.onAction?.({ actionName: resolveActionName(action.value, 'change_slider'), componentId: props.node?.id, surfaceId: props.surfaceId, args:{ ...(action.value?.args || {}), value: Number(value.value) } }) }
</script>
<template><input v-if="!hidden" class="a2-slider" :class="customClasses" :style="styleObject" type="range" v-model="value" :min="min" :max="max" :step="step" @change="emit"/></template>
<style scoped>.a2-slider{width:100%}</style>
