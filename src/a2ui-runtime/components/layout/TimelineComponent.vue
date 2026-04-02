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
.a2-timeline {
  width: fit-content;
  max-width: 100%;
}

.a2-timeline :deep(ul) {
  padding-left: 5px;
}

.a2-timeline :deep(.el-timeline-item__tail) {
  display: block !important;
  border-left: none;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 1) 50%, rgba(34, 197, 94, 0.3) 100%);
}

/*
 * A2UIComponentRenderer adds the .a2ui-node class at node root, so we
 * normalize Element Plus tail visibility by class-level targeting and only
 * hide the real last node's tail.
 */
.a2-timeline :deep(.a2ui-node .el-timeline-item__tail) {
  display: block !important;
}

.a2-timeline :deep(.a2ui-node:last-child .el-timeline-item__tail) {
  display: none !important;
}
</style>
