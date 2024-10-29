<script setup lang="ts">
import '@/assets/secondary.scss'

import HistoryTransactionsShow from '@/components/HistoryTransactionsShow.vue'
import HistoryEdit from '@/components/HistoryEdit.vue'
import BudgetShow from '@/components/BudgetShow.vue'

import { computed, onUnmounted, ref, watch } from 'vue'

import DBSnapshot from '@/dbSnapshot'
import { useFinanceCalculations } from '@/helpers'
import historyManager, { type Sample } from '@/historyManager'

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

const account = computed(() => snapshot.value.account)
const users = computed(() => snapshot.value.users)
const { commonBill, incomeSum, remainSum } = useFinanceCalculations(account, users)

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
  <div class="container-fluid mt-2">
    <div v-if="!sample">
      <p class="text-center">
        Pas de données dans l’historique
      </p>
    </div>
    <div v-else class="row">
      <div class="col-auto mb-4">
        <HistoryEdit @switch-sample="() => switchSample()" />
      </div>
      <BudgetShow
        :account="account"
        :users="users"
        :income-sum="incomeSum"
        :remain-sum="remainSum"
        :common-bill="commonBill"
        :with-note="false"
        :component-type="HistoryTransactionsShow"
      />
    </div>
  </div>
</template>