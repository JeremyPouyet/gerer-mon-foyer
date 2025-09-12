<script setup lang="ts">
import Note from '@/components/Note.vue'

import { computed } from 'vue'

import Account, { AccountType } from '@/account'
import Texts from '@/texts'
import { TransactionType } from '@/types'
import { user_icons } from '@/icons/users'

const props = defineProps<{ account: Account, name: string, picture?: string, withNote: boolean }>()

const transactionTypes: TransactionType[] = [
  TransactionType.Expense,
  TransactionType.Income,
  // Onle a personal account has personal expenses !
  ...(props.account.type === AccountType.Personal ? [TransactionType.PersonalExpense] : [])
]

const visibleTransactionTypes = computed(() => transactionTypes.filter(type => !props.account.settings.show[type]))

function showTransactions(transactionType: TransactionType) {
  props.account.settings.show[transactionType] = true
}
</script>

<template>
  <div class="container">
    <div class="d-flex justify-content-between">
      <div>
        <!-- Set an id to be used as an inner page anchor -->
        <h2 :id="name" class="fs-3">
          <img
            v-if="picture"
            :alt="`Avatar de ${name}`"
            class="user-avatar shadow-sm"
            :src="user_icons[picture]"
          >
          {{ name }}
          <Note v-if="props.withNote" :item="props.account" @update="note => account.note = note" />
        </h2>
      </div>
      <div class="d-flex gap-3">
        <div
          v-for="transactionType in visibleTransactionTypes"
          :key="transactionType"
          v-tooltip="{ disposeOnClick: true }"
          class="text-container rounded-shadow icon-hoverable d-flex align-items-center p-2"
          :data-bs-title="`Voir les ${Texts.transactionTypes[transactionType].plural.toLowerCase()}`"
          role="button"
          tabindex="0"
          @click="showTransactions(transactionType)"
          @keydown.enter="showTransactions(transactionType)"
        >
          {{ Texts.transactionTypes[transactionType].plural }}
          <img alt="" class="icon-container-small ms-2" src="@/assets/icons/show.png">
        </div>
      </div>
    </div>
    <hr class="mb-4 mt-0">
  </div>
</template>

<style scope>
.text-container {
  height: 2.3rem;
}
</style>