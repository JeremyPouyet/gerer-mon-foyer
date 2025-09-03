<script setup lang="ts">
import { Path } from '@/types'
import Texts from '@/texts'

const props = defineProps<{ emoji: string, path: Path, unpaded?: boolean }>()
const unpadedClass = props.unpaded ? 'ps-0' : ''

</script>

<template>
  <div class="container mb-5" :class="unpadedClass">
    <h1 class="text-center">
      {{ Texts.heads[path].title }}
    </h1>
    <p class="text-center">
      <span class="fst-italic text-body-secondary ">
        {{ Texts.heads[path].meta.description }}
      </span>
      <span class="ms-1 fw-normal">{{ emoji }}</span>
    </p>
  </div>
</template>