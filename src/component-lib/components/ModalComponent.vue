<script setup>
import { computed } from 'vue'
import { classMapToString, hostStyleFromNode, isHidden } from './utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel:{type:Object,default:()=>({})}, node:{type:Object,default:null} })
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => classMapToString(props.payload?.classMap || props.payload?.className))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload))
</script>
<template><div v-if="!hidden" class="a2-modal" :class="customClasses" :style="styleObject"><div class="panel"><slot/></div></div></template>
<style scoped>.a2-modal{border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:10px;background:rgba(0,0,0,.35)}.panel{display:flex;flex-direction:column;gap:10px}</style>
