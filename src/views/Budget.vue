<script setup lang="ts">
import '@/assets/secondary.scss'

import BudgetShow from '@/components/BudgetShow.vue'
import LeftColumn from '@/components/leftColumns/LeftColumn.vue'
import TransactionsEdit from '@/components/TransactionsEdit.vue'
import UsersEdit from '@/components/leftColumns/UsersEdit.vue'
import ViewTitle from '@/components/ViewTitle.vue'

import db from '@/db'
import userManager from '@/managers/userManager'

import { Path } from '@/types'

</script>

<template>
  <div class="container-fluid">
    <ViewTitle :path="Path.Budget" emoji="💸" />

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