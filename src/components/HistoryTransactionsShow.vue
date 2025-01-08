<script setup lang="ts">
import NoteIcon from './NoteIcon.vue'
import TableFooter from './transactionsTable/TableFooter.vue'
import TableHeader from './transactionsTable/TableHeader.vue'

import { toRefs } from 'vue'

import { TransactionType, frequencies } from '@/types'
import { useTransactions, valueAs  } from '@/helpers'
import type Account from '@/account'
import Texts from '@/texts'
import { sexyNumber } from '@/formaters'

const props = defineProps<{
  account: Account,
  income?: { label: string, value: number },
  transactionType: TransactionType
}>()
const { account, transactionType } = toRefs(props)
const transactionList = useTransactions(account, transactionType)
</script>

<template>
  <TableHeader :income-label="income?.label" :transaction-type="transactionType" :with-actions="false" />
  <tbody>
    <tr v-for="transaction in transactionList.values" :key="transaction.id">
      <!-- Transaction name -->
      <td :aria-label="`Nom ${Texts.transactionTypes[transactionType].articleSingular}`" class="align-middle">
        <span>
          {{ transaction.name }}
        </span>
        <NoteIcon :text="transaction.note" />
      </td>
      <!-- Transaction frequency -->
      <td v-for="frequency in frequencies" :key="frequency" :aria-label="`Valeur ${Texts.transactionTypes[transactionType].articleSingular} (${Texts.frequencies[frequency]}).`" class="text-end align-middle">
        <span
          v-tooltip
          :data-bs-title="frequency === transaction.frequency ? transaction.value : ''"
        >
          {{ sexyNumber(valueAs(transaction, frequency)) }}
          <div v-show="transaction.frequency===frequency" class="underline" />
        </span>
      </td>
      <!-- Transaction income percentage -->
      <td v-if="income" aria-label="Pourcentage du revenu" class="text-end align-middle">
        {{ sexyNumber(valueAs(transaction) / income.value * 100) }}
      </td>
    </tr>
  </tbody>
  <TableFooter :income="income?.value" :transaction-list="transactionList" :with-tds="false" />
</template>