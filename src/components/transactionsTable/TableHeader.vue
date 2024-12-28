<script setup lang="ts">
import Texts from '@/texts'

import { TransactionType, frequencies } from '@/types'

defineProps<{ incomeLabel?: string, transactionType: TransactionType, withActions: boolean }>()
</script>

<template>
  <thead>
    <tr class="align-middle">
      <th scope="col">
        {{ Texts.transactionTypes[transactionType]['singular'] }}
      </th>
      <th v-for="frequency in frequencies" :key="frequency" class="text-end" scope="col">
        {{ Texts.frequencies[frequency] }}
      </th>
      <th v-if="incomeLabel" class="text-end" scope="col">
        {{ incomeLabel }}
      </th>
      <th v-if="withActions" class="text-end" scope="col">
        Actions
      </th>
    </tr>
  </thead>
</template>
