<script setup>
import { computed } from 'vue'
import { resolveText } from './utils'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel: { type: Object, default: () => ({}) } })
const src = computed(() => resolveText(props.dataModel, props.payload?.src || props.payload?.url))
</script>
<template><video v-if="src" class="a2-video" :src="src" controls/></template>
<style scoped>.a2-video{width:100%;border-radius:10px}</style>
