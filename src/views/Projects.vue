<script setup lang="ts">
import '@/assets/secondary.scss'

import AvatarSelectorModal from '@/components/AvatarSelectorModal.vue'
import ViewTitle from '@/components/ViewTitle.vue'

import { inject, nextTick, ref } from 'vue'

import { type ID, type OpenModal, Path } from '@/types'
import { projectsAvatarList, projectsAvatars } from '@/avatars/projects'
import Project from '@/project'
import projectManager from '@/managers/projectManager'
import { sexyDate } from '@/formaters'
import { vClickOutside } from '@/directives/clickOutside'

/** Project management */
const openModal = inject<OpenModal>('openModal')
const projectName = ref('')
const projects = ref<Project[]>(projectManager.projects)

function projectCreate() : void {
  const newProject = projectManager.create(projectName.value)
  if (newProject) {
    projectName.value = ''
    refreshProjects()
  }
}

function deleteProject(project: Project) {
  openModal?.('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.', () => {
    projectManager.delete(project.id)
    refreshProjects()
  })
}

/** Avatar Modal **/
const selectedProject = ref<Project | null>(null)
const showAvatarModal = ref(false)

function openAvatarModal(project: Project) {
  selectedProject.value = project
  showAvatarModal.value = true
}

function selectAvatar(avatar: string) {
  if (selectedProject.value) {
    selectedProject.value.avatar = avatar
    projectManager.update(selectedProject.value)
  }
  cancelSelectAvatar()
}

function cancelSelectAvatar() {
  selectedProject.value = null
  showAvatarModal.value = false
}

/*** Project name ***/
const editingProjectId = ref<ID | null>(null)
const editingName = ref('')
const editingInputs = ref<Record<ID, HTMLInputElement | null>>({})
function startEditingName(user: Project) {
  editingProjectId.value = user.id
  editingName.value = user.name

  nextTick(() => editingInputs.value[user.id]?.focus())
}

function saveEditedName() {
  const standardized = editingName.value.trim().slice(0, 30)

  if (standardized && editingProjectId.value)
    projectManager.update({id: editingProjectId.value,  name: standardized })

  cancelEditName()
}

const cancelEditName = () => editingProjectId.value = null
const refreshProjects = () => projects.value = projectManager.projects
</script>

<template>
  <div class="container">
    <ViewTitle emoji="🗂️" :path="Path.Projects" />

    <!-- Add new project -->
    <label class="form-label" for="new-project">
      Nom du nouveau projet:
    </label>
    <div class="input-group mb-4">
      <input
        id="new-project"
        v-model="projectName"
        class="form-control"
        placeholder="Travaux / anniversaire / bébé / etc..."
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

    <div class="cards-container">
      <div v-for="project in projects" :key="project.id" class="d-flex card rounded-shadow project-card">
        <div class="card-body d-flex flex-column text-center p-2">
          <!-- Project image with edit button -->
          <div class="position-relative d-inline-block mb-3">
            <img :alt="`Mon projet ${project.name}`" class="user-avatar shadow-sm" :src="projectsAvatars[project.avatar]">
            <button v-tooltip="{ disposeOnClick: true }" class="btn btn-sm btn-light position-absolute bottom-0 p-1 border included" data-bs-title="Changer d’icône" @click="openAvatarModal(project)">
              <img alt="Changer son avatar" class="icon-container-small" src="@/assets/icons/pencil.png">
            </button>
          </div>

          <!-- Project name -->
          <div v-if="editingProjectId === project.id" v-click-outside="cancelEditName" class="input-group input-group-sm justify-content-center mb-3">
            <input
              :ref="el => editingInputs[project.id] = el as HTMLInputElement"
              v-model="editingName"
              class="form-control text-center name-update"
              type="text"
              @keydown.enter="saveEditedName"
              @keydown.esc="cancelEditName"
            >
            <button class="btn btn-sm btn-light border" type="button" @click="saveEditedName">
              <img alt="Sauvegarder" class="icon-container-small" src="@/assets/icons/diskette.png">
            </button>
          </div>
          <div v-else class="mb-3">
            <p class="h5 card-title mb-0 d-inline-flex align-items-center gap-2">
              {{ project.name }}
              <button v-tooltip="{ disposeOnClick: true }" class="btn btn-sm btn-light p-1 border" data-bs-title="Éditer le nom" @click="startEditingName(project)">
                <img alt="Éditer" class="icon-container-small" src="@/assets/icons/pencil.png">
              </button>
            </p>
          </div>

          <!-- Project data -->
          <p class="card-text mb-1 text-start">
            <span class="fw-bold">Créé le :</span> {{ sexyDate(project.createdAt, false) }}
          </p>
          <p class="card-text mb-1 text-start">
            <span class="fw-bold">Mis à jour :</span> {{ sexyDate(project.updatedAt, false) }}
          </p>
          <p class="card-text text-start">
            <span class="fw-bold">Note : </span>
            <span v-if="project.note">{{ project.note }}</span>
            <span v-else class="fw-light fst-italic">Aucune note pour le moment</span>
          </p>
        </div>

        <!-- Footer (stays at the bottom) -->
        <div class="d-flex justify-content-center gap-2 mb-2">
          <button class="btn btn-danger btn-sm" @click="deleteProject(project)">
            Supprimer le projet
          </button>
          <RouterLink class="btn btn-primary btn-sm" :to="`/project/${project.id}`">
            Accéder au projet
          </RouterLink>
        </div>
      </div>
    </div>

    <p v-if="projects.length === 0">
      Aucun projet pour le moment.
    </p>
  </div>

  <AvatarSelectorModal
    :avatar-list="projectsAvatarList"
    :avatars="projectsAvatars"
    :show="showAvatarModal"
    @close="cancelSelectAvatar"
    @select="selectAvatar"
  />
</template>

<style scoped>
.project-card {
  flex-direction: column;
}

.project-card .card-body {
  flex: 1 1 auto;
}
</style>