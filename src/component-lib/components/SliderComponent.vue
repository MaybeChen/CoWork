<script setup>
import { ref } from 'vue'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, onAction:{type:Function,default:null}, node:{type:Object,default:null}, surfaceId:{type:String,default:''} })
const value = ref(0)
function emit(){ props.onAction?.({ actionName: props.payload?.action?.name || 'change_slider', componentId: props.node?.id, surfaceId: props.surfaceId, args:{ value: Number(value.value) } }) }
</script>
<template><input class="a2-slider" type="range" v-model="value" @change="emit"/></template>
<style scoped>.a2-slider{width:100%}</style>
