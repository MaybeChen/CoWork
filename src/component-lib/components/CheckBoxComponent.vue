<script setup>
import { computed, ref, watch } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveActionName, resolveBool, resolveText } from './utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel:{type:Object,default:()=>({})}, onAction:{type:Function,default:null}, node:{type:Object,default:null}, surfaceId:{type:String,default:''} })
const checked = ref(false)
const action = computed(() => props.payload?.action ?? {})
const label = computed(() => resolveText(props.dataModel, props.payload?.label || { literalString: 'Check' }))
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

watch(() => [props.payload?.checked, props.payload?.value, props.dataModel], () => {
  checked.value = resolveBool(props.dataModel, props.payload?.checked ?? props.payload?.value, false)
}, { immediate: true, deep: true })

function emit(){ props.onAction?.({ actionName: resolveActionName(action.value, 'toggle_checkbox'), componentId: props.node?.id, surfaceId: props.surfaceId, args:{ ...(action.value?.args || {}), checked: checked.value } }) }
</script>
<template><label v-if="!hidden" class="a2-cb" :class="customClasses" :style="styleObject"><input type="checkbox" v-model="checked" @change="emit"/> <span>{{ label }}</span></label></template>
<style scoped>.a2-cb{display:flex;gap:8px;align-items:center}</style>
