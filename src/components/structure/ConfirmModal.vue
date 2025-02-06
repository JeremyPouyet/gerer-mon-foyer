<script setup lang="ts">
import { type Ref, inject } from 'vue'

const { modalCallback, modalMessage } = inject('modalSetup') as { modalCallback: Ref<() => void>, modalMessage: Ref<string> }

const confirm = () => modalCallback.value()

</script>

<template>
  <div id="confirmModal" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="confirmModalLabel" class="modal-title">
            Confirmation
          </h5>
          <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button" />
        </div>
        <div class="modal-body">
          {{ modalMessage }}
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-dismiss="modal" type="button">
            Annuler
          </button>
          <button id="confirmBtn" class="btn btn-primary" type="button" @click="confirm">
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
