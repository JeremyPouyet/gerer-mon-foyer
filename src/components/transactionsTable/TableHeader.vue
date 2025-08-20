<script setup lang="ts">
import Texts from '@/texts'

import { TransactionType } from '@/types'

defineProps<{ incomeLabel?: string, transactionType: TransactionType, withActions: boolean }>()
</script>

<template>
  <thead>
    <tr class="align-middle">
      <th scope="col">
        {{ Texts.transactionTypes[transactionType]['singular'] }}
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
      <th>Note</th>
      <th v-if="withActions" class="text-end" scope="col">
        Actions
      </th>
    </tr>
  </thead>
</template>
