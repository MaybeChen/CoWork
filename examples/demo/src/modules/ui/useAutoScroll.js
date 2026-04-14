import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export function useAutoScroll() {
  const contentRef = ref(null)
  let mutationObserver
  let resizeObserver
  let scrollScheduled = false

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
    if (!contentRef.value) return

    scheduleAutoScroll()

    if (typeof MutationObserver === 'function') {
      mutationObserver = new MutationObserver(() => {
        scheduleAutoScroll()
      })
      mutationObserver.observe(contentRef.value, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(() => {
        scheduleAutoScroll()
      })
      resizeObserver.observe(contentRef.value)
    }
  })

  onBeforeUnmount(() => {
    if (mutationObserver) mutationObserver.disconnect()
    if (resizeObserver) resizeObserver.disconnect()
  })

  return {
    contentRef,
    scheduleAutoScroll,
  }
}
