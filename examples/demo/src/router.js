import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Chat from './Chat.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: App },
    { path: '/chat', name: 'chat', component: Chat },
  ],
})
