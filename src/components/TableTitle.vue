<script setup lang="ts">
import { TransactionType } from '@/types'
import type Account from '@/account'

const props = defineProps<{ title: string, transactionType: TransactionType, account: Account }>()
</script>

<template>
  <div class="table-title-container d-flex align-items-center justify-content-center position-relative">
    <h1 class="table-title align-bottom">
      {{ props.title }}
    </h1>
    <img
      src="@/assets/icons/hide.png"
      class="icon-container icon-hoverable position-absolute end-0"
      alt="Cacher"
      title="Cacher"
      @click="() => props.account.settings.show[props.transactionType] = false"
    >
  </div>
</template>

<style scope>
  .table-title-container {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .table-title {
    font-size: 1.5em;
    font-weight: normal;
    color: #333333; /* Dark gray text */
    margin: 0;
    text-align: center;
  }
</style>