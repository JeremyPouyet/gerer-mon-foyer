<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { Transaction } from '@/types'
import type { Sample } from '@/historyManager'
import type Account from '@/account'

const emit = defineEmits<
  (e: 'update', note: string | undefined) => void
>()

const props = defineProps<{ item: Account | Transaction | Sample }>()
const currentNote = ref<string | undefined>(props.item.note)
const showNotePopup = ref<boolean>(false)
const popupPosition = ref<'above' | 'below'>('above')
const notePopupRef = ref<HTMLElement | null>(null) // Reference to the note-popup element

async function toggleNotePopup(event: MouseEvent): Promise<void> {
  showNotePopup.value = !showNotePopup.value

  // await for the page to be refreshed.
  // otherwise, as the note-popup element is not on the page, the ref to notePopupRef won't be setup.
  await nextTick()

  const popupElement = notePopupRef.value

  if (!popupElement || !showNotePopup.value) return

  const windowWidth = window.innerWidth
  const popupRect = popupElement.getBoundingClientRect()

  popupPosition.value = event.clientY - popupElement.offsetHeight < 0 ? 'below' : 'above'
  popupPosition.value += ' '
  popupPosition.value += popupRect.left < 0 || popupRect.right > windowWidth ? 'left' : 'right'
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
  <div v-if="showNotePopup" ref="notePopupRef" class="note-popup rounded-shadow" :class="popupPosition">
    <div class="form-floating">
      <textarea
        v-model="currentNote"
        rows="4"
        cols="30"
        placeholder="Entrez une note"
        @keydown.esc="noteCancel"
        @keydown.ctrl.enter="noteUpdate"
      />
      <div class="input-group">
        <button type="button" class="btn btn-secondary btn-sm" @click="noteUpdate">
          Valider
        </button>
        <button type="button" class="text-white btn btn-danger btn-sm" @click="noteDelete">
          Supprimer
        </button>
        <button type="button" class="text-white btn btn-danger btn-sm" style="background-color: var(--color-dark-purple);" @click="noteCancel">
          Annuler
        </button>
      </div>
    </div>
  </div>
  <img
    v-tooltip="{ disposeOnClick: true }"
    src="@/assets/icons/take-note.png"
    alt="Annoter"
    data-bs-title="Annoter"
    class="icon-container-small icon-hoverable"
    @click="toggleNotePopup"
  >
</template>

<style scoped>
.note-popup {
  position: relative;
  z-index: 10;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
}

.note-popup.above {
  bottom: calc(100% + 15px);
  right: 0;
}

.note-popup.below {
  top: calc(100% + 15px);
  right: 0;
}

.note-popup.left {
  right: auto;
  left: 0;
}
.note-popup.right {
  right: 0;
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