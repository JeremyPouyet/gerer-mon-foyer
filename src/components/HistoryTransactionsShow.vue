<script setup lang="ts">
import NoteIcon from './NoteIcon.vue'
import TableFooter from './transactionsTable/TableFooter.vue'
import TableHeader from './transactionsTable/TableHeader.vue'

import { toRefs } from 'vue'

import { Frequency, TransactionType } from '@/types'
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
      <td class="text-end align-middle">
        {{ Texts.frequencies[transaction.frequency] }}
      </td>
      <!-- Transaction value -->
      <td class="text-end align-middle">
        {{ sexyNumber(valueAs(transaction, Frequency.monthly)) }}
      </td>
      <!-- Transaction income percentage -->
      <td v-if="income" aria-label="Pourcentage du revenu" class="text-end align-middle">
        {{ sexyNumber(valueAs(transaction) / income.value * 100) }}
      </td>
      <!-- Transaction note -->
      <td class="align-middle">
        {{ transaction.note }}
      </td>
    </tr>
  </tbody>
  <TableFooter :income="income?.value" :transaction-list="transactionList" />
</template>