<script setup lang="ts">
import { type PropType, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  avatarList: { required: true, type: Array as PropType<string[]> },
  avatars: { required: true, type: Object as PropType<Record<string, string>> },
  show: { required: true, type: Boolean },
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'select', avatar: string): void
}>()

const visible = ref(props.show)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value)
    emit('close')
}

watch(() => props.show, (val) => {
  visible.value = val
  if (val)
    document.addEventListener('keydown', handleKeydown)
  else
    document.removeEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))

function selectAvatar(avatar: string) {
  emit('select', avatar)
}
</script>

<template>
  <!-- @click.self works as the modal covers the entire screen -->
  <div v-if="visible" class="modal fade d-block" @click.self="emit('close')">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Choisir un avatar
          </h5>
          <button aria-label="Fermer" class="btn-close" type="button" @click="emit('close')" />
        </div>
        <div class="modal-body d-flex flex-wrap gap-3 justify-content-center">
          <img
            v-for="avatar in avatarList"
            :key="avatar"
            :alt="`Avatar ${avatar}`"
            class="selectable-icon"
            loading="lazy"
            :src="avatars[avatar]"
            tabindex="0"
            @click="selectAvatar(avatar)"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.selectable-icon {
  width: 70px;
  height: 70px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
}
</style>
