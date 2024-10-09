<script setup lang="ts">
import NoteIcon from './NoteIcon.vue'
import TableFooter from './TransactionsTable/TableFooter.vue'
import TableHeader from './TransactionsTable/TableHeader.vue'
import TableTitle from './TransactionsTable/TableTitle.vue'

import { toRefs } from 'vue'

import type Account from '@/account'
import { round, useTransactions, valueAs  } from '@/helpers'
import Texts from '@/texts'
import { frequencies, TransactionType } from '@/types'

const props = defineProps<{
  account: Account,
  income?:  { label: string, value: number },
  transactionType: TransactionType
}>()
const { account, transactionType } = toRefs(props)
const { totals, transactionList } = useTransactions(account, transactionType)
</script>

<template>
  <div v-show="account.settings.show[transactionType]" class="col mb-4">
    <section>
      <TableTitle :account="account" :title="Texts.transactionTypes[transactionType]['plural']" :transaction-type="transactionType" />

      <div class="table-responsive shadowed-border mb-3">
        <table class="table table-hover">
          <TableHeader :income-label="income?.label" :transaction-type="transactionType" :with-actions="false" />
          <tbody>
            <tr v-for="transaction in transactionList.values" :key="transaction.id">
              <!-- Transaction name -->
              <td>
                <span>
                  {{ transaction.name }}
                </span>
                <NoteIcon :text="transaction.note" />
              </td>

              <!-- Transaction frequency -->
              <td v-for="frequency in frequencies" :key="frequency" class="text-end">
                <span
                  v-tooltip
                  :data-bs-title="frequency === transaction.frequency ? transaction.value : ''"
                >
                  {{ round(valueAs(transaction, frequency)) }}
                  <div v-show="transaction.frequency===frequency" class="underline" />
                </span>
              </td>

              <!-- Transaction income percentage -->
              <td v-if="income" class="text-end">
                {{ round(valueAs(transaction) / income.value * 100) }}
              </td>
            </tr>
          </tbody>
          <TableFooter :income="income?.value" :totals="totals" :with-tds="false" />
        </table>
      </div>
    </section>
  </div>
</template>