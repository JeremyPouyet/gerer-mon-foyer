<script setup lang="ts">
import '@/assets/secondary.scss'

import { provide } from 'vue'

import BudgetShow from '@/components/BudgetShow.vue'
import { Path } from '@/types'
import TransactionsEdit from '@/components/TransactionsEdit.vue'
import ViewTitle from '@/components/ViewTitle.vue'
import db from '@/db'
import userManager from '@/managers/userManager'

provide('editBudget', true)

async function historicize() {
  const db = await import('@/db')
  db.default.historicize()
}
</script>

<template>
  <div class="container-fluid">
    <div class="position-relative">
      <ViewTitle emoji="💸" :path="Path.Budget" />

      <button
        aria-label="Ajouter le budget actuel à l’historique"
        class="end-0 top-0 position-absolute btn btn-secondary"
        tabindex="0"
        @click="historicize"
        @keypress.enter="historicize"
      >
        Historiser
      </button>
    </div>
    <BudgetShow
      :account="db.account"
      :component-type="TransactionsEdit"
      :users="userManager.users"
      :with-note="true"
    />
  </div>
</template>