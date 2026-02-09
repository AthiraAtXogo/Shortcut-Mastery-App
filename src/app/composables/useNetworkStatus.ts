export function useNetworkStatus() {
  const isOnline = ref(true)
  const wasOffline = ref(false)

  function updateOnlineStatus() {
    const online = navigator.onLine
    if (!online && isOnline.value) {
      wasOffline.value = true
    }
    isOnline.value = online
  }

  onMounted(() => {
    isOnline.value = navigator.onLine
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return {
    isOnline: readonly(isOnline),
    wasOffline: readonly(wasOffline)
  }
}
