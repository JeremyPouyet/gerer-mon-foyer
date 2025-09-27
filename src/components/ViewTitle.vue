<script setup lang="ts">
import { Path } from '@/types'
import { TextHeaders } from '@/locales/headers'

const props = defineProps<{ emoji: string, path: Path, unpaded?: boolean }>()
const unpadedClass = props.unpaded ? 'ps-0' : ''
</script>

<template>
  <div class="container mb-5" :class="unpadedClass">
    <h1 class="text-center">
      {{ TextHeaders[path].title }}
    </h1>
    <p class="text-center">
      <span class="fst-italic text-body-secondary ">
        {{ TextHeaders[path].meta.description }}
      </span>
      <span class="ms-1 fw-normal">{{ emoji }}</span>
    </p>
  </div>
</template>