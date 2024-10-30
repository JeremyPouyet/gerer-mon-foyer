<script setup lang="ts">
import Note from '@/components/Note.vue'
import NoteIcon from './NoteIcon.vue'

import Account, { AccountType } from '@/account'
import Texts from '@/texts'
import { TransactionType } from '@/types'
import { computed } from 'vue'

const props = defineProps<{ account: Account, name: string, withNote: boolean }>()

const transactionTypes: TransactionType[] = [
  TransactionType.Expense,
  TransactionType.Income,
  // Onle a personal account has personal expenses !
  ...(props.account.type === AccountType.Personal ? [TransactionType.PersonalExpense] : [])
]

const visibleTransactionTypes = computed(() => transactionTypes.filter(type => !props.account.settings.show[type]))
</script>

<template>
  <div class="d-flex justify-content-between">
    <div>
      <!-- Set an id to be used as an inner page anchor -->
      <h3 :id="name">
        {{ name }}
        <NoteIcon :text="props.account.note" :unpaded="true" />
        <Note v-if="props.withNote" :item="props.account" @update="note => account.note = note" />
      </h3>
    </div>
    <div class="d-flex gap-3">
      <div
        v-for="transactionType in visibleTransactionTypes"
        :key="transactionType"
        v-tooltip="{ disposeOnClick: true }"
        :data-bs-title="'Aggrandir'"
        class="text-container rounded-shadow icon-hoverable d-flex align-items-center p-2"
        @click="account.settings.show[transactionType] = true"
      >
        {{ Texts.transactionTypes[transactionType].plural }}
        <img src="@/assets/icons/show.png" class="icon-container-small ms-2" alt="Aggrandir">
      </div>
    </div>
  </div>
  <hr>
</template>

<style scope>
.text-container {
  height: 2.5rem;
}
</style>