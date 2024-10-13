<script setup lang="ts">
import type TransactionsEdit from './TransactionsEdit.vue'
import type HistoryTransactionsShow from './HistoryTransactionsShow.vue'
import TableContainer from './TransactionsTable/TableContainer.vue'

import UserNameTitle from '@/components/UserNameTitle.vue'
import FinanceInfoBlock from '@/components/FinanceInfoBlock.vue'
import { TransactionType } from '@/types'
import Account from '@/account'
import type User from '@/user'

defineProps<{
  account: Account,
  users: User[],
  incomeSum: number,
  remainSum: number,
  commonBill: number,
  withNote: boolean,
  componentType: typeof TransactionsEdit | typeof HistoryTransactionsShow
}>()
</script>

<template>
  <div class="col">
    <div class="row">
      <UserNameTitle :account="account" :name="'Compte commun'" :with-note="withNote" />
      <TableContainer
        :account="account"
        :component-type="componentType"
        :income="{ label: '% des revenus commun', value: incomeSum }"
        :transaction-type="TransactionType.Expense"
      />
      <TableContainer :component-type="componentType" :account="account" :transaction-type="TransactionType.Income" />
    </div>
    <div v-for="user in users" :key="user.id" class="row">
      <UserNameTitle :account="user.account" :name="user.name" :with-note="withNote" />
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
      <FinanceInfoBlock :user="user" :common-account="account" :common-bill="commonBill" :remain-sum="remainSum" />
    </div>
  </div>
</template>