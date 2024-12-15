<script setup lang="ts">
import UserLine from '@/components/UserLine.vue'

import isMobile from 'is-mobile'
import { onMounted, ref } from 'vue'

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
    <li v-for="user in userManager.users" :key="user.id" class="item py-2">
      <UserLine :user="user" />
    </li>
  </ul>
  <div class="input-group">
    <input
      ref="inputRef"
      v-model="username"
      type="text"
      placeholder="Prénom"
      class="form-control"
      @keydown.enter="userCreate"
    >
    <button
      type="button"
      class="btn btn-secondary btn-sm"
      :disabled="!username"
      @click="userCreate"
    >
      Ajouter
    </button>
  </div>
</template>