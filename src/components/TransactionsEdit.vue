<script setup lang="ts">
import Note from '@/components/Note.vue'
import NoteIcon from './NoteIcon.vue'
import TableTitle from './TableTitle.vue'

import { type ComponentPublicInstance, nextTick, ref, toRefs } from 'vue'

import { round, useTransactions, valueAs } from '@/helpers'
import { frequencies, Frequency, type ID, type Transaction, type TransactionFunctional, TransactionType } from '@/types'
import type Account from '@/account'
import Texts from '@/texts'

const props = defineProps<{ account: Account, income?: number, transactionType: TransactionType }>()
const { account, transactionType } = toRefs(props)
const { totals, transactionList } = useTransactions(account, transactionType)

const editedName = ref<string>('')
const editedNameId = ref<ID>()
const editedValueId = ref<ID>()
const editedFrequency = ref<Frequency>()
const editedValue = ref<string>('')

const newTransaction = ref<TransactionFunctional>({ frequency: Frequency.monthly, name: '',  value: '' })
let input : HTMLInputElement
const newTransactionInputName = ref<HTMLInputElement>()

function transactionAdd() : void {
  if (!account.value.create(props.transactionType, newTransaction.value))
    return

  newTransaction.value = { frequency: Frequency.monthly, name: '', value: '' }

  // once the transaction is added, expect the user to add a new one
  nextTick(() => newTransactionInputName.value?.focus())
}

function setActiveInput(el: Element | ComponentPublicInstance | null) : void {
  if (el)
    input = el as HTMLInputElement
}

function startEditTransactionName(transaction: Transaction) : void {
  cancelEditTransactionValue()
  editedNameId.value = transaction.id
  editedName.value = transaction.name
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => input?.focus())
}

function cancelEditTransactionName() : void {
  editedNameId.value = undefined
  editedName.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function executeEditTransactionName() : void {
  if (editedNameId.value && account.value.update(props.transactionType, editedNameId.value, { name: editedName.value }))
    cancelEditTransactionName()
}

function startEditTransactionValue(transaction: Transaction, newFrequency: Frequency) : void {
  cancelEditTransactionName()
  editedFrequency.value = newFrequency
  editedValueId.value = transaction.id
  editedValue.value = newFrequency === transaction.frequency
    ? transaction.value
    : round(valueAs(transaction, newFrequency)).toString()
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => input?.focus())
}

function cancelEditTransactionValue() : void {
  editedFrequency.value = undefined
  editedValueId.value = undefined
  editedValue.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function executeEditTransactionValue() : void {
  const draft = { frequency: editedFrequency.value, value: editedValue.value }

  if (editedValueId.value && account.value.update(props.transactionType, editedValueId.value, draft))
    cancelEditTransactionValue()
}

function handleClickOutside(event: MouseEvent) : void {
  if (input && !input.contains(event.target as Node)) {
    executeEditTransactionName()
    executeEditTransactionValue()
  }
}
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
              <th scope="col" class="text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactionList.values" :key="transaction.id">
              <!-- Transaction name -->
              <td>
                <template v-if="editedNameId === transaction.id">
                  <input
                    :ref="el => setActiveInput(el)"
                    v-model="editedName"
                    class="char-width-20"
                    type="text"
                    @keydown.esc="cancelEditTransactionName"
                    @keydown.enter="executeEditTransactionName"
                    @keydown.tab="executeEditTransactionName"
                  >
                </template>
                <template v-else>
                  <span
                    class="editable-text text-break"
                    @click="() => startEditTransactionName(transaction)"
                  >
                    {{ transaction.name }}
                  </span>
                  <NoteIcon :text="transaction.note" />
                </template>
              </td>

              <!-- Transaction value by frequency -->
              <td v-for="frequency in frequencies" :key="frequency" class="text-end">
                <template v-if="editedValueId == transaction.id && editedFrequency == frequency">
                  <input
                    :ref="el => setActiveInput(el)"
                    v-model="editedValue"
                    type="text"
                    class="w-100"
                    @keydown.esc="cancelEditTransactionValue"
                    @keydown.enter="executeEditTransactionValue"
                    @keydown.tab="executeEditTransactionValue"
                  >
                </template>
                <template v-else>
                  <span
                    v-tooltip
                    class="editable-text"
                    :data-bs-title="frequency === transaction.frequency ? transaction.value : ''"
                    @click="() => startEditTransactionValue(transaction, frequency)"
                  >
                    {{ round(valueAs(transaction, frequency)) }}
                    <div v-show="transaction.frequency===frequency" class="underline" />
                  </span>
                </template>
              </td>

              <!-- Transaction income percentage -->
              <td v-if="props.income" class="text-end">
                {{ round(valueAs(transaction) / props.income * 100) }}
              </td>

              <!-- Actions -->
              <td class="text-end align-middle">
                <Note :item="transaction" @update="note => transaction.note = note" />
                <img
                  v-tooltip
                  src="@/assets/icons/cross.png"
                  alt="Supprimer"
                  data-bs-title="Supprimer"
                  class="icon-container-small icon-hoverable ms-2"
                  @click="() => account.delete(props.transactionType, transaction)"
                >
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
              <td colspan="2" />
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Create transaction -->
      <div class="input-group flex-sm-row">
        <input
          ref="newTransactionInputName"
          v-model="newTransaction.name"
          v-tooltip
          type="text"
          :placeholder="Texts.transactionTypes[props.transactionType]['singular']"
          class="form-control"
          aria-label="Nom de la transaction"
          data-bs-placement="bottom"
          :data-bs-title="`${transactionType == TransactionType.Expense ? 'eau/gaz/courses' : 'salaire/allocation/rentes'}`"
          @keydown.enter="transactionAdd"
        >
        <input
          v-model="newTransaction.value"
          v-tooltip
          data-bs-placement="bottom"
          type="text"
          placeholder="Valeur ou formule"
          class="form-control"
          data-bs-title="Exemples:<ul><li class='text-start'>500</li><li class='text-start'>10 * 50</li><li class='text-start'>1000 / 2</li><li class='text-start'>250 + 250</li>"
          aria-label="Valeur de la transaction"
          @keydown.enter="transactionAdd"
        >
        <span class="input-group-text">€</span>
        <div class="w-100 d-sm-none" />

        <select
          v-model="newTransaction.frequency"
          v-tooltip
          class="form-select mt-2 mt-sm-0"
          data-bs-placement="bottom"
          data-bs-title="Fréquence"
          @keydown.enter="transactionAdd"
        >
          <option v-for="(name, frequency) in Texts.frequencies" :key="frequency" :value="frequency">
            {{ name }}
          </option>
        </select>
        <button class="btn btn-primary default-button mt-2 mt-sm-0" :disabled="!newTransaction.name || !newTransaction.value" @click="transactionAdd">
          Ajouter
        </button>
      </div>
    </section>
  </div>
</template>