import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export function useAutoScroll() {
  const contentRef = ref(null)
  let mutationObserver
  let scrollScheduled = false

  async function scrollToBottom() {
    await nextTick()
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })
    }
  }

  function scheduleAutoScroll() {
    if (scrollScheduled) return
    scrollScheduled = true
    const run = async () => {
      scrollScheduled = false
      await scrollToBottom()
    }
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run)
    else setTimeout(run, 0)
  }

  onMounted(() => {
    if (typeof MutationObserver !== 'function' || !contentRef.value) return
    mutationObserver = new MutationObserver(() => {
      scheduleAutoScroll()
    })
    mutationObserver.observe(contentRef.value, {
      childList: true,
      subtree: true,
      characterData: true,
    })
  })

  onBeforeUnmount(() => {
    if (mutationObserver) mutationObserver.disconnect()
  })

  return {
    contentRef,
    scheduleAutoScroll,
  }
}
