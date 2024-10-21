<script setup lang="ts">
import NoteIcon from './NoteIcon.vue'
import TableFooter from './TransactionsTable/TableFooter.vue'
import TableHeader from './TransactionsTable/TableHeader.vue'

import { toRefs } from 'vue'

import type Account from '@/account'
import { sexyNumber, useTransactions, valueAs  } from '@/helpers'
import { frequencies, TransactionType } from '@/types'

const props = defineProps<{
  account: Account,
  income?: { label: string, value: number },
  transactionType: TransactionType
}>()
const { account, transactionType } = toRefs(props)
const { totals, transactionList } = useTransactions(account, transactionType)
</script>

<template>
  <TableHeader :income-label="income?.label" :transaction-type="transactionType" :with-actions="false" />
  <tbody>
    <tr v-for="transaction in transactionList.values" :key="transaction.id">
      <!-- Transaction name -->
      <td class="align-middle">
        <span>
          {{ transaction.name }}
        </span>
        <NoteIcon :text="transaction.note" />
      </td>
      <!-- Transaction frequency -->
      <td v-for="frequency in frequencies" :key="frequency" class="text-end align-middle">
        <span
          v-tooltip
          :data-bs-title="frequency === transaction.frequency ? transaction.value : ''"
        >
          {{ sexyNumber(valueAs(transaction, frequency)) }}
          <div v-show="transaction.frequency===frequency" class="underline" />
        </span>
      </td>
      <!-- Transaction income percentage -->
      <td v-if="income" class="text-end align-middle">
        {{ sexyNumber(valueAs(transaction) / income.value * 100) }}
      </td>
    </tr>
  </tbody>
  <TableFooter :income="income?.value" :totals="totals" :with-tds="false" />
</template>