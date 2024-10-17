<script setup lang="ts">
import taxCalculateIcon from '@/assets/icons/tax-calculate.png'
import historyIcon from '@/assets/icons/history.png'
import distributionIcon from '@/assets/icons/distribution.png'

import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import db from '@/db'
import { NotificationType } from '@/notificationManager'
import type { NotificationManager } from '@/notificationManager'
import type { HistoryManager } from '@/historyManager'
import type { UserManager } from '@/userManager'

onMounted(() => {
  import('bootstrap/js/dist/collapse')
})

const route = useRoute()
const currentPath = ref(route.path)
watch(route, newRoute => currentPath.value = newRoute.path)

const unsavedChangesText = computed(() : string => {
  const count = db.unsavedChanges.value

  return count === 1 ? `${count} modification non sauvegardée` : `${count} modifications non sauvegardées`
})

const menuItems: [string, string, string][] = [
  ['/budget',    'Mon budget', taxCalculateIcon],
  ['/history',   'Historique', historyIcon],
  ['/simulator', 'Simulateur', distributionIcon]
]

let notificationManager: NotificationManager
let historyManager: HistoryManager
let userManager: UserManager

const loadManagers = async () => {
  notificationManager = (await import('@/notificationManager')).default
  historyManager = (await import('@/historyManager')).default
  userManager = (await import('@/userManager')).default
}

async function historicise() {
  if (!notificationManager || !historyManager || !userManager)
    await loadManagers()

  historyManager.create({ account: db.account, users: userManager.users })
  notificationManager.create('Répartition historisé !', NotificationType.Success)
}
</script>

<template>
  <nav class="bg-primary navbar navbar-expand-md mb-4">
    <div class="container-fluid">
      <RouterLink class="navbar-brand py-0" to="/" active-class="active">
        <p class="text-center mb-0 lh-1">
          Gérer
        </p>
        <div>
          Mon <img src="@/assets/icons/home.png" class="icon-container-small" alt=""> Foyer
        </div>
      </RouterLink>
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
              <img :src="src" class="icon-container" alt="">
              {{ label }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/settings" active-class="active">
              <img src="@/assets/icons/diskette.png" class="icon-container" alt="">
              <span>
                Mes données
                <div
                  v-if="db.unsavedChanges.value > 0"
                  v-tooltip
                  :data-bs-title="unsavedChangesText"
                  data-bs-placement="bottom"
                  class="position-absolute start-100 translate-middle badge rounded-pill bg-secondary"
                >
                  {{ db.unsavedChanges }}
                </div>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
      <button v-if="currentPath === '/budget'" class="btn btn-secondary" @click="historicise">
        Historiser
      </button>
    </div>
  </nav>
</template>