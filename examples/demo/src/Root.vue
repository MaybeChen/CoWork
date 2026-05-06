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
    <header class="theme-header">
      <button class="theme-btn" @click="toggleAllTheme">主工程+依赖库切换主题</button>
      <button class="theme-btn" @click="toggleLibraryMode">{{ independentLibraryTheme ? '依赖库独立模式: 开' : '依赖库独立模式: 关' }}</button>
      <button class="theme-btn" :disabled="!independentLibraryTheme" @click="toggleLibraryTheme">依赖库独立切换</button>
    </header>
    <RouterView />
  </div>
</template>
