<script setup lang="ts">
import '@/assets/secondary.scss'

import TransactionsEdit from '@/components/TransactionsEdit.vue'
import UsersEdit from '@/components/UsersEdit.vue'
import BudgetShow from '@/components/BudgetShow.vue'

import { computed } from 'vue'
import db from '@/db'
import userManager from '@/userManager'
import { setHead, useFinanceCalculations } from '@/helpers'
import { Page } from '@/types'

setHead(Page.Budget)

const account = computed(() => db.account)
const users = computed(() => userManager.users)
const { commonBill, incomeSum, remainSum } = useFinanceCalculations(account, users)
</script>

<template>
  <div class="container-fluid mt-2">
    <div class="row">
      <div class="col-auto mb-4">
        <UsersEdit />
      </div>
      <BudgetShow
        :account="account"
        :users="users"
        :income-sum="incomeSum"
        :remain-sum="remainSum"
        :common-bill="commonBill"
        :with-note="true"
        :component-type="TransactionsEdit"
      />
    </div>
  </div>
</template>