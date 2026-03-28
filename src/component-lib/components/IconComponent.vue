<script setup>
import { computed } from 'vue'
import { classMapToString, hostStyleFromNode, isHidden, resolveText } from './utils'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) }, node:{type:Object,default:null} })
const name = computed(() => resolveText(props.dataModel, props.payload?.name || props.payload?.icon))
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => classMapToString(props.payload?.classMap || props.payload?.className))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload))
</script>
<template><span v-if="!hidden" class="a2-icon" :class="customClasses" :style="styleObject">{{ name || '◎' }}</span></template>
<style scoped>.a2-icon{display:inline-flex;align-items:center;justify-content:center;min-width:20px}</style>
