import notificationManager from '@/managers/notificationManager'
import unsavedManager from './managers/unsavedManager'

export enum StorageKey {
  CurrentHistoryDate = 'currentHistoryDate',  // CUrrently shown history sample
  CurrentProjectId = 'currentProjectId',      // Currently edited/seen project
  History = 'history',                        // History samples
  Projects = 'projects',                      // projects list
  Settings = 'settings',                      // Settings
  SimulatorValue = 'simulatorValue',          // Simple simulator current value
  Users = 'users'                             // Users
}

export default class BrowserStorage {
  /** Memory storage instance (e.g., localStorage or sessionStorage) */
  #memory: Storage

  /** Key used to store and retrieve data */
  #key: string

  constructor(memory: Storage, key: StorageKey) {
    this.#memory = memory
    this.#key = key
  }

  /**
   * Retrieves the stored value for the key, or returns a default value if not found.
   *
   * @param missing - The default value to return if the key does not exist in storage.
   * @return The stored value or the provided default value.
   */
  get(missing = '') {
    return this.#memory.getItem(this.#key) || missing
  }

  /**
   * Stores a new value for the key.
   *
   * @param value - The value to store.
   */
  set(value: string) {
    try {
      this.#memory.setItem(this.#key, value)
      if (this.#memory === localStorage)
        unsavedManager.increment()
    } catch {
      notificationManager.error('Plus de mémoire… Merci d’envoyer un mail à contact@gerer-mon-foyer.fr avec votre sauvegarde.')
    }
  }
}