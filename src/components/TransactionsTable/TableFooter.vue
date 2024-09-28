<script setup lang="ts">
import type Account from '@/account'
import { round } from '@/helpers'

const props = defineProps<{
  account: Account,
  income?: number,
  totals: number[],
  withTds: boolean
}>()
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
      <td v-if="props.income" class="text-end">
        {{ round(totals.at(-1) ?? 0 / (props.income * 12) * 100) }}
      </td>
      <!-- When the table has no action, additional tds are required -->
      <td v-if="withTds" colspan="2" />
    </tr>
  </tfoot>
</template>
