<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{ title: string }>()

const isSticky = ref(false)
const stickyTopOffset = ref<number>(0)

function handleScroll() {
  isSticky.value = window.scrollY >= stickyTopOffset.value
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
})
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <div class="col-auto mb-4">
    <div :class="['row char-width-30 sticky-top', { 'sticky-offset': isSticky }]">
      <div class="container">
        <h3>{{ title }}</h3>
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
</style>