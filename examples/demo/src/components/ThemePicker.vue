<script setup>
import { computed, inject } from 'vue'

const themeCenter = inject('demo:themeCenter', null)
const libraryThemeStore = inject('demo:libraryThemeStore', null)

const availableThemes = computed(() => themeCenter?.hostStore?.themes || ['light', 'dark'])
const activeTheme = computed(() => themeCenter?.hostTheme?.value || 'light')

function onThemeChange(event) {
  const nextTheme = event?.target?.value
  if (!nextTheme || !themeCenter) return
  themeCenter.setTheme(nextTheme, libraryThemeStore)
}
</script>

<template>
  <label class="model-picker">
    <span>主题</span>
    <select :value="activeTheme" class="model-select" @change="onThemeChange">
      <option v-for="item in availableThemes" :key="`theme-${item}`" :value="item">{{ item }}</option>
    </select>
  </label>
</template>

<style scoped>
.model-picker { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--app-accent-text); }
.model-select { height: 30px; border-radius: 8px; border: 1px solid var(--app-accent-border); background: var(--app-accent-bg); color: var(--app-accent-text); padding: 0 8px; }
.model-select option { color: var(--app-text); background: var(--app-surface-1); }
</style>
