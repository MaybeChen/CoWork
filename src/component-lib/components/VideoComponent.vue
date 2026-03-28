<script setup>
import { computed } from 'vue'
import { classMapToString, hostStyleFromNode, isHidden, resolveText } from './utils'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) }, node:{type:Object,default:null} })
const src = computed(() => resolveText(props.dataModel, props.payload?.src || props.payload?.url))
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => classMapToString(props.payload?.classMap || props.payload?.className))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload))
</script>
<template><video v-if="src && !hidden" class="a2-video" :class="customClasses" :style="styleObject" :src="src" controls/></template>
<style scoped>.a2-video{width:100%;border-radius:10px}</style>
