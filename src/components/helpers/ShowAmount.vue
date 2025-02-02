<script setup lang="ts">
import { sexyAmount } from '@/formaters'

defineProps<{ amount: number }>()
</script>

<template>
  <span class="fw-bold text-danger">{{ sexyAmount(amount) }}</span>
</template>