<script setup lang="ts">
import FinanceInfoBlock from '@/components/FinanceInfoBlock.vue'
import HistoryTransactionsShow from '@/components/HistoryTransactionsShow.vue'
import HistoryEdit from '@/components/HistoryEdit.vue'
import UserNameTitle from '@/components/UserNameTitle.vue'

import { computed, onUnmounted, ref, watch } from 'vue'
import DBSnapshot from '@/dbSnapshot'
import { TransactionType } from '@/types'
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

const commonBill = computed<number>(() => Math.max(snapshot.value.account.expenses.sum - snapshot.value.account.incomes.sum, 0))
const incomeSum = computed(() => snapshot.value.users.reduce((sum, user) => sum + user.account.incomes.sum, snapshot.value.account.incomes.sum))
const remainSum = computed(() => snapshot.value.users.reduce((sum, user) => sum + (user.account.incomes.sum - user.account.expenses.sum), 0))

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
      <div class="col">
        <div class="row">
          <UserNameTitle :account="snapshot.account" :name="'Compte commun'" :with-note="false" />
          <HistoryTransactionsShow :account="snapshot.account" :income="incomeSum" :transaction-type="TransactionType.Expense" />
          <HistoryTransactionsShow :account="snapshot.account" :transaction-type="TransactionType.Income" />
        </div>
        <div v-for="user in snapshot.users" :key="user.id" class="row">
          <UserNameTitle :account="user.account" :name="user.name" :with-note="false" />
          <HistoryTransactionsShow :account="user.account" :income="user.account.incomes.sum" :transaction-type="TransactionType.Expense" />
          <div class="col mb-4">
            <HistoryTransactionsShow :account="user.account" :transaction-type="TransactionType.Income" />
            <FinanceInfoBlock :common-bill="commonBill" :remain-sum="remainSum" :user="user" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>