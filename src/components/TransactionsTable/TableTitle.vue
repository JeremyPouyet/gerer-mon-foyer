<script setup lang="ts">
import { TransactionType } from '@/types'
import type Account from '@/account'

const props = defineProps<{ title: string, transactionType: TransactionType, account: Account }>()
</script>

<template>
  <div class="table-title-container rounded-shadow d-flex align-items-center justify-content-center position-relative">
    <h1 class="table-title align-bottom">
      {{ props.title }}
    </h1>
    <img
      v-tooltip="{ disposeOnClick: true }"
      src="@/assets/icons/hide.png"
      class="icon-container icon-hoverable position-absolute end-0"
      alt="Cacher"
      data-bs-placement="left"
      data-bs-title="Cacher"
      @click="() => props.account.settings.show[props.transactionType] = false"
    >
  </div>
</template>

<style scope>
  .table-title-container {
    display: flex;
    padding: 10px 0;
    margin-bottom: 20px;
  }

  .table-title {
    font-size: 1.5em;
    font-weight: normal;
    color: #333333; /* Dark gray text */
    margin: 0;
    text-align: center;
  }
</style>