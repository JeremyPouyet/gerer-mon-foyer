<script setup lang="ts">
import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'

import { ref } from 'vue'

import historyManager, { type Sample } from '@/managers/historyManager'
import { sexyDate } from '@/formaters'

const emit = defineEmits(['switchSample'])

const activeDate = ref<string | null | undefined>(historyManager.activeDate)
const history = ref<Sample[]>(historyManager.history)

function switchSample(date: string) : void {
  const newSample = historyManager.get(date)

  activeDate.value = date
  historyManager.activeDate = date
  if (newSample) emit('switchSample')
}

function removeSample(date: string) : void {
  const userIsremovingActiveSample = date == historyManager.activeDate

  historyManager.delete(date)

  if (!userIsremovingActiveSample)
    return

  activeDate.value = historyManager.activeDate
  emit('switchSample')
}
</script>

<template>
  <ul class="item-list p-0">
    <li v-for="sample in history" :key="sample.date" aria-live="polite" class="item py-2">
      <div class="d-flex justify-content-between container-fluid align-items-center pe-0">
        <span
          v-tooltip
          :aria-label="`Sélectionner la date du ${sexyDate(sample.date)}`"
          :aria-pressed="activeDate === sample.date"
          :class="{ active: activeDate === sample.date }"
          data-bs-placement="right"
          data-bs-title="Cliquer pour sélectionner"
          role="button"
          style="cursor: pointer"
          tabindex="0"
          @click="switchSample(sample.date)"
          @keydown.enter="switchSample(sample.date)"
        >
          {{ sexyDate(sample.date) }}
          <NoteIcon :text="sample.note" :unpaded="true" />
        </span>
        <div class="text-nowrap">
          <Note :item="sample" @update="note => historyManager.update(sample.date, { note })" />
          <img
            v-tooltip="{ disposeOnClick: true }"
            alt="Supprimer de l’historique"
            :aria-label="`Supprimer la date du ${sexyDate(sample.date)} de l’historique`"
            class="icon-container-small icon-hoverable ms-2"
            data-bs-title="Supprimer de l’historique"
            role="button"
            src="@/assets/icons/cross.png"
            tabindex="0"
            @click="removeSample(sample.date)"
          >
        </div>
      </div>
    </li>
  </ul>
</template>