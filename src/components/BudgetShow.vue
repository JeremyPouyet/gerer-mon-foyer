<script setup lang="ts">
import type HistoryTransactionsShow from './HistoryTransactionsShow.vue'
import TableContainer from './transactionsTable/TableContainer.vue'
import type TransactionsEdit from './TransactionsEdit.vue'

import { computed } from 'vue'

import Account from '@/account'
import FinanceInfoBlock from '@/components/FinanceInfoBlock.vue'
import { TransactionType } from '@/types'
import type User from '@/user'
import UserNameTitle from '@/components/UserNameTitle.vue'

const props = defineProps<{
  account: Account,
  users: User[],
  withNote: boolean,
  componentType: typeof TransactionsEdit | typeof HistoryTransactionsShow
}>()

const account = computed(() => props.account)
const users = computed(() => props.users)
const commonBill = computed(() => Math.max(account.value.expenses.sum - account.value.incomes.sum, 0))
const incomeSum = computed(() => users.value.reduce((sum, user) => sum + user.account.incomes.sum, account.value.incomes.sum))
const remainSum = computed(() => users.value.reduce((sum, user) => sum + (user.account.incomes.sum - user.account.expenses.sum), 0))
</script>

<template>
  <div class="row mb-4">
    <UserNameTitle :account="account" :name="'Compte commun'" :with-note="withNote" />
    <TableContainer
      :account="account"
      :component-type="componentType"
      :income="{ label: '% des revenus commun', value: incomeSum }"
      :transaction-type="TransactionType.Expense"
    />
    <TableContainer :account="account" :component-type="componentType" :transaction-type="TransactionType.Income" />
  </div>
  <div v-for="user in users" :key="user.id" class="row mb-4">
    <UserNameTitle :account="user.account" :avatar="user.avatar" :name="user.name" :with-note="withNote" />
    <TableContainer
      :account="user.account"
      :component-type="componentType"
      :income="{ label: '% de tes revenus', value: user.account.incomes.sum }"
      :transaction-type="TransactionType.Expense"
    />
    <TableContainer
      :account="user.account"
      :component-type="componentType"
      :income="{ label: '% de tes revenus', value: user.account.incomes.sum }"
      :transaction-type="TransactionType.PersonalExpense"
    />
    <TableContainer :account="user.account" :component-type="componentType" :transaction-type="TransactionType.Income" />
    <FinanceInfoBlock :common-account="account" :common-bill="commonBill" :remain-sum="remainSum" :user="user" />
  </div>
</template>