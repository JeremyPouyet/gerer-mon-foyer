<script setup lang="ts">
import { RouterView } from 'vue-router'

import ConfirmModal from './components/structure/ConfirmModal.vue'
import Footer from '@/components/structure/Footer.vue'
import Navbar from '@/components/structure/Navbar.vue'
import Notifications from '@/components/structure/Notifications.vue'
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