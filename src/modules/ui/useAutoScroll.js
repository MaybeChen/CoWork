import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export function useAutoScroll() {
  const contentRef = ref(null)
  let mutationObserver
  let scrollScheduled = false
  let lastScrollHeight = 0

  async function scrollToBottom() {
    await nextTick()
    if (contentRef.value) {
      contentRef.value.scrollTo({
        top: contentRef.value.scrollHeight,
        behavior: 'smooth',
      })
      return
    }
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
    lastScrollHeight = contentRef.value.scrollHeight
    mutationObserver = new MutationObserver(() => {
      if (!contentRef.value) return
      const nextScrollHeight = contentRef.value.scrollHeight
      if (nextScrollHeight <= lastScrollHeight) return
      lastScrollHeight = nextScrollHeight
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
