<script setup lang="ts">
  import FinanceInfoBlock from '@/components/FinanceInfoBlock.vue'
  import TransactionsEdit from '@/components/TransactionsEdit.vue'
  import UsersEdit from '@/components/UsersEdit.vue'
  import UserNameTitle from '@/components/UserNameTitle.vue'

  import { computed } from 'vue'
  import db from '@/db'
  import { TransactionType } from '@/types'

  const commonBill = computed<number>(() => Math.max(db.account.expenses.sum - db.account.incomes.sum, 0))
  const incomeSum = computed(() => db.users.reduce((sum, user) => sum + user.account.incomes.sum, db.account.incomes.sum))
  const remainSum = computed<number>(() => db.users.reduce((sum, user) => sum + user.monthlyRemainingBalance, 0))
</script>

<template>
  <div class="container-fluid mt-2">
    <div class="row">
      <div class="col-auto mb-4">
        <UsersEdit />
      </div>
      <div class="col">
        <div class="row">
          <UserNameTitle :account="db.account" :name="'Compte commun'" :with-note="true" />
          <TransactionsEdit :account="db.account" :transaction-type="TransactionType.Expense" :income="incomeSum" />
          <TransactionsEdit :account="db.account" :transaction-type="TransactionType.Income" />
        </div>
        <div v-for="user in db.users" :key="user.id" class="row">
          <UserNameTitle :account="user.account" :name="user.name" :with-note="true" />
          <TransactionsEdit :account="user.account" :transaction-type="TransactionType.Expense" :income="user.account.incomes.sum" />
          <div class="col mb-4">
            <TransactionsEdit :account="user.account" :transaction-type="TransactionType.Income" />
            <FinanceInfoBlock :user="user" :common-bill="commonBill" :remain-sum="remainSum" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>