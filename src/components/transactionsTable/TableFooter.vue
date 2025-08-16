<script setup lang="ts">
import { computed } from 'vue'

import { Frequency, type TransactionList } from '@/types'
import { sexyNumber } from '@/formaters'
import { valueAs } from '@/helpers'

const props = defineProps<{ income?: number, transactionList: TransactionList, withTds: boolean }>()

const total = computed<number>(() =>
  props.transactionList.values.reduce((sum, transaction) => sum + valueAs(transaction, Frequency.monthly), 0)
)
</script>

<template>
  <tfoot>
    <tr>
      <td class="fw-bold" colspan="2">
        Total
      </td>
      <td class="text-end">
        {{ sexyNumber(total) }}
      </td>
      <td v-if="income != null" class="text-end">
        {{ sexyNumber(total / (income * 12) * 100) }}
      </td>
      <!-- When the table has no action, additional tds are required -->
      <td v-if="withTds" colspan="2" />
    </tr>
  </tfoot>
</template>
