<script setup lang="ts">
import { defineAsyncComponent, onMounted, provide, ref, shallowRef } from 'vue'
import type Modal from 'bootstrap/js/dist/modal'
import { RouterView } from 'vue-router'

import Navbar from '@/components/structure/Navbar.vue'
import type { SettingsManager } from '@/managers/settingManager'

const ConfirmModal = defineAsyncComponent(() => import('./components/structure/ConfirmModal.vue'))
const Footer = defineAsyncComponent(() => import('@/components/structure/Footer.vue'))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Notifications = ref<any>(null) // Will be loaded later

let confirmModal: Modal | null
let settingManager: SettingsManager
const modalMessage = ref<string>('')
const modalCallback = shallowRef<() => void>()

async function loadModal() : Promise<Modal | null> {
  const htmlModal = document.getElementById('confirmModal')

  if (!htmlModal)
    return null

  return new (await import('bootstrap/js/dist/modal')).default(htmlModal)
}

async function loadSettingManager() : Promise<SettingsManager> {
  return (await import('@/managers/settingManager')).default
}

provide('openModal', async (msg: string, cb: () => void) => {
  settingManager ||= await loadSettingManager()

  // The user does not want to see the confirmation modal
  if (settingManager.settings.showConfirmModal === false)
    return cb()

  confirmModal ||= await loadModal()
  modalCallback.value = () => {
    confirmModal?.hide()
    modalCallback.value = undefined
    cb()
  }
  modalMessage.value = msg
  confirmModal?.show()
})

// Wait for the page to be loaded to load notifications
onMounted(() => {
  window.addEventListener('load', async () => {
    const comp = await import('@/components/structure/Notifications.vue')
    Notifications.value = comp.default
  })
})
</script>

<template>
  <Navbar />
  <main id="main" class="mt-5" role="main">
    <RouterView />
  </main>
  
  <ConfirmModal :callback="modalCallback" :message="modalMessage" />
  <component :is="Notifications" v-if="Notifications" />

  <Footer />
</template>