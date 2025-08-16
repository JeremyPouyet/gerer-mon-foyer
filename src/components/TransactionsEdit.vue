<script setup lang="ts">
import TableFooter from './transactionsTable/TableFooter.vue'
import TableHeader from './transactionsTable/TableHeader.vue'

import { nextTick, ref, toRaw, toRefs } from 'vue'

import { Frequency, type ID, type Transaction, TransactionType } from '@/types'
import { useTransactions, valueAs } from '@/helpers'
import type Account from '@/account'
import { AccountType } from '@/account'
import Texts from '@/texts'
import { sexyNumber } from '@/formaters'
import userManager from '@/managers/userManager'

const props = defineProps<{
  account: Account,
  income?: { label: string, value: number },
  transactionType: TransactionType
}>()

const { account, transactionType } = toRefs(props)
const transactionList = useTransactions(account, transactionType)

const editedTransaction = ref<Partial<Transaction>>({ })
const editedTransactionId = ref<ID | null>()

const editedRowEl = ref<HTMLElement | null>(null)

function startEditTransaction(transaction: Transaction, rowEl: HTMLElement) : void {
  Object.assign(editedTransaction.value, transaction)
  editedTransactionId.value = transaction.id

  editedRowEl.value = rowEl

  // Wait for next tick to ensure rowEl is rendered
  nextTick(() => {
    // small delay ensures the current click doesn't trigger it
    setTimeout(() => { document.addEventListener('click', handleClickOutside) }, 0)
  })
}

function executeEditTransaction() : void {
  if (editedTransactionId.value && account.value.update(props.transactionType, editedTransactionId.value, toRaw(editedTransaction.value))) {
    if (account.value.type === AccountType.Personal)
      userManager.computeRatios()
    cancelEditTransaction()
  }
}

function cancelEditTransaction() : void {
  editedTransactionId.value = null
  document.removeEventListener('click', handleClickOutside)
  editedRowEl.value = null
}

function deleteTransaction(transaction: Transaction) {
  if (!account.value.delete(props.transactionType, transaction))
    return
  if (account.value.type === AccountType.Personal)
    userManager.computeRatios()
}

function handleClickOutside(event: MouseEvent) {
  if (editedRowEl.value && !editedRowEl.value.contains(event.target as Node)) {
    cancelEditTransaction()
  }
}
</script>

<template>
  <TableHeader :income-label="income?.label" :transaction-type="transactionType" :with-actions="true" />
  <tbody>
    <tr v-for="transaction in transactionList.values" :key="transaction.id">
      <!-- Transaction name -->
      <td v-if="editedTransactionId === transaction.id">
        <input
          v-model="editedTransaction.name"
          class="char-width-20"
          type="text"
          @keydown.enter="executeEditTransaction"
          @keydown.esc="cancelEditTransaction"
          @keydown.tab="executeEditTransaction"
        >
      </td>
      <td
        v-else
        :aria-label="`Nom ${Texts.transactionTypes[transactionType].articleSingular}.`"
        class="align-middle"
      >
        {{ transaction.name }}
      </td>
      <!-- Transaction frequency -->
      <td v-if="editedTransactionId === transaction.id">
        <select
          v-model="editedTransaction.frequency"
          aria-label="Fréquence de la transaction"
          class="form-select mt-2 mt-sm-0"
          @keydown.enter="executeEditTransaction"
          @keydown.esc="cancelEditTransaction"
          @keydown.tab="executeEditTransaction"
        >
          <option v-for="(name, frequency) in Texts.frequencies" :key="frequency" :value="frequency">
            {{ name }}
          </option>
        </select>
      </td>
      <td v-else class="align-middle">
        {{ Texts.frequencies[transaction.frequency] }}
      </td>
      <!-- Transaction value -->
      <td v-if="editedTransactionId == transaction.id">
        <input
          v-model="editedTransaction.value"
          class="w-100"
          type="text"
          @keydown.enter="executeEditTransaction"
          @keydown.esc="cancelEditTransaction"
          @keydown.tab="executeEditTransaction"
        >
      </td>
      <td
        v-else
        :aria-label="`Valeur ${Texts.transactionTypes[transactionType].articleSingular} (${Texts.frequencies[Frequency.monthly]}).`"
        class="text-end align-middle"
      >
        {{ sexyNumber(valueAs(transaction, Frequency.monthly)) }}
      </td>
      <!-- Transaction income percentage -->
      <td v-if="income" class="text-end align-middle">
        {{ sexyNumber(valueAs(transaction) / income.value * 100) }}
      </td>
      <td v-if="editedTransactionId == transaction.id">
        <textarea
          v-model="editedTransaction.note"
          @keydown.ctrl.enter="executeEditTransaction"
          @keydown.esc="cancelEditTransaction"
          @keydown.tab="executeEditTransaction"
        />
      </td>
      <!-- Transaction note -->
      <td v-else class="align-middle">
        {{ transaction.note }}
      </td>
      <!-- Actions -->
      <td class="text-end align-middle text-nowrap">
        <img
          v-if="!editedTransactionId"
          v-tooltip="{ disposeOnClick: true }"
          alt="Éditer"
          aria-label="Éditer la ligne"
          class="icon-container-small icon-hoverable"
          data-bs-title="Éditer"
          role="button"
          src="@/assets/icons/pencil.png"
          tabindex="0"
          @click="startEditTransaction(transaction, $event.currentTarget.closest('tr') as HTMLElement)"
          @keydown.enter="startEditTransaction(transaction, $event.currentTarget.closest('tr') as HTMLElement)"
        >
        <img
          v-else
          v-tooltip="{ disposeOnClick: true }"
          alt="Sauvegarder"
          aria-label="Sauvegarder la ligne"
          class="icon-container-small icon-hoverable"
          data-bs-title="Sauvegarder"
          role="button"
          src="@/assets/icons/diskette.png"
          tabindex="0"
          @click="executeEditTransaction"
          @keydown.enter="executeEditTransaction"
        >
        <img
          v-tooltip="{ disposeOnClick: true }"
          alt="Supprimer"
          aria-label="Supprimer la ligne"
          class="icon-container-small icon-hoverable ms-2"
          data-bs-title="Supprimer"
          role="button"
          src="@/assets/icons/cross.png"
          tabindex="0"
          @click="deleteTransaction(transaction)"
          @keydown.enter="deleteTransaction(transaction)"
        >
      </td>
    </tr>
  </tbody>
  <TableFooter :income="income?.value" :transaction-list="transactionList" />
</template>