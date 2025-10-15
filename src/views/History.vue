<script setup lang="ts">
import '@/assets/secondary.scss'

import BudgetShow from '@/components/BudgetShow.vue'
import HistoryTransactionsShow from '@/components/HistoryTransactionsShow.vue'
import ViewTitle from '@/components/ViewTitle.vue'

import { inject, nextTick, onUnmounted, provide, ref, watch } from 'vue'

import { type OpenModal, Path } from '@/types'
import historyManager, { type Sample } from '@/managers/historyManager'
import DBSnapshot from '@/dbSnapshot'
import { sexyDate } from '@/formaters'

provide('editBudget', false)

const currentSample = ref<Sample | undefined>()
const snapshot = ref<DBSnapshot>(new DBSnapshot({}))
const watchers: ((() => void) | null)[] = []
const selectedDate = ref(historyManager.activeDate)
const openModal = inject<OpenModal>('openModal')

/*** Current sample ***/

function switchSample() {
  currentSample.value = historyManager.activeSample
  selectedDate.value = currentSample.value?.date

  if (!currentSample.value)
    return

  stopWatchers()

  snapshot.value = new DBSnapshot(JSON.parse(currentSample.value.data))

  watchers[0] = watch(snapshot.value.users, () => updateSampleData({ users: snapshot.value.users }), { deep: true })
  watchers[1] = watch(snapshot.value.account, () => updateSampleData({ account: snapshot.value.account }), {deep: true})
}

function dateSelected() {
  if (!selectedDate.value)
    return

  historyManager.activeDate = selectedDate.value
  switchSample()
}

function updateSampleData(updates: Partial<DBSnapshot>) {
  if (!currentSample.value)
    return
  const data = { ...JSON.parse(currentSample.value.data), ...updates } as DBSnapshot
  historyManager.update(currentSample.value.date, { data: JSON.stringify(data) })
}

function removeSample() : void {
  openModal?.('Êtes-vous sûr de vouloir supprimer cette date ? Cette action est irréversible.', () => {
    if (currentSample.value) {
      historyManager.delete(currentSample.value.date)

      switchSample()
    }
  })
}

const stopWatchers = () => watchers.forEach(stop => stop?.())

/*** Note ***/
const editingNote = ref<string|null>()
const isEditingNote = ref(false)
const noteInput = ref<HTMLTextAreaElement>()

function startEditingNote() {
  if (!currentSample.value)
    return

  isEditingNote.value = true
  editingNote.value = currentSample.value.note

  nextTick(() => noteInput.value?.focus())
}

function editNote(save = false) {
  if (save && currentSample.value)
    historyManager.update(currentSample.value.date, { note: editingNote.value || '' })

  isEditingNote.value = false
}

onUnmounted(() => stopWatchers())
switchSample()
</script>

<template>
  <div class="container-fluid">
    <ViewTitle emoji="📜" :path="Path.History" />

    <div v-if="currentSample" class="container mb-5">
      <!-- Actions -->
      <div class="row p-2 border rounded-3 bg-light-subtle shadow-sm">
        <!-- Date selector -->
        <div class="col-md-4 mb-3">
          <label class="form-label fw-semibold d-block" for="navSelect">
            Date à afficher
          </label>
          <select id="navSelect" v-model="selectedDate" class="form-select" @change="dateSelected">
            <option disabled value="">
              Choix de la date
            </option>
            <option v-for="sample in historyManager.history" :key="sample.date" :value="sample.date">
              {{ sexyDate(sample.date) }}
            </option>
          </select>

          <!-- Delete button -->
          <button class="btn btn-outline-danger btn-sm mt-3" @click="removeSample()">
            Supprimer de l’historique
          </button>
        </div>

        <!-- Note section -->
        <div class="col-md-8">
          <label class="form-label fw-semibold d-block">Note</label>
          <div v-if="isEditingNote" class="d-flex flex-column flex-sm-row align-items-start gap-2">
            <textarea
              ref="noteInput"
              v-model="editingNote"
              class="form-control flex-grow-1"
              placeholder="Ajouter une note"
              rows="3"
              @keydown.ctrl.enter="editNote(true)"
              @keydown.esc="editNote(false)"
            />
            <div class="d-flex gap-2 mt-2 mt-sm-0">
              <button class="btn btn-success btn-sm d-flex align-items-center gap-1" type="button" @click="editNote(true)">
                <img alt="Sauvegarder" class="icon-container-small" src="@/assets/icons/diskette.png">
                Sauvegarder
              </button>
              <button class="btn btn-secondary btn-sm" type="button" @click="editNote(false)">
                Annuler
              </button>
            </div>
          </div>
          <div v-else class="d-flex align-items-center flex-wrap gap-2">
            <span v-if="currentSample.note" class="text-body" style="white-space: pre-line;">
              {{ currentSample.note }}
            </span>
            <span v-else class="fst-italic text-body-secondary">
              Aucune note pour le moment
            </span>
            <button class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" @click="startEditingNote">
              <img alt="Éditer" class="icon-container-small" src="@/assets/icons/pencil.png">
              Éditer
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">
        Pas de données dans l’historique
      </p>
    </div>

    <!-- Show history -->
    <BudgetShow
      v-if="currentSample"
      :account="snapshot.account"
      :component-type="HistoryTransactionsShow"
      :users="snapshot.users"
      :with-note="false"
    />
  </div>
</template>