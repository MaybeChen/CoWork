<script setup>
import { ref } from 'vue'
const props = defineProps({ payload: { type: Object, default: () => ({}) }, onAction:{type:Function,default:null}, node:{type:Object,default:null}, surfaceId:{type:String,default:''} })
const checked = ref(false)
function emit(){ props.onAction?.({ actionName: props.payload?.action?.name || 'toggle_checkbox', componentId: props.node?.id, surfaceId: props.surfaceId, args:{ checked: checked.value } }) }
</script>
<template><label class="a2-cb"><input type="checkbox" v-model="checked" @change="emit"/> <span><slot>Check</slot></span></label></template>
<style scoped>.a2-cb{display:flex;gap:8px;align-items:center}</style>
