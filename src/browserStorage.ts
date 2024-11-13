import notificationManager, { NotificationType } from '@/managers/notificationManager'

export enum StorageKey {
  CurrentProjectId = 'currentProjectId', // Currently edited/seen project
  Projects = 'projects', // projects list
  SimulatorTab = 'simulatorTab', // Last active tab on the simulator
  SimulatorValue = 'simulatorValue' // Simple simulator current value
}

export default class BrowserStorage {
  /** Memory storage instance (e.g., localStorage or sessionStorage) */
  readonly memory: Storage

  /** Key used to store and retrieve data */
  readonly key: string

  constructor(memory: Storage, key: StorageKey) {
    this.memory = memory
    this.key = key
  }

  /**
   * Retrieves the stored value for the key, or returns a default value if not found.
   *
   * @param missing - The default value to return if the key does not exist in storage.
   * @return The stored value or the provided default value.
   */
  get(missing = '') {
    return this.memory.getItem(this.key) || missing
  }

  /**
   * Stores a new value for the key.
   *
   * @param value - The value to store.
   */
  set(value: string) {
    try {
      this.memory.setItem(this.key, value)
    } catch {
      notificationManager.create('Plus de mémoire… Merci d’envoyer un mail à contact@gerer-mon-foyer.fr avec votre sauvegarde.', NotificationType.Error)
    }
  }
}