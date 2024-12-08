<script setup lang="ts">
import '@/assets/secondary.scss'

import TransactionsEdit from '@/components/TransactionsEdit.vue'
import UsersEdit from '@/components/leftColumns/UsersEdit.vue'
import BudgetShow from '@/components/BudgetShow.vue'

import db from '@/db'
import userManager from '@/managers/userManager'
import LeftColumn from '@/components/leftColumns/LeftColumn.vue'
</script>

<template>
  <div class="container-fluid mt-2">
    <div class="row">
      <LeftColumn :title="'Habitants'">
        <UsersEdit />
      </LeftColumn>
      <BudgetShow
        :account="db.account"
        :users="userManager.users"
        :with-note="true"
        :component-type="TransactionsEdit"
      />
    </div>
  </div>
</template>