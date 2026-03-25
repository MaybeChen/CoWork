<script setup>
import { computed } from 'vue'
import { resolveText } from './utils'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) } })
const src = computed(() => resolveText(props.dataModel, props.payload?.src || props.payload?.url))
</script>
<template><audio v-if="src" class="a2-audio" :src="src" controls/></template>
<style scoped>.a2-audio{width:100%}</style>
