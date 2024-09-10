<script setup lang="ts">
  import UserNameEdit from '@/components/UserNameEdit.vue'

  import { ref } from 'vue'
  import db from '@/db'
  import User from '@/user'

  const username = ref<string>('')

  function userCreate() : void {
    db.userCreate(username.value)
    username.value = ''
  }

  function userDelete(user: User) : void {
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ? Cette action est irréversible.`)

    if (confirmation) db.userDelete(user)
  }
</script>

<template>
  <div class="row char-width-30">
    <div class="row">
      <h3>Habitants</h3>
      <hr>
    </div>
    <ul class="item-list">
      <li v-for="user in db.users" :key="user.id" class="item">
        <div class="item-info">
          <UserNameEdit :user="user" />
          <img
            src="@/assets/icons/cross.png"
            alt="Supprimer"
            :title="`Supprimer ${user.name}`"
            class="icon-container-small icon-hoverable align-right"
            @click="() => userDelete(user)"
          >
        </div>
      </li>
    </ul>
    <div class="input-group">
      <input
        v-model="username"
        type="text"
        placeholder="Prénom"
        class="form-control"
        @keypress.enter="userCreate"
      >
      <button
        type="button"
        class="btn btn-primary btn-sm default-button"
        style="background-color: var(--color-xanthous);"
        :disabled="!username"
        @click="userCreate"
      >
        Ajouter
      </button>
    </div>
  </div>
</template>