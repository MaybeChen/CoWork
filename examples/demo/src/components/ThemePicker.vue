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
