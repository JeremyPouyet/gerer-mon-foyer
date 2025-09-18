<script setup lang="ts">
import '@/assets/secondary.scss'

import BudgetShow from '@/components/BudgetShow.vue'
import HistoryEdit from '@/components/leftColumns/HistoryEdit.vue'
import HistoryTransactionsShow from '@/components/HistoryTransactionsShow.vue'
import LeftColumn from '@/components/leftColumns/LeftColumn.vue'
import ViewTitle from '@/components/ViewTitle.vue'

import { onUnmounted, provide, ref, watch } from 'vue'

import historyManager, { type Sample } from '@/managers/historyManager'
import DBSnapshot from '@/dbSnapshot'
import { Path } from '@/types'

provide('editBudget', false)

let userWatcherCleanup: (() => void) | null = null
let accountWatcherCleanup: (() => void) | null = null

function switchSample() {
  sample.value = historyManager.activeSample

  stopWatchers()

  if (!sample.value)
    return

  snapshot.value = new DBSnapshot(JSON.parse(sample.value.data))

  userWatcherCleanup = watch(snapshot.value.users, () => updateSampleData({ users: snapshot.value.users }), { deep: true })
  accountWatcherCleanup = watch(snapshot.value.account, () => updateSampleData({ account: snapshot.value.account }), {deep: true})
}

const sample = ref<Sample | null | undefined>()
const snapshot = ref<DBSnapshot>(new DBSnapshot({}))

function updateSampleData(updatedData: Partial<DBSnapshot>) {
  if (sample.value) {
    const data = JSON.parse(sample.value.data) as DBSnapshot
    Object.assign(data, updatedData)
    historyManager.update(sample.value.date, { data: JSON.stringify(data) })
  }
}

function stopWatchers() : void {
  userWatcherCleanup?.()
  accountWatcherCleanup?.()
}

onUnmounted(() => stopWatchers())

switchSample()
</script>

<template>
  <div class="container-fluid">
    <ViewTitle emoji="📜" :path="Path.History" />
    <div v-if="!sample">
      <p class="text-center">
        Pas de données dans l’historique
      </p>
    </div>
    <div v-else class="row">
      <LeftColumn :title="'Dates'">
        <HistoryEdit @switch-sample="switchSample()" />
      </LeftColumn>
      <div class="col">
        <BudgetShow
          :account="snapshot.account"
          :component-type="HistoryTransactionsShow"
          :users="snapshot.users"
          :with-note="false"
        />
      </div>
    </div>
  </div>
</template>