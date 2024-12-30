<script setup lang="ts">
const props = defineProps<{ text?: string, unpaded?: boolean }>()
const unpadedClass = props.unpaded ? 'unpaded px-0' : ''
</script>

<template>
  <span
    v-if="text"
    v-tooltip
    class="translate-middle badge badge-position"
    :class="unpadedClass"
    :data-bs-title="text"
    data-toggle="tooltip"
  >
    <img alt="Note icon" class="icon-container-small" src="@/assets/icons/message.png">
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
