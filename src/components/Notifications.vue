<script setup lang="ts">
import notificationManager, { NotificationType } from '@/managers/notificationManager'
import { type ID } from '@/types'

import { onMounted, onUpdated } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Toast: any

const urls = {
  [NotificationType.Error]: new URL('@/assets/icons/error.png', import.meta.url),
  [NotificationType.Success]: new URL('@/assets/icons/success.png', import.meta.url)
}

onMounted(async () => {
  const module = await import('bootstrap/js/dist/toast')
  Toast = module.default
})

onUpdated(() => {
  document.querySelectorAll('.toast').forEach(toastEl => {
    const toast = new Toast(toastEl, { delay: 6000 })

    toastEl.addEventListener('hide.bs.toast', event => {
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
  <div class="toast-container position-fixed end-0 p-3" style="top:60px;">
    <div
      v-for="[id, notif] in notificationManager.notifications.value"
      :key="id"
      aria-atomic="true"
      aria-live="assertive"
      class="toast"
      :data-id="id"
      role="alert"
    >
      <div class="toast-header">
        <img :alt="notif.type" class="rounded me-2 icon-container" :src="urls[notif.type].href">
        <strong v-if="notif.type === NotificationType.Error" class="me-auto">Erreur</strong>
        <strong v-else class="me-auto">Succès</strong>
        <button aria-label="Close" class="btn-close" data-bs-dismiss="toast" type="button" />
      </div>
      <div class="toast-body">
        {{ notif.text }}
      </div>
    </div>
  </div>
</template>
