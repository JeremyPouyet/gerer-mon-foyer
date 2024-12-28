<script setup lang="ts">
import { computed } from 'vue'

import { type TransactionList, frequencies } from '@/types'
import { sexyNumber } from '@/formaters'
import { valueAs } from '@/helpers'

const props = defineProps<{ income?: number, transactionList: TransactionList, withTds: boolean }>()

const totals = computed<number[]>(() =>
  frequencies.map(frequency =>
    props.transactionList.values.reduce((sum, transaction) => sum + valueAs(transaction, frequency), 0)
  )
)
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
      <td v-if="income != null" class="text-end">
        {{ sexyNumber((totals.at(-1) ?? 0) / (income * 12) * 100) }}
      </td>
      <!-- When the table has no action, additional tds are required -->
      <td v-if="withTds" colspan="2" />
    </tr>
  </tfoot>
</template>
