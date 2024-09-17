<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import db from '@/db'
import notificationManager, { NotificationType } from '@/notificationManager'
import historyManager from '@/historyManager'

const route = useRoute()
const currentPath = ref(route.path)
watch(route, newRoute => currentPath.value = newRoute.path)

const unsavedChangesText = computed(() : string => {
  const count = db.unsavedChanges.value

  return count === 1 ? `${count} modification non sauvegardée` : `${count} modifications non sauvegardées`
})

const addMarginWhenBadge = computed(() : string => {
  return db.unsavedChanges.value > 0 ? 'me-3' : ''
})

const menuItems: [string, string, URL][] = [
  ['/',                     'Accueil',                  new URL('@/assets/icons/home.png', import.meta.url)],
  ['/expense-distribution', 'Répartition des dépenses', new URL('@/assets/icons/tax-calculate.png', import.meta.url)],
  ['/history',              'Historique',               new URL('@/assets/icons/history.png', import.meta.url)],
  ['/simulator',            'Simulateur',               new URL('@/assets/icons/distribution.png', import.meta.url)]
]

function historicise() {
  historyManager.sampleCreate({ account: db.account, users: db.users })
  notificationManager.create('Répartition historisé !', NotificationType.Success)
}
</script>

<template>
  <nav class="navbar navbar-expand-lg mb-4" style="background-color: var(--color-celadon)">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="[uri, label, src] in menuItems" :key="label" class="nav-item">
            <RouterLink class="nav-link" :to="uri" active-class="active">
              <img :src="src.href" class="icon-container" alt="">
              {{ label }}
            </RouterLink>
          </li>
          <li :class="['nav-item', addMarginWhenBadge]">
            <RouterLink class="nav-link" to="/data-management" active-class="active">
              <img src="@/assets/icons/diskette.png" class="icon-container" alt="">
              <span>
                Gestion des données
                <div
                  v-show="db.unsavedChanges.value > 0"
                  data-toggle="tooltip"
                  :title="unsavedChangesText"
                  data-placement="bottom"
                  class="position-absolute start-100 translate-middle badge rounded-pill"
                  style="background-color: var(--color-xanthous)"
                >
                  {{ db.unsavedChanges }}
                </div>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
      <button v-if="currentPath === '/expense-distribution'" class="btn btn-primary default-button" @click="historicise">
        Historiser
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar-nav .nav-link {
  position: relative;
  color: #333;
  text-decoration: none;
}

.nav-link.active {
  font-weight: bold;
  color: #000;
}

.navbar-nav .nav-link:after {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--color-xanthous);
  transition: transform 0.3s ease-in-out;
  transform: scaleX(0);
}

.navbar-nav .nav-link:hover:after {
  transform: scaleX(1);
}
</style>