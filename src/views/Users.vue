<script setup lang="ts">
import '@/assets/secondary.scss'
import ViewTitle from '@/components/ViewTitle.vue'

import { type OpenModal, Path } from '@/types'
import { inject, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import isMobile from 'is-mobile'

import { sexyAmount, sexyNumber } from '@/formaters'
import { user_icon_list, user_icons } from '@/icons/users'
import type User from '@/user'
import db from '@/db'
import userManager from '@/managers/userManager'

const commonAccount = db.account
const commonBill = Math.max(commonAccount.expenses.sum - commonAccount.incomes.sum, 0)

const username = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

const openModal = inject<OpenModal>('openModal')

const selectedUser = ref<User | null>(null)
const showIconModal = ref(false)

const editingUserId = ref<string | null>(null)
const editingName = ref('')

function startEditing(user: User) {
  editingUserId.value = user.id
  editingName.value = user.name
}

function saveEditing(user: User) {
  const trimmed = editingName.value.trim()
  if (trimmed) {
    user.updateName(trimmed)
    userManager.update(user)
  }
  editingUserId.value = null
}

function openIconModal(user: User) {
  selectedUser.value = user
  showIconModal.value = true
}

function selectIcon(icon: string) {
  if (selectedUser.value) {
    selectedUser.value.picture = icon
    userManager.update(selectedUser.value)
  }
  showIconModal.value = false
}

function userCreate(): void {
  userManager.create(username.value)
  username.value = ''
  inputRef.value?.focus()
}

function userDelete(user: User): void {
  openModal?.(
    'Êtes-vous sûr de vouloir supprimer cet habitant ? Cette action est irréversible.',
    () => {
      userManager.delete(user)
    }
  )
}

onMounted(() => {
  if (!isMobile() && userManager.users.length === 0 && inputRef.value)
    inputRef.value.focus()
})
</script>

<template>
  <div class="container">
    <ViewTitle emoji="👋" :path="Path.Users" unpaded />

    <!-- User cards grid -->
    <div class="row g-3">
      <div
        v-for="user in userManager.users"
        :key="user.id"
        class="col-12 col-md-6 col-lg-4"
      >
        <div class="card rounded-shadow h-100">
          <div class="card-body text-center py-3">
            <!-- User image with edit button -->
            <div class="position-relative d-inline-block mb-3">
              <img
                :alt="`Avatar de ${user.name}`"
                class="user-avatar shadow-sm"
                :src="user_icons[user.picture]"
              >
              <button
                class="btn btn-sm btn-light position-absolute bottom-0 end-0 p-1 border"
                @click="openIconModal(user)"
              >
                <img alt="Changer son avatar" class="icon-container-small" src="@/assets/icons/pencil.png">
              </button>
            </div>

            <!-- User info -->
            <div class="mb-2">
              <template v-if="editingUserId === user.id">
                <div class="input-group input-group-sm justify-content-center">
                  <input
                    v-model="editingName"
                    class="form-control text-center"
                    style="max-width: 150px"
                    type="text"
                    @blur="saveEditing(user)"
                    @keydown.enter="saveEditing(user)"
                  >
                </div>
              </template>
              <template v-else>
                <h5 class="card-title mb-0 d-inline-flex align-items-center gap-2">
                  {{ user.name }}
                  <button
                    class="btn btn-sm btn-light p-1 border"
                    @click="startEditing(user)"
                  >
                    <img
                      alt="Éditer"
                      class="icon-container-small"
                      src="@/assets/icons/pencil.png"
                    >
                  </button>
                </h5>
              </template>
            </div>

            <p class="card-text mb-1">
              <strong>Ratio de dépense commun :</strong> {{ sexyNumber(user.ratio, 'percent') }}
            </p>
            <p class="card-text">
              <strong>Participation mensuelle aux dépenses communes :</strong> {{ sexyAmount(user.ratio * commonBill) }}
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
              <RouterLink :to="`/budget#${user.name}`" style="display:inline-flex;align-items:center">
                <img
                  v-tooltip="{ disposeOnClick: true }"
                  alt="Voir le budget"
                  :aria-label="`Voir le budget de ${user.name}`"
                  class="icon-container-small icon-hoverable"
                  :data-bs-title="`Voir le budget de ${user.name}`"
                  src="@/assets/icons/hyperlink.png"
                  tabindex="0"
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
      <button
        class="btn btn-secondary btn-sm"
        :disabled="!username"
        type="button"
        @click="userCreate"
      >
        Ajouter
      </button>
    </div>

    <!-- Modal for selecting icons -->
    <div
      v-if="showIconModal"
      class="modal fade"
      :class="{ show: showIconModal }"
      style="display: block;"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Choisir mon avatar
            </h5>
            <button class="btn-close" type="button" @click="showIconModal = false" />
          </div>
          <div class="modal-body d-flex flex-wrap gap-3 justify-content-center">
            <img
              v-for="icon in user_icon_list"
              :key="icon"
              :alt="`Icône ${icon}`"
              class="selectable-icon"
              :src="user_icons[icon]"
              @click="selectIcon(icon)"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
</style>