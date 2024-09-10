<script setup lang="ts">
  import { RouterView } from 'vue-router'

  import Navbar from '@/components/Navbar.vue'
  import Footer from '@/components/Footer.vue'
  import Notifications from '@/components/Notifications.vue'
</script>

<template>
  <Navbar />
  <main id="main" role="main">
    <RouterView />
    <Notifications />
  </main>
  <Footer />
</template>