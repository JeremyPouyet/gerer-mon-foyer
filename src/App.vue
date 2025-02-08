<script setup lang="ts">
import { onMounted, provide, ref, shallowRef } from 'vue'
import { Modal } from 'bootstrap'
import { RouterView } from 'vue-router'

import ConfirmModal from './components/structure/ConfirmModal.vue'
import Footer from '@/components/structure/Footer.vue'
import Navbar from '@/components/structure/Navbar.vue'
import Notifications from '@/components/structure/Notifications.vue'

import settingManager from '@/managers/settingManager'

let confirmModal: Modal
const modalMessage = ref<string>('')
const modalCallback = shallowRef<() => void>()

provide('openModal', (msg: string, cb: () => void) => {
  // The user does not want to see the confirmation modal
  if (settingManager.settings.showConfirmModal === false)
    return cb()

  modalCallback.value = () => {
    confirmModal?.hide()
    modalCallback.value = undefined
    cb()
  }
  modalMessage.value = msg
  confirmModal?.show()
})

onMounted(() => {
  const htmlModal = document.getElementById('confirmModal')

  if (htmlModal)
    confirmModal = new Modal(htmlModal)
})

</script>

<template>
  <Navbar />
  <Notifications />
  <ConfirmModal :callback="modalCallback" :message="modalMessage" />
  <main id="main" role="main">
    <RouterView />
  </main>
  <Footer />
</template>