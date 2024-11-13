import BrowserStorage, { StorageKey } from '@/browserStorage'
import Project from '@/project'
import type { ID } from '@/types'

class ProjectManager {
  #currentIdStorage: BrowserStorage
  #projects: Map<ID, Project>
  #projectsStorage: BrowserStorage

  constructor() {
    this.#currentIdStorage = new BrowserStorage(sessionStorage, StorageKey.CurrentProjectId)
    this.#projectsStorage = new BrowserStorage(localStorage, StorageKey.Projects)
    this.#projects = new Map()
  }

  empty() : void {
    this.#projects.clear()
    this.save()
  }

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

  load() : void {
    this.#projects.clear()
    const stringifiedProjects = this.#projectsStorage.get('[]')
    JSON.parse(stringifiedProjects).forEach((project: Project) => {
      this.#projects.set(project.id, new Project(project))
    })
  }

  get projects() : Project[] {
    return [...this.#projects.values()]
  }

  save() : void {
    this.#projectsStorage.set(JSON.stringify([...this.#projects.values()]))
  }

  update(updates: Partial<Project> & { id: ID }) {
    const project = this.#projects.get(updates.id)
    if (project) {
      this.#projects.set(project.id, Object.assign(project, updates))
      this.save()
    }
  }
}

export default new ProjectManager()
export type { ProjectManager }