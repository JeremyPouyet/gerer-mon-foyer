<script setup lang="ts">
import projectManager from '@/managers/projectManager'
import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'
import { onMounted, onUnmounted, ref } from 'vue'

import type { ID } from '@/types'
import type Project from '@/project'

function projectCreate() : void {
  projectManager.create(projectName.value)
  projectName.value = ''
  updateProjects()
}

function projectDelete(id: ID) : void {
  projectManager.delete(id)
  updateProjects()
}

function updateProjects() {
  projects.value = projectManager.projects
}

function switchProject(id: ID) {
  projectManager.current = id
}

const projectName = ref('')
const projects = ref<Project[]>(projectManager.projects)

onMounted(() => projectManager.addEventListener('update', updateProjects))
onUnmounted(() => window.removeEventListener('update', updateProjects))
</script>

<template>
  <ul class="item-list p-0">
    <li v-for="project in projects" :key="project.id" class="item py-2">
      <div class="d-flex justify-content-between container-fluid align-items-center">
        <span
          v-tooltip
          data-bs-placement="right"
          data-bs-title="Cliquer pour sélectionner"
          style="cursor: pointer"
          :class="{ active: projectManager.getCurrent().id === project.id }"
          @click="() => switchProject(project.id)"
        >
          {{ project.name }}
          <NoteIcon :text="project.note" :unpaded="true" />
        </span>
        <div>
          <Note :item="project" @update="note => projectManager.update({ id: project.id, note })" />
          <img
            v-tooltip="{ disposeOnClick: true }"
            src="@/assets/icons/cross.png"
            alt="Supprimer"
            data-bs-title="Supprimer des projets"
            class="icon-container-small icon-hoverable ms-2"
            @click="projectDelete(project.id)"
          >
        </div>
      </div>
    </li>
  </ul>
  <div class="input-group">
    <input
      v-model="projectName"
      class="form-control"
      placeholder="Nom du projet"
      type="text"
      @keydown.enter="projectCreate"
    >
    <button
      type="button"
      class="btn btn-secondary btn-sm"
      :disabled="!projectName"
      @click="projectCreate"
    >
      Créer
    </button>
  </div>
</template>