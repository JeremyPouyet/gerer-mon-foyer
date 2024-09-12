<script setup lang="ts">
  import { type ID } from '@/types';
  import notificationManager, { NotificationType } from '@/notificationManager'

  import { Toast } from 'bootstrap'
  import { onUpdated } from 'vue'

  const urls = {
    [NotificationType.Error]: new URL('@/assets/icons/error.png', import.meta.url),
    [NotificationType.Success]: new URL('@/assets/icons/success.png', import.meta.url)
  }

  onUpdated(() => {
    document.querySelectorAll('.toast').forEach(toastEl => {
      const toast = new Toast(toastEl, { delay: 6000 })

      toastEl.addEventListener("hide.bs.toast", event => {
        const toastDiv = event.target as HTMLDivElement

        if (toastDiv)
          notificationManager.delete(toastDiv.dataset.id as ID)
      }, { once: true })

      if (toast.isShown() === false)
        toast.show()
    })
  })
</script>

<template>
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
      v-for="[id, notif] in notificationManager.notifications.value"
      :key="id"
      class="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :data-id="id"
    >
      <div class="toast-header">
        <img :src="urls[notif.type].href" class="rounded me-2 icon-container" :alt="notif.type">
        <strong v-if="notif.type === NotificationType.Error" class="me-auto">Erreur</strong>
        <strong v-else class="me-auto">Succès</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" />
      </div>
      <div class="toast-body">
        {{ notif.text }}
      </div>
    </div>
  </div>
</template>
