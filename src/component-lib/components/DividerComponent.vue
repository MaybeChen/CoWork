<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses } from './utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) }, node:{type:Object,default:null} })
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))
</script>
<template><hr v-if="!hidden" class="a2-divider" :class="customClasses" :style="styleObject" /></template>
<style scoped>.a2-divider{border:none;border-top:1px solid rgba(255,255,255,.15);margin:8px 0}</style>
