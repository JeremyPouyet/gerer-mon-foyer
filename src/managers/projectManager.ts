import BrowserStorage, { StorageKey } from '@/browserStorage'
import Project from '@/project'
import type { ID } from '@/types'

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

  create(name: string) : void {
    const trimmedName = name.trim()

    if (!trimmedName) return

    const project = new Project({ name })

    this.#projects.set(project.id, project)
    this.save()
  }

  set current(id: ID) {
    if (this.#currentIdStorage.get() === id) return
    if (!this.#projects.has(id)) return

    this.#currentIdStorage.set(id)
    this.dispatchEvent(new Event('switchProject'))
  }

  delete(id: ID) : void {
    this.#projects.delete(id)
    this.save()
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
    const projects = [...this.#projects.values()]
    this.#projectsStorage.set(JSON.stringify(projects))
    this.dispatchEvent(new CustomEvent('update', { detail :projects }))
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