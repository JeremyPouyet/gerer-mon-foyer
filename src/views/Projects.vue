<script setup lang="ts">
import '@/assets/secondary.scss'

import AdvancedSimulator from '@/components/simulator/AdvancedSimulator.vue'
import LeftColumn from '@/components/leftColumns/LeftColumn.vue'
import ProjectsEdit from '@/components/leftColumns/ProjectsEdit.vue'

import { onMounted, onUnmounted, ref } from 'vue'

import Texts from '@/texts'
import { Path } from '@/types'
import Project from '@/project'

import projectManager from '@/managers/projectManager'

const currentProject = ref<Project>(projectManager.getCurrent())

onMounted(() => {
  function switchProject() {
    currentProject.value = projectManager.getCurrent()
  }

  projectManager.addEventListener('switchProject', switchProject)

  onUnmounted(() => projectManager.removeEventListener('switchProject', switchProject))
})
</script>

<template>
  <div class="container-fluid mt-2">
    <div class="row">
      <LeftColumn :title="'Mes projets'">
        <ProjectsEdit />
      </LeftColumn>
      <div class="col">
        <h1>Gestion de projets</h1>
        <p>
          {{ Texts.heads[Path.Projects].meta.description }}
        </p>
        <AdvancedSimulator :key="currentProject.id" :current-project="currentProject" />
      </div>
    </div>
  </div>
</template>