<script setup lang="ts">
import Texts from '@/texts'

import { frequencies, TransactionType } from '@/types'

defineProps<{ income?: number, transactionType: TransactionType, withActions: boolean }>()
</script>

<template>
  <thead>
    <tr>
      <th scope="col">
        {{ Texts.transactionTypes[transactionType]['singular'] }}
      </th>
      <th v-for="frequency in frequencies" :key="frequency" scope="col" class="text-end">
        {{ Texts.frequencies[frequency] }}
      </th>
      <th v-if="income" scope="col" class="text-end">
        % des revenus
      </th>
      <th v-if="withActions" scope="col" class="text-end">
        Actions
      </th>
    </tr>
  </thead>
</template>
