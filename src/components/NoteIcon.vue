<script setup lang="ts">
const props = defineProps<{ text?: string, unpaded?: boolean }>()
const unpadedClass = props.unpaded ? 'unpaded px-0' : ''
</script>

<template>
  <span
    v-if="text"
    v-tooltip
    data-toggle="tooltip"
    :data-bs-title="text"
    :class="unpadedClass"
    class="translate-middle badge badge-position"
  >
    <img src="@/assets/icons/message.png" class="icon-container-small" alt="Note icon">
  </span>
</template>

<style scoped>
.badge-position {
  position:relative;
  top:-0.2rem;
  right:-0.6rem;
}

.unpaded {
  margin-left: -0.5rem;
}
</style>
