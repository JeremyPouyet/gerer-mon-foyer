<script setup lang="ts">
import '@/assets/secondary.scss'

import ProjectEditor from '@/components/project/ProjectEditor.vue'
import LeftColumn from '@/components/leftColumns/LeftColumn.vue'
import ProjectsEdit from '@/components/leftColumns/ProjectsEdit.vue'
import ViewTitle from '@/components/ViewTitle.vue'

import { onMounted, onUnmounted, ref } from 'vue'

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
  <div class="container-fluid">
    <ViewTitle :path="Path.Projects" emoji="🗂️" />
    <div class="row">
      <LeftColumn :title="'Mes projets'">
        <ProjectsEdit />
      </LeftColumn>
      <div class="col">
        <ProjectEditor :key="currentProject.id" :current-project="currentProject" />
      </div>
    </div>
  </div>
</template>