<script setup lang="ts">
import TransactionsEdit from '../TransactionsEdit.vue'
import type HistoryTransactionsShow from '../HistoryTransactionsShow.vue'

import { computed, nextTick, ref, toRefs } from 'vue'

import type Account from '@/account'
import { AccountType } from '@/account'
import Texts from '@/texts'
import { Frequency, type TransactionFunctional, TransactionType } from '@/types'
import SettingsManager from '@/managers/SettingsManager'

const props = defineProps<{
  account: Account,
  income?: { label: string, value: number },
  transactionType: TransactionType,
  componentType: typeof TransactionsEdit | typeof HistoryTransactionsShow
}>()
const { account, transactionType } = toRefs(props)
const newTransaction = ref<TransactionFunctional>({ frequency: Frequency.monthly, name: '',  value: '' })
const newTransactionInputName = ref<HTMLInputElement>()

function transactionAdd() : void {
  if (!account.value.create(props.transactionType, newTransaction.value))
    return

  newTransaction.value = { frequency: Frequency.monthly, name: '', value: '' }

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
          src="@/assets/icons/hide.png"
          class="icon-container icon-hoverable position-absolute end-0"
          alt="Cacher"
          data-bs-placement="left"
          data-bs-title="Cacher"
          @click="() => props.account.settings.show[props.transactionType] = false"
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

      <div v-if="componentType === TransactionsEdit" class="input-group flex-sm-row">
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
        <span v-if="!SettingsManager.isCurrencySymbolOnRight()" class="input-group-text">
          {{ SettingsManager.getCurrencySymbol() }}
        </span>
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
        <span v-if="SettingsManager.isCurrencySymbolOnRight()" class="input-group-text">
          {{ SettingsManager.getCurrencySymbol() }}
        </span>
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
        <button class="btn btn-secondary mt-2 mt-sm-0" :disabled="!newTransaction.name || !newTransaction.value" @click="transactionAdd">
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