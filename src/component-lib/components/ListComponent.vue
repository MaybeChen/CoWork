<script setup>
import { computed } from 'vue'
import { classMapToString, hostStyleFromNode, isHidden } from './utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, node:{type:Object,default:null}, dataModel:{type:Object,default:()=>({})} })
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => classMapToString(props.payload?.classMap || props.payload?.className))
const direction = computed(() => (props.payload?.direction === 'horizontal' ? 'row' : 'column'))
const styleObject = computed(() => ({ flexDirection: direction.value, ...hostStyleFromNode(props.node, props.payload) }))
</script>
<template><div v-if="!hidden" class="a2-list" :class="customClasses" :style="styleObject"><slot/></div></template>
<style scoped>.a2-list{display:flex;gap:10px;width:100%}</style>
