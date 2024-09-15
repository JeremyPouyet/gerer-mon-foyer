<script setup lang="ts">
import type Account from '@/account'
import Note from '@/components/Note.vue'
import { TransactionType } from '@/types'

const props = defineProps<{ account: Account, name: string, withNote: boolean }>()
</script>

<template>
  <div class="d-flex justify-content-between">
    <div>
      <h3 :title="props.account.note">
        {{ name }}
        <span
          v-if="props.account.note"
          data-toggle="tooltip"
          :title="props.account.note"
          class="translate-middle badge unpaded"
          style="position:relative;top:-0.2rem;right:-0.6rem;"
        >
          <img src="@/assets/icons/message.png" class="icon-container-small" alt="l'habitant est annoté">
        </span>
        <Note v-if="props.withNote" :item="props.account" @update="note => account.note = note" />
      </h3>
    </div>
    <div class="d-flex">
      <div
        v-if="!account.settings.show[TransactionType.Expense]"
        class="text-container icon-hoverable me-3 d-flex align-items-center"
        @click="account.settings.show[TransactionType.Expense] = true"
      >
        Dépenses
        <img src="@/assets/icons/show.png" class="icon-container-small" alt="Aggrandir" title="Aggrandir">
      </div>
      <div
        v-if="!account.settings.show[TransactionType.Income]"
        class="text-container me-3 icon-hoverable d-flex align-items-center"
        @click="account.settings.show[TransactionType.Income] = true"
      >
        Revenus
        <img src="@/assets/icons/show.png" class="icon-container-small" alt="Aggrandir" title="Aggrandir">
      </div>
    </div>
  </div>
  <hr>
</template>

<style scope>
  .text-container {
    justify-content: center;
    padding: 10px 0;
    margin-bottom: 2px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
</style>