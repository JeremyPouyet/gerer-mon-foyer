<script setup lang="ts">
import type TransactionsEdit from './TransactionsEdit.vue'
import HistoryTransactionsShow from './HistoryTransactionsShow.vue'

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
      <component
        :is="componentType"
        :account="account"
        :income="{ label: '% des revenus commun', value: incomeSum }"
        :transaction-type="TransactionType.Expense"
      />
      <component :is="componentType" :account="account" :transaction-type="TransactionType.Income" />
    </div>
    <div v-for="user in users" :key="user.id" class="row">
      <UserNameTitle :account="user.account" :name="user.name" :with-note="withNote" />
      <component
        :is="componentType"
        :account="user.account"
        :income="{ label: '% de tes revenus', value: user.account.incomes.sum }"
        :transaction-type="TransactionType.Expense"
      />
      <component
        :is="componentType"
        :account="user.account"
        :income="{ label: '% de tes revenus', value: user.account.incomes.sum }"
        :transaction-type="TransactionType.PersonalExpense"
      />
      <component :is="componentType" :account="user.account" :transaction-type="TransactionType.Income" />
      <FinanceInfoBlock :user="user" :common-account="account" :common-bill="commonBill" :remain-sum="remainSum" />
    </div>
  </div>
</template>