import { onBeforeUnmount, onMounted, ref } from 'vue'

// xs: < 576
// sm: < 768
// md: < 992

export function useScreenSize(size: number) {
  const isSmallerScreen = ref(window.innerWidth < size)

  const handleResize = () => isSmallerScreen.value = window.innerWidth < size

  onMounted(() => window.addEventListener('resize', handleResize))
  onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

  return { isSmallerScreen }
}