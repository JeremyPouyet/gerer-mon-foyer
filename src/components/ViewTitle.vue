<script setup lang="ts">
import Texts from '@/texts'
import { Path } from '@/types'

defineProps<{ path: Path }>()

</script>

<template>
  <h1>{{ Texts.heads[path].title }}</h1>
  <p class="fst-italic fw-lighter">
    {{ Texts.heads[path].meta.description }}
  </p>
</template>