<script setup lang="ts">
import Note from './Note.vue'
import NoteIcon from './NoteIcon.vue'

import { onMounted, ref } from 'vue'

import { sexyDate } from '@/formaters'
import historyManager, { type Sample } from '@/historyManager'
import { useSticky } from '@/helpers'

const emit = defineEmits(['switchSample'])

const activeDate = ref<string | null | undefined>(null)
const history = ref<Sample[]>(historyManager.history)
const isSticky = useSticky()

onMounted(() => {
  activeDate.value = sessionStorage.getItem('currentHistoryDate')
})

function switchSample(date: string) : void {
  const newSample = historyManager.sampleGet(date)

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
  <div :class="['row char-width-30 sticky-top', { 'sticky-offset': isSticky }]">
    <div class="row">
      <h3>Dates</h3>
      <hr>
      <ul class="item-list p-0">
        <li v-for="sample in history" :key="sample.date" class="item py-2">
          <div class="d-flex justify-content-between container-fluid align-items-center">
            <span
              v-tooltip
              data-bs-placement="right"
              data-bs-title="Cliquer pour sélectionner"
              style="cursor: pointer"
              :class="{ active: activeDate === sample.date }"
              @click="() => switchSample(sample.date)"
            >
              {{ sexyDate(sample.date) }}
              <NoteIcon :text="sample.note" :unpaded="true" />
            </span>
            <div>
              <Note :item="sample" @update="note => historyManager.update(sample.date, { note })" />
              <img
                v-tooltip="{ disposeOnClick: true }"
                src="@/assets/icons/cross.png"
                alt="Supprimer"
                data-bs-title="Supprimer de l’historique"
                class="icon-container-small icon-hoverable ms-2"
                @click="() => removeSample(sample.date)"
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.active {
  font-weight: bold;
  color: #000;
}
</style>