<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{ title: string }>()

const isSticky = ref(false)
const stickyTopOffset = ref<number>(0)

function handleScroll() {
  isSticky.value = window.scrollY >= stickyTopOffset.value
}

const isSmallScreen = ref(false)

function handleResize() {
  isSmallScreen.value = window.innerWidth <= 700
}

onMounted(() => {
  // Set up a scroll listeners and calculates the `isSticky` state based on
  // the scroll position relative to the element's top offset.
  const stickyElement = document.querySelector('.sticky-top')

  if (stickyElement) {
    // Save the initial position of the sticky element
    stickyTopOffset.value = stickyElement.getBoundingClientRect().top + window.scrollY
    // Listen to the scroll event
    window.addEventListener('scroll', handleScroll)
  }

  handleResize()
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    class="col-auto mb-4"
    :class="[isSmallScreen ? 'full-width' : 'char-width-30']"
  >
    <div
      aria-labelledby="sticky-header"
      :class="['row sticky-top', { 'sticky-offset': isSticky }]"
      role="region"
    >
      <div class="container">
        <h2 id="sticky-header" class="fs-3">
          {{ title }}
        </h2>
        <hr class="mb-3 mt-0">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="css">
.sticky-offset {
  top: 1.5rem;
}
.full-width {
  width: 100%;
}
</style>