<script setup lang="ts">
import TransactionsEdit from '@/components/TransactionsEdit.vue'
import UsersEdit from '@/components/UsersEdit.vue'
import BudgetShow from '@/components/BudgetShow.vue'

import { toRefs } from 'vue'
import db from '@/db'
import userManager from '@/userManager'
import { useFinanceCalculations } from '@/helpers'

const { account, users } = toRefs({ account: db.account, users: userManager.users })
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