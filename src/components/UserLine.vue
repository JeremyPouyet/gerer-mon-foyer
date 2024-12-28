<script setup lang="ts">
import { nextTick, ref } from 'vue'

import User from '@/user'
import userManager from '@/managers/userManager'

const props = defineProps<{ user: User }>()

const isEditing = ref(false)
const newName = ref(props.user.name)
const input = ref<HTMLInputElement>()

function startEditName() : void {
  newName.value = props.user.name
  isEditing.value = true
  document.addEventListener('mousedown', handleClickOutside)
  nextTick(() => input.value?.focus())
}

function executeEditName() : void {
  props.user.updateName(newName.value)
  cancelEdit()
}

function cancelEdit() : void {
  isEditing.value = false
  newName.value = ''
  document.removeEventListener('mousedown', handleClickOutside)
}

function handleClickOutside(event: MouseEvent) : void {
  if (!input.value?.contains(event.target as Node)) executeEditName()
}

function userDelete(user: User) : void {
  const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ? Cette action est irréversible.`)

  if (confirmation) userManager.delete(user)
}
</script>

<template>
  <div class="d-flex justify-content-between container-fluid align-items-center">
    <!-- Inner page anchor to the user's corresponding section -->
    <a
      v-if="isEditing === false"
      v-tooltip
      data-bs-title="Cliquer pour voir"
      :href="`#${user.name}`"
    >
      {{ user.name }}
    </a>
    <span v-else>
      <input
        ref="input"
        v-model="newName"
        type="text"
        @keydown.enter="executeEditName"
        @keydown.tab="executeEditName"
        @keydown.esc="cancelEdit"
      >
    </span>
    <div class="text-nowrap">
      <img
        v-if="isEditing === false"
        v-tooltip="{ disposeOnClick: true }"
        :alt="`Éditer le prénom ${user.name}`"
        data-bs-title="Éditer le prénom"
        src="@/assets/icons/pencil.png"
        class="icon-container-small icon-hoverable me-2"
        @click="startEditName"
      >
      <img
        v-tooltip="{ disposeOnClick: true }"
        src="@/assets/icons/cross.png"
        :alt="`Supprimer ${user.name} des habitants`"
        data-bs-title="Supprimer des habitants"
        class="icon-container-small icon-hoverable"
        @click="userDelete(user)"
      >
    </div>
  </div>
</template>

<style scoped>
a {
  color: black;
}
</style>