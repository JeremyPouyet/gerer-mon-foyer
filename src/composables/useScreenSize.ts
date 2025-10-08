import { onBeforeUnmount, onMounted, ref } from 'vue'

// xs 	<576px
// sm 	≥576px
// md 	≥768px
// lg 	≥992px
// xl 	≥1200px
// xxl 	≥1400px

export function useScreenSize(size: number) {
  const isSmallerScreen = ref(window.innerWidth < size)

  const handleResize = () => isSmallerScreen.value = window.innerWidth < size

  onMounted(() => window.addEventListener('resize', handleResize))
  onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

  return { isSmallerScreen }
}