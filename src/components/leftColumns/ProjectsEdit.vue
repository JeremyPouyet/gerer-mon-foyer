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
    <li v-for="project in projects" :key="project.id" aria-live="polite" class="item py-2">
      <div class="d-flex justify-content-between container-fluid align-items-center">
        <div>
          <span
            v-tooltip
            :aria-label="`Sélectionner le projet ${project.name}`"
            class="fs-5"
            :class="{ active: activeId === project.id }"
            data-bs-placement="right"
            data-bs-title="Cliquer pour sélectionner"
            role="button"
            style="cursor: pointer"
            tabindex="0"
            @click="switchProject(project.id)"
            @keydown.enter="switchProject(project.id)"
          >
            {{ project.name }}
            <NoteIcon :text="project.note" :unpaded="true" />
          </span>
        </div>
        <div class="text-nowrap">
          <Note :item="project" @update="note => projectManager.update({ id: project.id, note })" />
          <img
            v-tooltip="{ disposeOnClick: true }"
            alt="Supprimer le projet"
            :aria-label="`Supprimer ${project.name} des projets`"
            class="icon-container-small icon-hoverable ms-2"
            :data-bs-title="`Supprimer ${project.name} des projets`"
            role="button"
            src="@/assets/icons/cross.png"
            tabindex="0"
            @click="projectManager.delete(project.id)"
            @keydown.enter="projectManager.delete(project.id)"
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
      aria-label="Nom du projet"
      class="form-control"
      placeholder="Nom du projet"
      type="text"
      @keydown.enter="projectCreate"
    >
    <button
      :aria-label="`Créer le projet ${projectName}`"
      class="btn btn-secondary btn-sm"
      :disabled="!projectName"
      type="button"
      @click="projectCreate"
    >
      Créer
    </button>
  </div>
</template>