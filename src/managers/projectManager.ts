import BrowserStorage, { StorageKey } from '@/browserStorage'
import Project from '@/project'
import type { ID } from '@/types'

/**
 * Manages project creation, deletion, updates, and storage.
 * Extends EventTarget to dispatch events on state changes (update, switchProject).
 * @class
 */
class ProjectManager extends EventTarget {
  #currentIdStorage: BrowserStorage
  #projects: Map<ID, Project>
  #projectsStorage: BrowserStorage

  constructor() {
    super()
    this.#currentIdStorage = new BrowserStorage(sessionStorage, StorageKey.CurrentProjectId)
    this.#projectsStorage = new BrowserStorage(localStorage, StorageKey.Projects)
    this.#projects = new Map()
  }

  /**
   * Creates a new project with a specified name and stores it.
   *
   * @param name - The name of the project to create.
   */
  create(name: string) : void {
    const trimmedName = name.trim()

    if (!trimmedName) return

    const project = new Project({ name })

    this.#projects.set(project.id, project)
    this.#save()
  }

  /**
   * Sets the current active project by its ID and dispatches a "switchProject" event.
   *
   * @param id - The ID of the project to set as current.
   */
  set current(id: ID) {
    if (this.#currentIdStorage.get() === id) return
    if (!this.#projects.has(id)) return

    this.#currentIdStorage.set(id)
    this.dispatchEvent(new Event('switchProject'))
  }

  /**
   * Deletes a project by its ID and saves the updated state.
   *
   * @param {ID} id - The ID of the project to delete.
   */
  delete(id: ID) : void {
    this.#projects.delete(id)
    this.#save()
  }

  /**
   * Clears all projects and saves the updated state.
   */
  empty() : void {
    this.#projects.clear()
    this.#save()
  }

  /**
   * Retrieves the current project or creates a new one if none is set.
   *
   * @return The current project instance.
   */
  getCurrent() : Project {
    const id = this.#currentIdStorage.get() as ID

    if (!id || !this.#projects.has(id)) {
      const project = new Project()
      this.#currentIdStorage.set(project.id)
      this.#projects.set(project.id, project)
      return project
    }
    return this.#projects.get(id) as Project
  }

  /**
   * Loads projects from storage into the internal projects Map.
   */
  load() : void {
    this.#projects.clear()
    const stringifiedProjects = this.#projectsStorage.get('[]')
    JSON.parse(stringifiedProjects).forEach((project: Project) => {
      this.#projects.set(project.id, new Project(project))
    })
  }

  /**
   * Gets an array of all projects currently stored.
   *
   * @return An array of all Project instances.
   */
  get projects() : Project[] {
    return [...this.#projects.values()]
  }

  /**
   * Saves all projects to storage and dispatches an "update" event.
   */
  #save() : void {
    const projects = [...this.#projects.values()]
    this.#projectsStorage.set(JSON.stringify(projects))
    this.dispatchEvent(new CustomEvent('update', { detail: projects }))
  }

  /**
   * Updates a specified project with new data and saves the updated state.
   *
   * @param updates - The project updates, including the project ID.
   */
  update(updates: Partial<Project> & { id: ID }) : void {
    const project = this.#projects.get(updates.id)

    if (project) {
      this.#projects.set(project.id, Object.assign(project, updates))
      this.#save()
    }
  }
}

export default new ProjectManager()
export type { ProjectManager }