<script setup lang="ts">
import UserLine from './UserLine.vue'

import { onMounted, onUnmounted, ref } from 'vue'
import userManager from '@/userManager'

const username = ref<string>('')

function userCreate() : void {
  userManager.create(username.value)
  username.value = ''
}

const isSticky = ref(false)
const stickyTopOffset = ref<number>(0)

function handleScroll() {
  // When the user scrolls past the initial position of the sticky element,
  // isSticky becomes true
  isSticky.value = window.scrollY >= stickyTopOffset.value
}

onMounted(() => {
  const stickyElement = document.querySelector('.sticky-top')
  if (stickyElement) {
    // Save the initial position of the sticky element
    stickyTopOffset.value = stickyElement.getBoundingClientRect().top + window.scrollY

    // Listen to the scroll event
    window.addEventListener('scroll', handleScroll)
  }

  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
})
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