<script setup>
import { computed, inject } from 'vue'
import { A2UIComponentRenderer, defaultRegistry, defaultTheme } from '../a2ui-runtime'

const props = defineProps({
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
  theme: {
    type: Object,
    default: null,
  },
})

const injectedTheme = inject('coworkui:theme', null)
const resolvedTheme = computed(() => props.theme || injectedTheme?.value || defaultTheme)
</script>

<template>
  <div v-if="surface?.root" class="a2ui-surface">
    <A2UIComponentRenderer
      :node-id="surface.root"
      :components-by-id="surface.componentsById || {}"
      :data-model="dataModel"
      :surface-id="surface.id"
      :registry="defaultRegistry"
      :theme="resolvedTheme"
      :on-action="onAction"
    />
  </div>
  <div v-else class="empty-tip">Surface is waiting for root...</div>
</template>

<style scoped>
.empty-tip {
  color: #64748b;
  padding: 10px;
}
</style>
