<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses } from '../utils'

const props = defineProps({ payload: { type: Object, default: () => ({}) }, dataModel:{type:Object,default:()=>({})}, node:{type:Object,default:null} })
const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))
</script>
<template>
  <section v-if="!hidden" class="a2-card a2-card-enter" :class="customClasses" :style="styleObject">
    <slot />
  </section>
</template>

<style scoped>
.a2-card {
  border: var(--swt-border-width-thin) var(--swt-border-style-solid) var(--swt-color-overlay-gray1-and-gray12-opacity10);
  border-radius: var(--swt-radius-size-big);
  background: var(--swt-color-bg-primary);
  padding: var(--swt-space-size-16);
  transform-origin: top center;
}
.a2-card-enter { animation: card-grow-in 260ms cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes card-grow-in {
  0% { opacity: 0; transform: translateY(var(--swt-space-size-8)) scale(0.96); filter: blur(2px); }
  100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
}
</style>
