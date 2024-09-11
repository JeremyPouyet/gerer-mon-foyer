<script setup lang="ts">
  import FinanceInfoBlock from '@/components/FinanceInfoBlock.vue'
  import HistoryTransactionsShow from '@/components/HistoryTransactionsShow.vue'
  import HistoryEditDates from '@/components/HistoryEditDates.vue';
  import UserNameTitle from '@/components/UserNameTitle.vue'

  import { computed, ref, watch } from 'vue'
  import DBSnapshot from '@/dbSnapshot'
  import { TransactionType } from '@/types'
  import historyManager, { type Sample } from '@/historyManager';

  let userWatcherCleanup: (() => void) | null = null;
  let accountWatcherCleanup: (() => void) | null = null;

  function switchSample() {
    const newSample = historyManager.activeSample

    sample.value = newSample

    userWatcherCleanup?.()
    accountWatcherCleanup?.()

    if (!sample.value)
      return

    snapshot.value = new DBSnapshot(JSON.parse(sample.value.data))

    userWatcherCleanup = watch(snapshot.value.users, () => updateSampleData({ users: snapshot.value.users }), { deep: true })
    accountWatcherCleanup = watch(snapshot.value.account, () => updateSampleData({ account: snapshot.value.account }), {deep: true})
  }

  const sample = ref<Sample | null | undefined>()
  const snapshot = ref<DBSnapshot>(new DBSnapshot({}))

  const commonBill = computed<number>(() => Math.max(snapshot.value.account.expenses.sum - snapshot.value.account.incomes.sum, 0))
  const incomeSum = computed(() => snapshot.value.users.reduce((sum, user) => sum + user.incomes.sum, snapshot.value.account.incomes.sum))
  const remainSum = computed(() => snapshot.value.users.reduce((sum, user) => sum + user.monthlyRemainingBalance, 0))

  function updateSampleData(updatedData: Partial<DBSnapshot>) {
    if (sample.value) {
      const data = JSON.parse(sample.value.data) as DBSnapshot
      Object.assign(data, updatedData)
      historyManager.sampleUpdate(sample.value.date, { data: JSON.stringify(data) })
    }
  }

  switchSample()
</script>

<template>
  <div class="container-fluid mt-2">
    <div v-if="!sample">
      <p class="text-center">
        Pas de données dans l'historique
      </p>
    </div>
    <div v-else class="row">
      <div class="col-auto mb-4">
        <HistoryEditDates @switch-sample="() => switchSample()" />
      </div>
      <div class="col">
        <div class="row">
          <UserNameTitle :user="snapshot.account" :with-note="false" />
          <HistoryTransactionsShow :income="incomeSum" :transaction-type="TransactionType.Expense" :user="snapshot.account" />
          <HistoryTransactionsShow :transaction-type="TransactionType.Income" :user="snapshot.account" />
        </div>
        <div v-for="user in snapshot.users" :key="user.id" class="row">
          <UserNameTitle :user="user" :with-note="false" />
          <HistoryTransactionsShow :income="user.incomes.sum" :transaction-type="TransactionType.Expense" :user="user" />
          <div class="col mb-4">
            <HistoryTransactionsShow :transaction-type="TransactionType.Income" :user="user" />
            <FinanceInfoBlock :user="user" :common-bill="commonBill" :remain-sum="remainSum" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>