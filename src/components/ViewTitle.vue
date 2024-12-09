<script setup lang="ts">
import Texts from '@/texts'
import { Path } from '@/types'

const props = defineProps<{ emoji: string, path: Path, unpaded?: boolean }>()
const unpadedClass = props.unpaded ? 'ps-0' : ''

</script>

<template>
  <div class="container mb-3" :class="unpadedClass">
    <h1>{{ Texts.heads[path].title }}</h1>
    <span class="fst-italic fw-lighter">
      {{ Texts.heads[path].meta.description }}
    </span>
    <span class="ms-1 fw-normal"> {{ emoji }}</span>
  </div>
</template>