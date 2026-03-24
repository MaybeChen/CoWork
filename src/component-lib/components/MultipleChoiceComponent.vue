<script setup>
import { computed } from 'vue'
import { resolveText } from './utils'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel:{type:Object,default:()=>({})}, onAction:{type:Function,default:null}, node:{type:Object,default:null}, surfaceId:{type:String,default:''} })
const options = computed(() => props.payload?.options || [])
function choose(opt){ props.onAction?.({ actionName: props.payload?.action?.name || 'select_choice', componentId: props.node?.id, surfaceId: props.surfaceId, args:{ value: resolveText(props.dataModel, opt?.value || opt?.label || opt) } }) }
</script>
<template><div class="a2-choices"><button v-for="(opt,idx) in options" :key="idx" @click="choose(opt)">{{ resolveText(dataModel, opt?.label || opt?.value || opt) }}</button></div></template>
<style scoped>.a2-choices{display:flex;gap:8px;flex-wrap:wrap}.a2-choices button{padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);color:#fff}</style>
