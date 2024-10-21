<script setup lang="ts">
import { sexyNumber } from '@/helpers'

defineProps<{ income?: number, totals: number[], withTds: boolean }>()
</script>

<template>
  <tfoot>
    <tr>
      <td class="fw-bold">
        Total
      </td>
      <td v-for="(total, index) in totals" :key="`total-${index}`" class="text-end">
        {{ sexyNumber(total) }}
      </td>
      <td v-if="income" class="text-end">
        {{ sexyNumber((totals.at(-1) ?? 0) / (income * 12) * 100) }}
      </td>
      <!-- When the table has no action, additional tds are required -->
      <td v-if="withTds" colspan="2" />
    </tr>
  </tfoot>
</template>
