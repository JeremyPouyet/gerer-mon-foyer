<script setup lang="ts">
import { RouterView } from 'vue-router'

import { onMounted, provide, ref } from 'vue'
import ConfirmModal from './components/structure/ConfirmModal.vue'
import Footer from '@/components/structure/Footer.vue'
import { Modal } from 'bootstrap'
import Navbar from '@/components/structure/Navbar.vue'
import Notifications from '@/components/structure/Notifications.vue'

let confirmModal: Modal
const modalMessage = ref<string>('')
const modalCallback = ref<() => void>()

provide('openModal', (msg: string, cb: () => void) => {
  if (!confirmModal)
    return
  modalCallback.value = () => {
    confirmModal.hide()
    cb()
  }
  modalMessage.value = msg
  confirmModal.show()
})

provide('modalSetup', { modalCallback, modalMessage })

onMounted(() => {
  const htmlModal = document.getElementById('confirmModal')
  if (!htmlModal) return
  confirmModal = new Modal(htmlModal)
})

</script>

<template>
  <Navbar />
  <Notifications />
  <ConfirmModal />
  <main id="main" role="main">
    <RouterView />
  </main>
  <Footer />
</template>