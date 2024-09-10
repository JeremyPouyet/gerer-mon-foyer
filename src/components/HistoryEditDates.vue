<script setup lang="ts">
  import Note from './Note.vue';
  import { ref } from 'vue'
  import historyManager from '@/historyManager';

  const emit = defineEmits(['switchSample'])
  const activeDate = ref<string | null | undefined>(sessionStorage.getItem('currentHistoryDate'))

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
  });
  /* eslint-enable sort-keys */

  function sexyDate(strDate: string) {
    return formatter.format(new Date(strDate))
  }
</script>

<template>
  <div class="row char-width-30">
    <div class="row">
      <h3>Dates</h3>
      <hr>
    </div>
  </div>
  <ul class="item-list">
    <li v-for="sample in historyManager.history" :key="sample.date" class="item">
      <div class="item-info">
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
        <div class="align-right">
          <Note :item="sample" />
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
</template>

<style scoped>
.active {
  font-weight: bold;
  color: #000;
}
</style>