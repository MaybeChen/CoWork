<script setup>
import { ref } from 'vue'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, onAction:{type:Function,default:null}, node:{type:Object,default:null}, surfaceId:{type:String,default:''} })
const value = ref('')
function emit(){ props.onAction?.({ actionName: props.payload?.action?.name || 'change_datetime', componentId: props.node?.id, surfaceId: props.surfaceId, args:{ value: value.value } }) }
</script>
<template><input class="a2-dt" type="datetime-local" v-model="value" @change="emit"/></template>
<style scoped>.a2-dt{padding:8px 10px;border-radius:8px;background:#0f172a;color:#fff;border:1px solid rgba(255,255,255,.2)}</style>
