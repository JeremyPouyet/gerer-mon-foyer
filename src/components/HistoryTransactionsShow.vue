<script setup lang="ts">
import TableTitle from './TableTitle.vue'

import { computed } from 'vue'
import { Frequency, TransactionType } from '@/types'
import { round, valueAs  } from '@/helpers'
import type Account from '@/account'

const props = defineProps<{ account: Account, income?: number, transactionType: TransactionType }>()

const labels = {
  [TransactionType.Expense]: { plural: 'Dépenses', singular: 'Dépense' },
  [TransactionType.Income]: { plural: 'Revenus', singular: 'Revenu' }
}

const transactionList = computed(() => props.account.transactionSorted(props.transactionType))
const yTotal = computed(() => round(transactionList.value.values.reduce((sum, transaction) => sum + valueAs(transaction, Frequency.yearly), 0)))
</script>

<template>
  <div v-show="account.settings.show[transactionType]" class="col mb-4">
    <section>
      <TableTitle :title="labels[transactionType]['plural']" :transaction-type="transactionType" :account="account" />

      <div class="table-responsive shadowed-border mb-3">
        <table class="table table-hover table-responsive">
          <thead>
            <tr>
              <th scope="col">
                {{ labels[props.transactionType]['singular'] }}
              </th>
              <th scope="col" class="text-end">
                Mois
              </th>
              <th scope="col" class="text-end">
                Trimestre
              </th>
              <th scope="col" class="text-end">
                Semestre
              </th>
              <th scope="col" class="text-end">
                Année
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
                <span class="text-break" style="position:relative;" :title="transaction.note">
                  {{ transaction.name }}
                </span>
                <span
                  v-if="transaction.note"
                  data-toggle="tooltip"
                  :title="transaction.note"
                  class="translate-middle badge"
                  style="position:relative;top:-0.2rem;right:-0.6rem"
                >
                  <img src="@/assets/icons/message.png" class="icon-container-small">
                </span>
              </td>

              <!-- Transaction frequency -->
              <td v-for="frequency in [Frequency.monthly, Frequency.quarterly, Frequency.biannual, Frequency.yearly]" :key="frequency" class="char-width-10 text-end">
                <span :title="frequency===transaction.frequency ? transaction.value : ''">
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
              <td class="text-end">
                {{ round(transactionList.values.reduce((sum, transaction) => sum + valueAs(transaction), 0)) }}
              </td>
              <td class="text-end">
                {{ round(transactionList.values.reduce((sum, transaction) => sum + valueAs(transaction, Frequency.quarterly), 0)) }}
              </td>
              <td class="text-end">
                {{ round(transactionList.values.reduce((sum, transaction) => sum + valueAs(transaction, Frequency.quarterly), 0)) }}
              </td>
              <td class="text-end">
                {{ yTotal }}
              </td>
              <td v-if="props.income" class="text-end">
                {{ round(yTotal / (props.income * 12) * 100) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>
</template>