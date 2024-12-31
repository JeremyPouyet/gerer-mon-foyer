<script setup lang="ts">
import UserLine from '@/components/UserLine.vue'

import { onMounted, ref } from 'vue'
import isMobile from 'is-mobile'

import userManager from '@/managers/userManager'

const username = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

function userCreate() : void {
  userManager.create(username.value)
  username.value = ''
  inputRef.value?.focus()
}

onMounted(() => {
  if (!isMobile() && userManager.users.length === 0 && inputRef.value)
    inputRef.value.focus()
})
</script>

<template>
  <ul class="item-list p-0">
    <li v-for="user in userManager.users" :key="user.id" aria-live="polite" class="item py-2">
      <UserLine :user="user" />
    </li>
  </ul>
  <div class="input-group">
    <input
      ref="inputRef"
      v-model="username"
      aria-label="Prénom du nouvel habitant"
      class="form-control"
      placeholder="Prénom"
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
</template>