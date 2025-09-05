<script setup lang="ts">
import ViewTitle from '@/components/ViewTitle.vue'

import { Path } from '@/types'
</script>

<template>
  <div class="container">
    <ViewTitle emoji="👋" :path="Path.Users" unpaded />
  </div>
</template>