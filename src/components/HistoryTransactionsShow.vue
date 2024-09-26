<script setup lang="ts">
import NoteIcon from './NoteIcon.vue'
import TableTitle from './TableTitle.vue'

import { toRefs } from 'vue'
import { frequencies, TransactionType } from '@/types'
import { round, useTransactions, valueAs  } from '@/helpers'
import type Account from '@/account'
import Texts from '@/texts'

const props = defineProps<{ account: Account, income?: number, transactionType: TransactionType }>()
const { account, transactionType } = toRefs(props)
const { totals, transactionList } = useTransactions(account, transactionType)
</script>

<template>
  <div v-show="account.settings.show[transactionType]" class="col mb-4">
    <section>
      <TableTitle :account="account" :title="Texts.transactionTypes[transactionType]['plural']" :transaction-type="transactionType" />

      <div class="table-responsive shadowed-border mb-3">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">
                {{ Texts.transactionTypes[props.transactionType]['singular'] }}
              </th>
              <th v-for="frequency in frequencies" :key="frequency" scope="col" class="text-end">
                {{ Texts.frequencies[frequency] }}
              </th>
              <th v-if="props.income" scope="col" class="text-end">
                % des revenus
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactionList.values" :key="transaction.id">
              <!-- Transaction name -->
              <td>
                <span class="text-break">
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
              <td v-if="props.income" class="text-end">
                {{ round(valueAs(transaction) / props.income * 100) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="fw-bold">
                Total
              </td>
              <td v-for="total in totals" :key="total" class="text-end">
                {{ total }}
              </td>
              <td v-if="props.income" class="text-end">
                {{ round(totals.at(-1) ?? 0 / (props.income * 12) * 100) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>
</template>