<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'

import Account, { AccountType } from '@/account'
import { type ID, TransactionType } from '@/types'
import { TextTransactionTypes } from '@/locales/transactionTypes'
import { user_avatars } from '@/avatars/users'
import { vClickOutside } from '@/directives/clickOutside'

const props = defineProps<{ account: Account, name: string, avatar?: string, withNote: boolean }>()

const transactionTypes: TransactionType[] = [
  TransactionType.Expense,
  TransactionType.Income,
  // Only personal accounts have personal expenses !
  ...(props.account.type === AccountType.Personal ? [TransactionType.PersonalExpense] : [])
]

const visibleTransactionTypes = computed(() => transactionTypes.filter(type => !props.account.settings.show[type]))

function showTransactions(transactionType: TransactionType) {
  props.account.settings.show[transactionType] = true
}

const editingAccount = ref<Account|null>()
const editingNote = ref<string>()
const editingTextareas = ref<Record<ID, HTMLTextAreaElement>>({})
function startEditingAccountNote(account: Account) {
  editingAccount.value = account
  editingNote.value = account.note

  nextTick(() => editingTextareas.value[account.id]?.focus())
}

const cancelEditAccountNote = () => editingAccount.value = null

function saveEditedAccountNote() {
  if (editingAccount.value)
    editingAccount.value.note = editingNote.value
  cancelEditAccountNote()
}
</script>

<template>
  <div class="container">
    <div class="d-flex justify-content-between mb-2">
      <!-- Set an id to be used as an inner page anchor -->
      <div class="d-flex align-items-start" style="min-width: 50%">
        <img v-if="avatar" aria-hidden="true" class="user-avatar shadow-sm me-2" :src="user_avatars[avatar]">
        <img v-else aria-hidden="true" class="user-avatar shadow-sm me-2" src="@/assets/icons/home-large.png">
        <div>
          <h2 :id="account.id" class="fs-3">
            {{ name }}
          </h2>
          <div v-if="editingAccount?.id == account.id" v-click-outside="cancelEditAccountNote">
            <textarea
              :ref="el => editingTextareas[account.id] = el as HTMLTextAreaElement"
              v-model="editingNote"
              placeholder="Ajouter une note"
              style="width:100%"
              @keydown.ctrl.enter="saveEditedAccountNote"
              @keydown.esc="cancelEditAccountNote"
            />
            <button class="btn btn-sm btn-light border" type="button" @click="saveEditedAccountNote">
              <img alt="Sauvegarder" class="icon-container-small" src="@/assets/icons/diskette.png">
            </button>
          </div>
          <div v-else>
            <span v-if="account.note" contenteditable="true" style="white-space:pre-line;">
              {{ account.note }}
            </span>
            <span v-else-if="props.withNote" class="fw-light fst-italic">
              Aucune note pour le moment
            </span>
            <span v-else class="fw-light fst-italic">
              Aucune note
            </span>
            <button v-if="props.withNote" class="btn btn-sm btn-light p-1 border included ms-2" @click="startEditingAccountNote(account)">
              <img alt="Éditer une note" class="icon-container-small" src="@/assets/icons/pencil.png">
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column flex-xl-row gap-3">
        <div
          v-for="transactionType in visibleTransactionTypes"
          :key="transactionType"
          v-tooltip="{ disposeOnClick: true }"
          class="rounded-shadow icon-hoverable d-flex align-items-center p-2"
          :data-bs-title="`Voir les ${TextTransactionTypes[transactionType].plural.toLowerCase()}`"
          role="button"
          style="height: 3rem;align-self: flex-end;"
          tabindex="0"
          @click="showTransactions(transactionType)"
          @keydown.enter="showTransactions(transactionType)"
        >
          {{ TextTransactionTypes[transactionType].plural }}
          <img alt="" class="icon-container-small ms-2" src="@/assets/icons/show.png">
        </div>
      </div>
    </div>
    <hr class="mb-4 mt-0">
  </div>
</template>