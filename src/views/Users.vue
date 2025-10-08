<script setup lang="ts">
import '@/assets/secondary.scss'

import AvatarSelectorModal from '@/components/AvatarSelectorModal.vue'
import ViewTitle from '@/components/ViewTitle.vue'

import { inject, nextTick, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { type ID, type OpenModal, Path } from '@/types'
import { sexyAmount, sexyNumber } from '@/formaters'
import { user_avatar_list, user_avatars } from '@/avatars/users'
import type User from '@/user'
import db from '@/db'
import userManager from '@/managers/userManager'
import { vClickOutside } from '@/directives/clickOutside'

const commonAccount = db.account
const commonBill = Math.max(commonAccount.expenses.sum - commonAccount.incomes.sum, 0)

const username = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

const openModal = inject<OpenModal>('openModal')

const editingUserId = ref<ID | null>(null)
const editingName = ref('')
const editingInputs = ref<Record<ID, HTMLInputElement | null>>({})

/** Avatar Modal **/
const selectedUser = ref<User | null>(null)
const showAvatarModal = ref(false)

function openAvatarModal(user: User) {
  selectedUser.value = user
  showAvatarModal.value = true
}

function selectAvatar(avatar: string) {
  if (selectedUser.value)
    userManager.update(selectedUser.value.id, { avatar })
  cancelSelectAvatar()
}

function cancelSelectAvatar() {
  selectedUser.value = null
  showAvatarModal.value = false
}

/** User Management **/

function userCreate(): void {
  userManager.create(username.value)
  username.value = ''
  inputRef.value?.focus()
}

function userDelete(user: User): void {
  openModal?.(
    'Êtes-vous sûr de vouloir supprimer cet habitant ? Cette action est irréversible.',
    () => userManager.delete(user)
  )
}

function startEditingName(user: User) {
  editingUserId.value = user.id
  editingName.value = user.name

  nextTick(() => editingInputs.value[user.id]?.focus())
}

function saveEditedName() {
  const standardized = editingName.value.trim().slice(0, 30)

  if (standardized && editingUserId.value)
    userManager.update(editingUserId.value, { name: standardized })

  cancelEditName()
}

const cancelEditName = () => editingUserId.value = null

onMounted(() => {
  if (userManager.users.length === 0 && inputRef.value)
    inputRef.value.focus()
})
</script>

<template>
  <div class="container">
    <ViewTitle emoji="👋" :path="Path.Users" unpaded />

    <!-- Add new user -->
    <label class="form-label" for="new-user">
      Prénom de l’habitant:
    </label>
    <div class="input-group mb-4">
      <input
        id="new-user"
        ref="inputRef"
        v-model="username"
        class="form-control"
        placeholder="Aragorn / Arwen"
        type="text"
        @keydown.enter="userCreate"
      >
      <button class="btn btn-secondary btn-sm" :disabled="!username" type="button" @click="userCreate">
        Ajouter
      </button>
    </div>

    <!-- Message to help people when there is no user -->
    <div v-if="userManager.users.length == 0">
      <p>Commencez par ajouter les habitants de votre foyer pour débloquer les autres fonctionnalités</p>
    </div>

    <!-- User cards grid -->
    <div v-else class="cards-container">
      <div v-for="user in userManager.users" :key="user.id" class="d-flex card rounded-shadow custom-card">
        <div class="card-body d-flex flex-column text-center p-2">
          <!-- User image with edit button -->
          <div class="position-relative d-inline-block mb-3">
            <img :alt="`Avatar de ${user.name}`" class="user-avatar shadow-sm" :src="user_avatars[user.avatar]">
            <button v-tooltip="{ disposeOnClick: true }" class="btn btn-sm btn-light position-absolute bottom-0 p-1 border" data-bs-title="Changer l’avatar" @click="openAvatarModal(user)">
              <img alt="Changer son avatar" class="icon-container-small" src="@/assets/icons/pencil.png">
            </button>
          </div>

          <!-- User name -->
          <div v-if="editingUserId === user.id" v-click-outside="cancelEditName" class="input-group input-group-sm justify-content-center mb-3">
            <input
              :ref="el => editingInputs[user.id] = el as HTMLInputElement"
              v-model="editingName"
              class="form-control text-center name-update"
              type="text"
              @keydown.enter="saveEditedName"
              @keydown.esc="cancelEditName"
            >
            <button class="btn btn-sm btn-light border" type="button" @click="saveEditedName">
              <img alt="Sauvegarder" class="icon-container-small" src="@/assets/icons/diskette.png">
            </button>
          </div>
          <div v-else class="mb-3">
            <p class="h5 card-title mb-0 d-inline-flex align-items-center gap-2">
              {{ user.name }}
              <button v-tooltip="{ disposeOnClick: true }" class="btn btn-sm btn-light p-1 border" data-bs-title="Éditer le nom" @click="startEditingName(user)">
                <img alt="Éditer" class="icon-container-small" src="@/assets/icons/pencil.png">
              </button>
            </p>
          </div>

          <!-- User data -->
          <p class="card-text mb-1 text-start">
            <span class="user-label fw-bold">Revenus :</span>{{ sexyAmount(user.account.incomes.sum) }}
          </p>
          <p class="card-text mb-1 text-start">
            <span class="user-label fw-bold">Dépenses contraintes :</span>{{ sexyAmount(user.account.expenses.sum) }}
          </p>
          <p class="card-text mb-1 text-start">
            <span class="user-label fw-bold">
              <img
                v-tooltip
                alt="Info"
                class="icon-container-small"
                data-bs-title="Calculé à partir de ton budget, ce pourcentage représente ta participation à une dépense commune."
                src="@/assets/icons/information.png"
              >
              Ratio :
            </span>
            {{ sexyNumber(user.ratio, 'percent') }}
          </p>
          <p class="card-text text-start">
            <span class="user-label fw-bold">
              <img
                v-tooltip
                alt="Info"
                class="icon-container-small"
                data-bs-title="Calculé à partir de ton ratio et de vos dépenses communes, c’est le montant que tu dois donner chaque mois pour vos charges communes."
                src="@/assets/icons/information.png"
              >
              Dépenses communes :
            </span>
            {{ sexyAmount(user.ratio * commonBill) }}
          </p>

          <!-- Actions -->
          <div class="d-flex justify-content-center gap-2">
            <button class="btn btn-danger btn-sm" @click="userDelete(user)">
              Supprimer l’utilisateur
            </button>
            <RouterLink class="btn btn-primary btn-sm" :to="`/budget#${user.account.id}`">
              Voir le budget
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Message to help people when their budget is not setup -->
    <div v-if="userManager.users.length > 0 && commonBill == 0" class="text-center mt-4">
      <p>
        Vous pouvez maintenant commencer à <RouterLink to="/budget">
          établir votre budget
        </RouterLink>
      </p>
    </div>
  </div>

  <AvatarSelectorModal
    :avatar-list="user_avatar_list"
    :avatars="user_avatars"
    :show="showAvatarModal"
    @close="cancelSelectAvatar"
    @select="selectAvatar"
  />
</template>