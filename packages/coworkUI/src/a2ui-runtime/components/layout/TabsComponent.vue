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
<style scoped>.tab-head{display:flex;gap:var(--swt-space-size-8);flex-wrap:wrap}.tab-head button{background:var(--swt-color-bg-primary);color:var(--swt-color-white);border:1px solid var(--swt-color-border);border-radius: var(--swt-radius-size-medium);padding:var(--swt-space-size-4) var(--swt-space-size-8)}.tab-head .active{border-color:var(--swt-color-accent-text-normal)}.tab-body{margin-top:var(--swt-space-size-12)}</style>
