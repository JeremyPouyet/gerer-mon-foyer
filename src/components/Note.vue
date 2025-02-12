<script setup lang="ts">
import { nextTick, ref } from 'vue'

import type { Expense, Project } from '@/project'
import type Account from '@/account'
import type { Sample } from '@/managers/historyManager'
import type { Transaction } from '@/types'

const emit = defineEmits<
  (e: 'update', note: string | undefined) => void
>()
const props = defineProps<{ item: Account | Project | Transaction | Sample | Expense }>()

const currentNote = ref<string | undefined>(props.item.note)
const showNotePopup = ref<boolean>(false)
const popupPosition = ref<'above' | 'below'>('above')
const notePopupRef = ref<HTMLElement | null>(null) // Reference to the note-popup element
const noteTextareaRef = ref<HTMLTextAreaElement | null>(null)

async function toggleNotePopup(event: MouseEvent | KeyboardEvent): Promise<void> {
  showNotePopup.value = !showNotePopup.value

  // await for the page to be refreshed.
  // otherwise, as the note-popup element is not on the page, the ref to notePopupRef won't be setup.
  await nextTick()

  const popupElement = notePopupRef.value
  const selectedElement = event.target as HTMLElement

  if (!popupElement || !selectedElement || !showNotePopup.value) return

  const windowWidth = window.innerWidth
  const popupRect = popupElement.getBoundingClientRect()
  const elementRect = selectedElement.getBoundingClientRect()

  popupPosition.value = elementRect.top - popupElement.offsetHeight < 0 ? 'below' : 'above'
  popupPosition.value += ' '
  popupPosition.value += popupRect.left < 0 || popupRect.right > windowWidth ? 'left' : 'right'

  noteTextareaRef.value?.focus()
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

/**
 * When the user presses tab on the last action button, it comes back to the textarea
 * @param event the key press event
 */
function circularTab(event: KeyboardEvent) {
  event.preventDefault()
  noteTextareaRef.value?.focus()
}
</script>

<template>
  <div
    v-if="showNotePopup"
    ref="notePopupRef"
    aria-label="Édition de la note"
    aria-modal="true"
    class="note-popup rounded-shadow bg-white"
    :class="popupPosition"
    role="dialog"
  >
    <div class="form-floating">
      <textarea
        ref="noteTextareaRef"
        v-model="currentNote"
        aria-label="Édition de la note"
        cols="30"
        placeholder="Entrez une note"
        rows="4"
        @keydown.ctrl.enter="noteUpdate"
        @keydown.esc="noteCancel"
      />
      <div class="input-group">
        <button class="btn btn-secondary btn-sm" type="button" @click="noteUpdate">
          Sauvegarder
        </button>
        <button class="text-black btn btn-danger btn-sm" type="button" @click="noteDelete">
          Supprimer
        </button>
        <button
          class="text-white btn btn-dark btn-sm"
          type="button"
          @click="noteCancel"
          @keydown.tab="circularTab"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
  <img
    v-tooltip="{ disposeOnClick: true }"
    alt="Annoter"
    class="icon-container-small icon-hoverable"
    data-bs-title="Annoter"
    role="button"
    src="@/assets/icons/take-note.png"
    tabindex="0"
    @click="toggleNotePopup"
    @keypress.enter="toggleNotePopup"
  >
</template>

<style scoped>
.note-popup {
  position: relative;
  z-index: 10;
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
  border-radius: 4px;
}
</style>