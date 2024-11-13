<script setup lang="ts">
import { useSticky } from '@/helpers'

const { show = true, title } = defineProps<{ show?: boolean, title: string }>()
const isSticky = useSticky()
</script>

<template>
  <div class="col-auto mb-4">
    <div :class="['row char-width-30 sticky-top', { 'sticky-offset': isSticky }]">
      <div v-if="show" class="row">
        <h3>{{ title }}</h3>
        <hr>
        <slot />
      </div>
    </div>
  </div>
</template>