<script setup lang="ts">
import Note from './Note.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import historyManager, { type Sample } from '@/historyManager'

const emit = defineEmits(['switchSample'])
const activeDate = ref<string | null | undefined>(sessionStorage.getItem('currentHistoryDate'))
const history = ref<Sample[]>(historyManager.history)

function switchSample(date: string) : void {
  const newSample = historyManager.sampleGet(date)

  activeDate.value = date
  historyManager.activeDate = date
  if (newSample) emit('switchSample')
}

function removeSample(date: string) : void {
  const userIsremovingActiveSample = date == historyManager.activeDate

  historyManager.sampleDelete(date)

  if (!userIsremovingActiveSample)
    return

  activeDate.value = historyManager.activeDate
  emit('switchSample')
}

/* eslint-disable sort-keys */
const formatter = new Intl.DateTimeFormat('fr-FR', {
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
/* eslint-enable sort-keys */

function sexyDate(strDate: string) {
  return formatter.format(new Date(strDate))
}

onMounted(() => {
  const updateHistory = (event: Event) => {
    const customEvent = event as CustomEvent
    history.value = [...customEvent.detail]
  }

  historyManager.addEventListener('update', updateHistory)
  onUnmounted(() => historyManager.removeEventListener('update', updateHistory))
})

</script>

<template>
  <div class="row char-width-30">
    <div class="row">
      <h3>Dates</h3>
      <hr>
    </div>
    <ul class="item-list">
      <li v-for="sample in history" :key="sample.date" class="item">
        <div class="d-flex justify-content-between container-fluid align-items-center">
          <span
            title="Cliquer pour sélectionner"
            style="cursor: pointer"
            :class="{ active: activeDate === sample.date }"
            @click="() => switchSample(sample.date)"
          >
            {{ sexyDate(sample.date) }}
            <span
              v-if="sample.note"
              data-toggle="tooltip"
              :title="sample.note"
              class="translate-middle badge unpaded"
              style="position:relative;top:-0.2rem;right:-0.6rem;"
            >
              <img src="@/assets/icons/message.png" class="icon-container-small">
            </span>
          </span>
          <div>
            <Note :item="sample" @update="note => historyManager.sampleUpdate(sample.date, { note })" />
            <img
              src="@/assets/icons/cross.png"
              alt="Supprimer"
              :title="`Supprimer ${sexyDate(sample.date)} de l'historique`"
              class="icon-container-small icon-hoverable"
              style="margin-left:0.4rem;"
              @click="() => removeSample(sample.date)"
            >
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.active {
  font-weight: bold;
  color: #000;
}
</style>