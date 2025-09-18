<script setup lang="ts">
import '@/assets/secondary.scss'
import ViewTitle from '@/components/ViewTitle.vue'

import { inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
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

const selectedUser = ref<User | null>(null)
const showAvatarModal = ref(false)

const editingUserId = ref<ID | null>(null)
const editingName = ref('')
const editingInputs = ref<Record<ID, HTMLInputElement | null>>({})

/** Avatar Modal **/

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showAvatarModal.value)
    cancelSelectAvatar()
}

onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))

function openAvatarModal(user: User) {
  selectedUser.value = user
  document.addEventListener('keydown', handleKeydown)
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
  document.removeEventListener('keydown', handleKeydown)
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

    <!-- User cards grid -->
    <div class="row g-3">
      <div v-for="user in userManager.users" :key="user.id" class="col-12 col-md-6 col-lg-4">
        <div class="card rounded-shadow h-100">
          <div class="card-body text-center py-3">
            <!-- User image with edit button -->
            <div class="position-relative d-inline-block mb-3">
              <img :alt="`Avatar de ${user.name}`" class="user-avatar shadow-sm" :src="user_avatars[user.avatar]">
              <button class="btn btn-sm btn-light position-absolute bottom-0 end-0 p-1 border" @click="openAvatarModal(user)">
                <img alt="Changer son avatar" class="icon-container-small" src="@/assets/icons/pencil.png">
              </button>
            </div>

            <!-- User info -->
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
                <img
                  alt="Sauvegarder"
                  class="icon-container-small"
                  src="@/assets/icons/diskette.png"
                >
              </button>
            </div>
            <div v-else class="mb-3">
              <h5 class="card-title mb-0 d-inline-flex align-items-center gap-2">
                {{ user.name }}
                <button class="btn btn-sm btn-light p-1 border" @click="startEditingName(user)">
                  <img alt="Éditer" class="icon-container-small" src="@/assets/icons/pencil.png">
                </button>
              </h5>
            </div>

            <p class="card-text mb-1">
              <span class="fw-bold">Ratio de dépense commun :</span> {{ sexyNumber(user.ratio, 'percent') }}
            </p>
            <p class="card-text">
              <span class="fw-bold">Participation mensuelle aux dépenses communes :</span> {{ sexyAmount(user.ratio * commonBill) }}
            </p>

            <!-- Actions -->
            <div class="d-flex justify-content-center gap-2">
              <img
                v-tooltip="{ disposeOnClick: true }"
                alt="Supprimer"
                :aria-label="`Supprimer ${user.name} des habitants`"
                class="icon-container-small icon-hoverable"
                :data-bs-title="`Supprimer ${user.name} des habitants`"
                role="button"
                src="@/assets/icons/cross.png"
                tabindex="0"
                @click="userDelete(user)"
                @keydown.enter="userDelete(user)"
              >
              <RouterLink
                v-tooltip="{ disposeOnClick: true }"
                class="d-inline-flex align-items-center"
                :data-bs-title="`Voir le budget de ${user.name}`"
                :to="`/budget#${user.name}`"
              >
                <img
                  :alt="`Voir le budget de ${user.name}`"
                  class="icon-container-small icon-hoverable"
                  src="@/assets/icons/hyperlink.png"
                >
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add new user -->
    <div class="input-group mt-4">
      <input
        ref="inputRef"
        v-model="username"
        aria-label="Prénom de l'habitant"
        class="form-control"
        placeholder="Prénom de l'habitant"
        type="text"
        @keydown.enter="userCreate"
      >
      <button class="btn btn-secondary btn-sm" :disabled="!username" type="button" @click="userCreate">
        Ajouter
      </button>
    </div>

    <!-- Modal for selecting avatars -->
    <!-- @click.self works as the modal covers the entire screen -->
    <div v-if="showAvatarModal" class="modal fade d-block" @click.self="cancelSelectAvatar()">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Choisir mon avatar
            </h5>
            <button aria-label="Fermer" class="btn-close" type="button" @click="cancelSelectAvatar" />
          </div>
          <div class="modal-body d-flex flex-wrap gap-3 justify-content-center">
            <img
              v-for="avatar in user_avatar_list"
              :key="avatar"
              :alt="`Avatar ${avatar}`"
              class="selectable-icon"
              :src="user_avatars[avatar]"
              tabindex="0"
              @click="selectAvatar(avatar)"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.selectable-icon {
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: scale(1.1);
    border-color: #24739B;
  }
}

.name-update {
  flex: initial !important; // overides bootstrap
  width: 20rem !important;
}
</style>