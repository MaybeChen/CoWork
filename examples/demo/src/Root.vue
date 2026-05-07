<script setup>
import { inject, provide } from 'vue'
import { createHostThemeCenter } from './theme/themeCenter'

const coworkUI = inject('demo:coworkui')
const libraryStore = coworkUI?.getThemeStore?.()
const center = createHostThemeCenter()
center.syncLibraryTheme(libraryStore)

provide('demo:themeCenter', center)
provide('demo:libraryThemeStore', libraryStore)
</script>

<template>
  <div class="app-shell">
    <RouterView />
  </div>
</template>
