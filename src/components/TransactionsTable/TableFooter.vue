<script setup lang="ts">
import { round } from '@/helpers'

defineProps<{ income?: number, totals: number[], withTds: boolean }>()
</script>

<template>
  <tfoot>
    <tr>
      <td class="fw-bold">
        Total
      </td>
      <td v-for="(total, index) in totals" :key="`total-${index}`" class="text-end">
        {{ total }}
      </td>
      <td v-if="income" class="text-end">
        {{ round(totals.at(-1) ?? 0 / (income * 12) * 100) }}
      </td>
      <!-- When the table has no action, additional tds are required -->
      <td v-if="withTds" colspan="2" />
    </tr>
  </tfoot>
</template>
