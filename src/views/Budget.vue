<script setup lang="ts">
import '@/assets/secondary.scss'

import TransactionsEdit from '@/components/TransactionsEdit.vue'
import UsersEdit from '@/components/UsersEdit.vue'
import BudgetShow from '@/components/BudgetShow.vue'

import db from '@/db'
import userManager from '@/managers/userManager'
</script>

<template>
  <div class="container-fluid mt-2">
    <div class="row">
      <div class="col-auto mb-4">
        <UsersEdit />
      </div>
      <BudgetShow
        :account="db.account"
        :users="userManager.users"
        :with-note="true"
        :component-type="TransactionsEdit"
      />
    </div>
  </div>
</template>