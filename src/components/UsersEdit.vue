<script setup lang="ts">
import UserLine from './UserLine.vue'

import { ref } from 'vue'

import { useSticky } from '@/helpers'
import userManager from '@/userManager'

const username = ref<string>('')
const isSticky = useSticky()

function userCreate() : void {
  userManager.create(username.value)
  username.value = ''
}
</script>

<template>
  <div :class="['row char-width-30 sticky-top', { 'sticky-offset': isSticky }]">
    <div class="row">
      <h3>Habitants</h3>
      <hr>
      <ul class="item-list p-0">
        <li v-for="user in userManager.users" :key="user.id" class="item py-2">
          <UserLine :user="user" />
        </li>
      </ul>
      <div class="input-group">
        <input
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
    </div>
  </div>
</template>