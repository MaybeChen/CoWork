<script setup>
import { A2UIComponentRenderer, defaultRegistry } from '../component-lib'

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
  <div v-if="surface?.root" class="a2ui-surface">
    <A2UIComponentRenderer
      :node-id="surface.root"
      :components-by-id="surface.componentsById || {}"
      :data-model="dataModel"
      :surface-id="surface.id"
      :registry="defaultRegistry"
      :on-action="onAction"
    />
  </div>
  <div v-else class="empty-tip">Surface is waiting for root...</div>
</template>

<style scoped>
.empty-tip {
  color: rgba(255, 255, 255, 0.6);
  padding: 10px;
}
</style>
