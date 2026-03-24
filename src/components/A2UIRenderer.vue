<script setup>
import RenderNode from './RenderNode.vue'

defineProps({
  surface: {
    type: Object,
    required: true,
  },
  dataModel: {
    type: Object,
    required: true,
  },
  onAction: {
    type: Function,
    default: null,
  },
})
</script>

<template>
  <RenderNode
    v-if="surface?.root"
    :node-id="surface.root"
    :components-by-id="surface.componentsById || {}"
    :data-model="dataModel"
    :surface-id="surface.id"
    :on-action="onAction"
  />
  <div v-else class="empty-tip">Surface is waiting for root...</div>
</template>

<style scoped>
.empty-tip {
  color: rgba(255, 255, 255, 0.6);
  padding: 10px;
}
</style>
