<script setup>
import { computed, ref } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses, normalizeChildren, resolveText } from '../utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel:{type:Object,default:()=>({})}, node:{type:Object,default:null} })
const active = ref(0)
const tabs = computed(() => normalizeChildren(props.payload?.tabs ?? props.payload?.children))
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))

function label(tab, idx) {
  return resolveText(props.dataModel, tab?.label ?? tab?.title ?? { literalString: `Tab ${idx + 1}` })
}
</script>
<template>
  <div v-if="!hidden" class="a2-tabs" :class="customClasses" :style="styleObject">
    <div class="tab-head">
      <button v-for="(tab,idx) in tabs" :key="tab?.id || idx" :class="{active: idx===active}" @click="active=idx">{{ label(tab, idx) }}</button>
    </div>
    <div class="tab-body"><slot/></div>
  </div>
</template>
<style scoped>.tab-head{display:flex;gap:8px;flex-wrap:wrap}.tab-head button{background:#1f2937;color:#fff;border:1px solid #374151;border-radius:8px;padding:4px 8px}.tab-head .active{border-color:#60a5fa}.tab-body{margin-top:10px}</style>
