<script setup lang="ts">
import { TextTransactionTypes } from '@/locales/transactionTypes'
import { TransactionType } from '@/types'

defineProps<{ incomeLabel?: string, transactionType: TransactionType, withActions: boolean }>()
</script>

<template>
  <thead>
    <tr class="align-middle">
      <th scope="col">
        {{ TextTransactionTypes[transactionType]['singular'] }}
      </th>
      <th scope="col">
        Fréquence
      </th>
      <th class="text-end" scope="col">
        Coût par mois
      </th>
      <th v-if="incomeLabel" class="text-end" scope="col">
        {{ incomeLabel }}
      </th>
      <th scope="col">
        Note
      </th>
      <th v-if="withActions" class="text-end" scope="col">
        Actions
      </th>
    </tr>
  </thead>
</template>
