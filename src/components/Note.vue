<script setup lang="ts">
  import { nextTick, ref } from 'vue'
  import type { Transaction } from '@/types';
  import type { Sample } from '@/historyManager'
  import User from '@/user'

  const emit = defineEmits<
    (e: 'update', note: string | undefined) => void
  >()

  const props = defineProps<{ item: User | Transaction | Sample }>()
  const currentNote = ref<string | undefined>(props.item.note)
  const showNotePopup = ref<boolean>(false)
  const popupPosition = ref<'above' | 'below'>('above')
  const notePopupRef = ref<HTMLElement | null>(null) // Reference to the note-popup element

  // Function to toggle the visibility of the note popup and adjust its position
  async function toggleNotePopup(event: MouseEvent): Promise<void> {
    showNotePopup.value = !showNotePopup.value

    // await for the page to be refreshed.
    // otherwise, as the note-popup element is not on the page, the ref to notePopupRef won't be setup.
    await nextTick()

    const popupElement = notePopupRef.value

    if (popupElement && showNotePopup.value)
      popupPosition.value = event.clientY - popupElement.offsetHeight < 0 ? 'below' : 'above'
  }

  function noteUpdate() : void {
    showNotePopup.value = false
    emit('update', currentNote.value)
  }

  function noteDelete() : void {
    showNotePopup.value = false
    currentNote.value = ''
    emit('update', '')
  }

  function noteCancel() : void {
    currentNote.value = props.item.note
    showNotePopup.value = false
  }
</script>

<template>
  <div style="display:inline;position:relative;">
    <div v-if="showNotePopup" ref="notePopupRef" class="note-popup" :class="popupPosition">
      <div class="form-floating">
        <textarea
          v-model="currentNote"
          rows="4"
          cols="30"
          placeholder="Entrez une note"
          @keydown.esc="noteCancel"
        />
        <div class="input-group">
          <button type="button" class="btn btn-primary btn-sm default-button" @click="noteUpdate">
            Valider
          </button>
          <button type="button" class="btn btn-danger btn-sm" style="background-color: var(--color-red);" @click="noteDelete">
            Supprimer
          </button>
          <button type="button" class="btn btn-danger btn-sm" style="background-color: var(--color-dark-purple);" @click="noteCancel">
            Annuler
          </button>
        </div>
      </div>
    </div>
    <img src="@/assets/icons/take-note.png" alt="Annoter" title="Ajouter une note" class="icon-container-small icon-hoverable" @click="toggleNotePopup">
  </div>
</template>

<style scoped>
.note-popup {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  z-index: 100;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
}

.note-popup.above {
  bottom: calc(100% + 15px);
  right: 0;
}
.note-popup.above::before {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 0;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid white;
}

.note-popup.below {
  top: calc(100% + 15px);
  right: 0;
}
.note-popup.below::before {
  content: '';
  position: absolute;
  top: -10px;
  right: 0;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid white;
}

.note-popup textarea {
  box-sizing: border-box;
  resize: both;
  overflow: auto;
  margin-bottom: 5px;
  min-height: 8em;
  min-width: 20em;
  flex: 1; /* allows the textarea to grow and shrink */
  font-size: 1rem;
}
</style>