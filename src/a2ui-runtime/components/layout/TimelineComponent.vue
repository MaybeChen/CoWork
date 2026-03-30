<script setup>
import { computed } from 'vue'
import { hostStyleFromNode, isHidden, resolveComponentClasses } from '../utils'

const props = defineProps({
  payload: { type: Object, default: () => ({}) },
  dataModel: { type: Object, default: () => ({}) },
  node: { type: Object, default: null },
})

const hidden = computed(() => isHidden(props.dataModel, props.payload))
const customClasses = computed(() => resolveComponentClasses(props.payload, props.payload?.usageHint))
const styleObject = computed(() => hostStyleFromNode(props.node, props.payload, props.payload?.usageHint))
</script>

<template>
  <div v-if="!hidden" class="a2-timeline" :class="customClasses" :style="styleObject">
    <el-timeline>
      <slot />
    </el-timeline>
  </div>
</template>

<style scoped>
.a2-timeline { width: 100%; }

.a2-timeline :deep(.el-timeline-item__tail) {
  border-left-color: #22c55e;
  border-left-width: 2px;
}

/*
 * A2UIComponentRenderer wraps each node with .a2ui-node, so Element Plus'
 * `.el-timeline-item:last-child .el-timeline-item__tail { display: none; }`
 * treats every item as "last-child" and hides all tails.
 * Re-map that behavior to wrapper level: only hide the real last wrapper.
 */
.a2-timeline :deep(.a2ui-node .el-timeline-item__tail) {
  display: block;
}

.a2-timeline :deep(.a2ui-node:last-child .el-timeline-item__tail) {
  display: none;
}
</style>
