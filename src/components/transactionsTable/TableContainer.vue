<script setup lang="ts">
import type HistoryTransactionsShow from '../HistoryTransactionsShow.vue'
import type TransactionsEdit from '../TransactionsEdit.vue'

import { computed, inject, nextTick, ref, toRefs } from 'vue'

import { type TransactionFunctional, TransactionType } from '@/types'
import type Account from '@/account'
import { AccountType } from '@/account'
import Texts from '@/texts'
import settingManager from '@/managers/settingManager'
import userManager from '@/managers/userManager'

const props = defineProps<{
  account: Account,
  income?: { label: string, value: number },
  transactionType: TransactionType,
  componentType: typeof TransactionsEdit | typeof HistoryTransactionsShow
}>()
const { account, transactionType } = toRefs(props)
const newTransaction = ref({ frequency: '', name: '',  value: '' })
const newTransactionInputName = ref<HTMLInputElement>()
const editBudget = inject<boolean>('editBudget')

function transactionAdd() : void {
  if (!account.value.create(props.transactionType, newTransaction.value as TransactionFunctional))
    return

  if (account.value.type === AccountType.Personal)
    userManager.computeRatios()

  newTransaction.value = { frequency: '', name: '', value: '' }

  // once the transaction is added, expect the user to add a new one
  nextTick(() => newTransactionInputName.value?.focus())
}

const lgClass = computed(() => {
  const show = props.account.settings.show
  // If the account is common and one of the transaction array is hidden on large screens
  return props.account.type === AccountType.Common && (!show.expenses || !show.incomes)
    ? 'col-lg-12' // Then show the transaction array full screen
    : 'col-lg-6'  // Otherwise a transaction array takes 50% of the screen to show both
})

function hideTransactions(transactionType: TransactionType) {
  props.account.settings.show[transactionType] = false
}

const inputNameText = computed(() => {
  if (transactionType.value === TransactionType.Expense)
    return account.value.type === AccountType.Personal ? 'Crédits/assurance/travail' : 'Eau/gaz/courses/...'

  if (transactionType.value === TransactionType.Income)
    return account.value.type === AccountType.Personal ? 'Salaire/allocations/rentes/...' : 'Locations/ventes/...'

  return 'Musique/cinéma/passe-temps/...'
})
</script>

<template>
  <div
    v-show="account.settings.show[transactionType]"
    class="col-sm-12 col-md-12 mb-4"
    :class="lgClass"
  >
    <section>
      <div class="table-title-container rounded-shadow d-flex align-items-center justify-content-center position-relative">
        <h1 class="table-title align-bottom">
          {{ Texts.transactionTypes[transactionType]['plural'] }}
        </h1>
        <img
          v-tooltip="{ disposeOnClick: true }"
          :alt="`Cacher les ${Texts.transactionTypes[transactionType]['plural'].toLowerCase()}`"
          class="icon-container icon-hoverable position-absolute me-2 end-0"
          data-bs-placement="left"
          :data-bs-title="`Cacher les ${Texts.transactionTypes[transactionType]['plural'].toLowerCase()}`"
          role="button"
          src="@/assets/icons/hide.png"
          tabindex="0"
          @click="hideTransactions(transactionType)"
          @keydown.enter="hideTransactions(transactionType)"
        >
      </div>

      <div class="table-responsive shadowed-border mb-3">
        <table class="table table-hover mb-0">
          <component
            :is="componentType"
            :account="account"
            :income="income"
            :transaction-type="transactionType"
          />
        </table>
      </div>

      <div v-if="editBudget" class="input-group flex-sm-row">
        <input
          ref="newTransactionInputName"
          v-model="newTransaction.name"
          v-tooltip
          aria-label="Nom de la transaction"
          class="form-control"
          data-bs-placement="bottom"
          :data-bs-title="inputNameText"
          :placeholder="Texts.transactionTypes[props.transactionType]['singular']"
          type="text"
          @keydown.enter="transactionAdd"
        >
        <span v-if="!settingManager.isCurrencySymbolOnRight()" class="input-group-text">
          {{ settingManager.getCurrencySymbol() }}
        </span>
        <input
          v-model="newTransaction.value"
          v-tooltip
          aria-label="Valeur de la transaction"
          class="form-control"
          data-bs-placement="bottom"
          data-bs-title="Exemples:<ul><li class='text-start'>500</li><li class='text-start'>10 * 50</li><li class='text-start'>1000 / 2</li><li class='text-start'>250 + 250</li>"
          placeholder="Valeur ou formule"
          type="text"
          @keydown.enter="transactionAdd"
        >
        <span v-if="settingManager.isCurrencySymbolOnRight()" class="input-group-text">
          {{ settingManager.getCurrencySymbol() }}
        </span>
        <div class="w-100 d-sm-none" />

        <select
          v-model="newTransaction.frequency"
          v-tooltip
          aria-label="Fréquence de la transaction"
          class="form-select mt-2 mt-sm-0"
          data-bs-placement="bottom"
          data-bs-title="Fréquence"
          @keydown.enter="transactionAdd"
        >
          <option disabled hidden value="">
            Fréquence
          </option>
          <option v-for="(name, frequency) in Texts.frequencies" :key="frequency" :value="frequency">
            {{ name }}
          </option>
        </select>
        <button
          aria-label="Ajouter une entrée"
          class="btn btn-secondary mt-2 mt-sm-0"
          :disabled="!newTransaction.name || !newTransaction.value || !newTransaction.frequency"
          tabindex="0"
          @click="transactionAdd"
          @keydown.enter="transactionAdd"
        >
          Ajouter
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.table-title {
  font-size: 1.5em;
  font-weight: normal;
  color: #333333; /* Dark gray text */
  margin: 0;
  text-align: center;
}
</style>