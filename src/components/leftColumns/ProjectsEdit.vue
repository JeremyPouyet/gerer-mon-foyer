<script setup lang="ts">
import Note from '@/components/Note.vue'
import NoteIcon from '@/components/NoteIcon.vue'

import { onMounted, onUnmounted, ref } from 'vue'

import type { ID } from '@/types'
import type Project from '@/project'
import projectManager from '@/managers/projectManager'
import { sexyDate } from '@/formaters'

const activeId = ref(projectManager.getCurrent().id)
const projectName = ref('')
const projects = ref<Project[]>(projectManager.projects)

function projectCreate() : void {
  const newProject = projectManager.create(projectName.value)
  if (newProject) {
    projectName.value = ''
    switchProject(newProject.id)
  }
}

function updateProjects() {
  projects.value = projectManager.projects
}

function switchProject(id: ID) {
  projectManager.current = id
  activeId.value = projectManager.getCurrent().id
}

onMounted(() => {
  projectManager.addEventListener('update', updateProjects)
  onUnmounted(() => projectManager.removeEventListener('update', updateProjects))
})
</script>

<template>
  <ul class="item-list p-0">
    <li v-for="project in projects" :key="project.id" class="item py-2">
      <div class="d-flex justify-content-between container-fluid align-items-center">
        <div>
          <span
            v-tooltip
            class="fs-5"
            :class="{ active: activeId === project.id }"
            data-bs-placement="right"
            data-bs-title="Cliquer pour sélectionner"
            style="cursor: pointer"
            @click="switchProject(project.id)"
          >
            {{ project.name }}
            <NoteIcon :text="project.note" :unpaded="true" />
          </span>
        </div>
        <div class="text-nowrap">
          <Note :item="project" @update="note => projectManager.update({ id: project.id, note })" />
          <img
            v-tooltip="{ disposeOnClick: true }"
            alt="Supprimer"
            class="icon-container-small icon-hoverable ms-2"
            data-bs-title="Supprimer des projets"
            src="@/assets/icons/cross.png"
            @click="projectManager.delete(project.id)"
          >
        </div>
      </div>
      <div class="container-fluid">
        <small class="d-block">
          Création: {{ sexyDate(project.createdAt, false) }}
        </small>
        <small class="d-block">
          Mis à jour: {{ sexyDate(project.updatedAt, false) }}
        </small>
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
      class="btn btn-secondary btn-sm"
      :disabled="!projectName"
      type="button"
      @click="projectCreate"
    >
      Créer
    </button>
  </div>
</template>