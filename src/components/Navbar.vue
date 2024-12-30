<script setup lang="ts">
import distributionIcon from '@/assets/icons/distribution.png'
import historyIcon from '@/assets/icons/history.png'
import projectIcon from '@/assets/icons/criteria.png'
import taxCalculateIcon from '@/assets/icons/tax-calculate.png'

import { RouterLink, useRoute } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'

import unsavedManager from '@/managers/unsavedManager'

onMounted(() => {
  import('bootstrap/js/dist/collapse')
})

const route = useRoute()
const currentPath = ref(route.path)
watch(route, newRoute => currentPath.value = newRoute.path)

const unsavedChangesText = computed(() : string => {
  const count = unsavedManager.count.value

  return count === 1 ? `${count} modification non sauvegardée` : `${count} modifications non sauvegardées`
})

const menuItems: [string, string, string][] = [
  ['/budget',    'Budget',     taxCalculateIcon],
  ['/projects',  'Projets',    projectIcon],
  ['/simulator', 'Simulateur', distributionIcon],
  ['/history',   'Historique', historyIcon],
]

async function historicize() {
  const db = await import('@/db')
  db.default.historicize()
}
</script>

<template>
  <nav class="bg-primary navbar navbar-expand-md mb-4 shadow-sm">
    <div class="container-fluid">
      <RouterLink active-class="active" class="navbar-brand py-0" to="/">
        <p class="text-center mb-0 lh-1">
          Gérer
        </p>
        <div>
          Mon <img alt="" class="icon-container-small" src="@/assets/icons/home.png"> Foyer
        </div>
      </RouterLink>
      <button
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        class="navbar-toggler"
        data-bs-target="#navbarNav"
        data-bs-toggle="collapse"
        type="button"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarNav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="[uri, label, src] in menuItems" :key="label" class="nav-item">
            <RouterLink active-class="active" class="nav-link" :to="uri">
              <img alt="" class="icon-container" :src="src">
              {{ label }}
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink active-class="active" class="nav-link" to="/settings">
              <img alt="" class="icon-container" src="@/assets/icons/cog.png">
              <span>
                Paramètres
                <div
                  v-if="unsavedManager.count.value > 0"
                  v-tooltip
                  class="position-absolute start-100 translate-middle badge rounded-pill bg-secondary"
                  data-bs-placement="bottom"
                  :data-bs-title="unsavedChangesText"
                >
                  {{ unsavedManager.count }}
                </div>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
      <button v-if="currentPath === '/budget'" class="btn btn-secondary" @click="historicize">
        Historiser
      </button>
    </div>
  </nav>
</template>