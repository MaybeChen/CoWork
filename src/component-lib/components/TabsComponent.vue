<script setup>
import { computed, ref } from 'vue'
const props = defineProps({ payload: { type: Object, default: () => ({}) } })
const active = ref(0)
const tabs = computed(() => props.payload?.tabs?.explicitList || [])
</script>
<template>
  <div class="a2-tabs">
    <div class="tab-head">
      <button v-for="(id,idx) in tabs" :key="id" :class="{active: idx===active}" @click="active=idx">Tab {{ idx+1 }}</button>
    </div>
    <div class="tab-body"><slot/></div>
  </div>
</template>
<style scoped>.tab-head{display:flex;gap:8px}.tab-head button{background:#1f2937;color:#fff;border:1px solid #374151;border-radius:8px;padding:4px 8px}.tab-head .active{border-color:#60a5fa}.tab-body{margin-top:10px}</style>
