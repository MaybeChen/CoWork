<script setup>
import { inject, provide, ref } from 'vue'
import { createHostThemeCenter } from './theme/themeCenter'

const coworkUI = inject('demo:coworkui')
const libraryStore = coworkUI?.getThemeStore?.()
const center = createHostThemeCenter()
const independentLibraryTheme = ref(false)

function toggleAllTheme() {
  center.toggleTheme(libraryStore)
}

function toggleLibraryMode() {
  independentLibraryTheme.value = !independentLibraryTheme.value
  const follow = !independentLibraryTheme.value
  center.setLibraryFollowHost(follow)
  libraryStore?.setFollowExternal?.(follow)
  if (follow) center.syncLibraryTheme(libraryStore)
}

function toggleLibraryTheme() {
  if (!libraryStore) return
  libraryStore.toggleTheme()
}

provide('demo:themeCenter', center)
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
