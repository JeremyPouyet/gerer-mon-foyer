<script setup lang="ts">
import '@/assets/secondary.scss'

import ViewTitle from '@/components/ViewTitle.vue'

import { type OpenModal, Path } from '@/types'

import { inject, onMounted, ref } from 'vue'
import isMobile from 'is-mobile'

import { sexyAmount, sexyNumber } from '@/formaters'
import type User from '@/user'
import db from '@/db'
import userManager from '@/managers/userManager'
import { RouterLink } from 'vue-router'

const commonAccount = db.account
const commonBill = Math.max(commonAccount.expenses.sum - commonAccount.incomes.sum, 0)

const username = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

const openModal = inject<OpenModal>('openModal')

function userCreate() : void {
  userManager.create(username.value)
  username.value = ''
  inputRef.value?.focus()
}

function userDelete(user: User) : void {
  openModal?.('Êtes-vous sûr de vouloir supprimer cet habitant ? Cette action est irréversible.', () => {
    userManager.delete(user)
  })
}

onMounted(() => {
  if (!isMobile() && userManager.users.length === 0 && inputRef.value)
    inputRef.value.focus()
})
</script>

<template>
  <div class="container">
    <ViewTitle emoji="👋" :path="Path.Users" unpaded />

    <div class="table-responsive shadowed-border mb-3">
      <table class="table table-hover mb-0">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Ratio de dépense</th>
            <th>Participation mensuelle aux dépenses communes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userManager.users" :key="user.id">
            <td>
              {{ user.name }}
            </td>
            <td>
              {{ sexyNumber(user.ratio, 'percent') }}
            </td>
            <td>
              {{ sexyAmount(user.ratio * commonBill) }}
            </td>
            <td>
              <img
                v-tooltip="{ disposeOnClick: true }"
                alt="Éditer"
                aria-label="Éditer la ligne"
                class="icon-container-small icon-hoverable"
                data-bs-title="Éditer"
                role="button"
                src="@/assets/icons/pencil.png"
                tabindex="0"
              >
              <img
                v-tooltip="{ disposeOnClick: true }"
                alt="Supprimer"
                :aria-label="`Supprimer ${user.name} des habitants`"
                class="icon-container-small icon-hoverable ms-2"
                :data-bs-title="`Supprimer ${user.name} des habitants`"
                role="button"
                src="@/assets/icons/cross.png"
                tabindex="0"
                @click="userDelete(user)"
                @keydown.enter="userDelete(user)"
              >
              <RouterLink :to="`/budget#${user.name}`">
                <img
                  v-tooltip="{ disposeOnClick: true }"
                  alt="Voir le budget"
                  :aria-label="`Voir le budget de ${user.name}`"
                  class="icon-container-small icon-hoverable ms-2"
                  :data-bs-title="`Voir le budget de ${user.name}`"
                  src="@/assets/icons/hyperlink.png"
                  tabindex="0"
                >
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="input-group">
      <input
        ref="inputRef"
        v-model="username"
        aria-label="Prénom de l'habitant"
        class="form-control"
        placeholder="Prénom de l'habitant"
        type="text"
        @keydown.enter="userCreate"
      >
      <button
        class="btn btn-secondary btn-sm"
        :disabled="!username"
        type="button"
        @click="userCreate"
      >
        Ajouter
      </button>
    </div>
  </div>
</template>