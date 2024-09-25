<script setup lang="ts">
import { nextTick, ref } from 'vue'
import User from '@/user'

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
</script>

<template>
  <span
    v-if="isEditing === false"
    v-tooltip
    class="editable-text"
    data-bs-placement="right"
    data-bs-title="Cliquer pour éditer"
    @click="startEditName"
  >
    {{ user.name }}
  </span>
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
</template>
