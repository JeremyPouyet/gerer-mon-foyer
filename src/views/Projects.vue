<script setup lang="ts">
import '@/assets/secondary.scss'

import ViewTitle from '@/components/ViewTitle.vue'

import { inject, nextTick, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'

import { type ID, OpenModal, Path } from '@/types'
import { projectsAvatarList, projectsAvatars } from '@/avatars/projects'
import { sexyDate, sexyNumber } from '@/formaters'
import Project from '@/project'
import projectManager from '@/managers/projectManager'
import { vClickOutside } from '@/directives/clickOutside'

/** Project management */
const openModal = inject<OpenModal>('openModal')
const projectName = ref('')
const projects = ref<Project[]>(projectManager.projects)

function projectCreate() : void {
  const newProject = projectManager.create(projectName.value)
  if (newProject) {
    projectName.value = ''
    // switchProject(newProject.id)
  }
}

function deleteProject(project: Project) {
  openModal?.('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.', () => {
    projectManager.delete(project.id)
  })
}


/** Avatar Modal **/
const showAvatarModal = ref(false)
const selectedProject = ref<Project | null>(null)

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && showAvatarModal.value)
    cancelSelectAvatar()
}

onBeforeUnmount(() => document.removeEventListener('keydown', handleKeydown))

function openAvatarModal(project: Project) {
  selectedProject.value = project
  document.addEventListener('keydown', handleKeydown)
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
  document.removeEventListener('keydown', handleKeydown)
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
</script>

<template>
  <div class="container">
    <ViewTitle emoji="🗂️" :path="Path.Projects" />

    <!-- Add new project -->
    <div class="input-group mb-4">
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

    <div v-if="projects.length > 0" class="cards-container">
      <div v-for="project in projects" :key="project.id" class="card rounded-shadow h-100">
        <div class="card-body text-center py-3">
          <!-- Project image with edit button -->
          <div class="position-relative d-inline-block mb-3">
            <img :alt="`Mon projet ${project.name}`" class="user-avatar shadow-sm" :src="projectsAvatars[project.avatar]">
            <button v-tooltip="{ disposeOnClick: true }" class="btn btn-sm btn-light position-absolute bottom-0 end-0 p-1 border included" data-bs-title="Changer d’icône" @click="openAvatarModal(project)">
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
            <h5 class="card-title mb-0 d-inline-flex align-items-center gap-2">
              {{ project.name }}
              <button v-tooltip="{ disposeOnClick: true }" class="btn btn-sm btn-light p-1 border" data-bs-title="Éditer le nom" @click="startEditingName(project)">
                <img alt="Éditer" class="icon-container-small" src="@/assets/icons/pencil.png">
              </button>
            </h5>
          </div>

          <!-- Project data -->
          <p class="card-text mb-1 text-start ms-2">
            <span class="fw-bold">Créé le :</span> {{ sexyDate(project.createdAt, false) }}
          </p>
          <p class="card-text mb-1 text-start ms-2">
            <span class="fw-bold">Mis à jour :</span> {{ sexyDate(project.updatedAt, false) }}
          </p>
          <p class="card-text text-start ms-2">
            <span class="fw-bold">Note : </span>
            <span v-if="project.note">{{ project.note }}</span>
            <span v-else class="fw-light fst-italic">Aucune note pour le moment</span>
          </p>

          <!-- Actions -->
          <div class="d-flex justify-content-center gap-2">
            <img
              v-tooltip="{ disposeOnClick: true }"
              alt="Supprimer"
              :aria-label="`Supprimer ${project.name}`"
              class="icon-container-small icon-hoverable"
              :data-bs-title="`Supprimer ${project.name}`"
              role="button"
              src="@/assets/icons/cross.png"
              tabindex="0"
              @click="deleteProject(project)"
            >
            <RouterLink
              v-tooltip="{ disposeOnClick: true }"
              class="d-inline-flex align-items-center"
              :data-bs-title="`Voir le projet ${project.name}`"
              :to="`/project/${project.id}`"
            >
              <img
                :alt="`Voir le projet ${project.name}`"
                class="icon-container-small icon-hoverable"
                src="@/assets/icons/hyperlink.png"
              >
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal for selecting avatars -->
  <!-- @click.self works as the modal covers the entire screen -->
  <div v-if="showAvatarModal" class="modal fade d-block" @click.self="cancelSelectAvatar()">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Choisir mon avatar
          </h5>
          <button aria-label="Fermer" class="btn-close" type="button" @click="cancelSelectAvatar" />
        </div>
        <div class="modal-body d-flex flex-wrap gap-3 justify-content-center">
          <img
            v-for="avatar in projectsAvatarList"
            :key="avatar"
            :alt="`Avatar ${avatar}`"
            class="selectable-icon"
            loading="lazy"
            :src="projectsAvatars[avatar]"
            tabindex="0"
            @click="selectAvatar(avatar)"
          >
        </div>
      </div>
    </div>
  </div>
    <!-- <ProjectEditor :key="currentProject.id" :current-project="currentProject" /> -->
</template>