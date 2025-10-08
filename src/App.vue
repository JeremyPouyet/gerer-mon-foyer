<script setup lang="ts">
import { defineAsyncComponent, provide, ref, shallowRef } from 'vue'
import type Modal from 'bootstrap/js/dist/modal' // Only import type to not load JS
import { RouterView } from 'vue-router'

import Navbar from '@/components/structure/Navbar.vue'
import type { SettingsManager } from '@/managers/settingManager'

const ConfirmModal = defineAsyncComponent(() => import('./components/structure/ConfirmModal.vue'))
const Footer = defineAsyncComponent(() => import('@/components/structure/Footer.vue'))
const Notifications = defineAsyncComponent(() => import('@/components/structure/Notifications.vue'))

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
</script>

<template>
  <Navbar />
  <main id="main" class="mt-5" role="main">
    <RouterView />
  </main>
  <ConfirmModal :callback="modalCallback" :message="modalMessage" />
  <Notifications />
  <Footer />
</template>