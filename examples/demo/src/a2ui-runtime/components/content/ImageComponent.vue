<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, resolveText } from '../utils'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) }, node:{type:Object,default:null} })
const src = computed(() => resolveText(props.dataModel, props.payload?.src || props.payload?.url))
const alt = computed(() => resolveText(props.dataModel, props.payload?.alt || { literalString: 'image' }))
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))
</script>
<template><img v-if="src && !hidden" class="a2-image" :class="customClasses" :style="styleObject" :src="src" :alt="alt" /></template>
<style scoped>.a2-image{max-width:100%;border-radius:10px;display:block}</style>
