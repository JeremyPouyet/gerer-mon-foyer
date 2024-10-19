import DBSnapshot from '@/dbSnapshot'

export interface Sample {
  date: string, // ISO String
  data: string
  note?: string
}

class HistoryManager extends EventTarget {
  #_history: Sample[] = []

  /**
   * Sets the active date in the session storage.
   *
   * @param {string} date The date string to set as the current active history date.
   *                      If the value is empty, an empty string is stored.
   */
  set activeDate(date: string) {
    sessionStorage.setItem('currentHistoryDate', date || '')
  }

  /**
   * Gets the active date from the session storage.
   *
   * @returns {string | null} The currently active date from session storage or null if not set.
   */
  get activeDate() : string | null {
    return sessionStorage.getItem('currentHistoryDate')
  }

  /**
   * Retrieves the active sample based on the active date.
   *
   * @returns {Sample | undefined} The active sample associated with the current date.
   *                               Returns undefined if no sample is found.
   */
  get activeSample() : Sample | undefined {
    return this.sampleGet(this.activeDate)
  }

  /**
   * Creates a new sample and adds it to the history.
   *
   * @param {DBSnapshot} snapshot Snapshot to insert at the beginning of the history (most recent).
   *                              Also sets the active date to the date of the new sample.
   */
  create(snapshot: DBSnapshot) : void {
    const sample: Sample = { data: JSON.stringify(snapshot), date: new Date().toISOString() }
    this.#_history.unshift(sample)
    this.activeDate = sample.date
    this.dispatchUpdate()
  }

  /**
   * Deletes a sample from the history based on a given date.
   *
   * @param {string} date The date of the sample to delete.
   *                      After deletion, if the active sample is the one being deleted,
   *                      the active date is updated to the next available sample in the history.
   *                      If no samples remain, the active date is cleared.
   */
  delete(date: string) : void {
    this.findSample(date, (sample, index) => {
      this.#_history.splice(index, 1)
      this.dispatchUpdate()

      if (date !== this.activeDate) return

      if (this.#_history.length === 0) {
        this.activeDate = ''
        return
      }

      // substract 1 if the deleted sample was the last one
      this.activeDate = (this.#_history[index] || this.#_history[index - 1]).date
    })
  }

  /**
   * Removes all Sample from the history
   */
  empty() : void {
    this.#_history = []
    this.dispatchUpdate()
  }

  /**
   * Gets the entire history of samples.
   *
   * @returns {Sample[]} The array of samples representing the history.
   */
  get history() : Sample[] {
    return this.#_history
  }

  /**
   * Loads the history from localStorage and updates the history array.
   *
   * It clears the current history, parses the stored data from localStorage,
   * and pushes the new samples into the history array.
   */
  load() : void {
    this.#_history = JSON.parse(localStorage.getItem('history') ?? '[]') as Sample[]
  }

  /**
   * Gets a specific sample from the history based on a date.
   *
   * @param {string | null} [date] The date string of the history sample to retrieve.
   *                               When absent, the most recent sample (first in the array) is returned.
   * @returns {Sample | undefined} The matching sample from the history or undefined if not found.
   */
  sampleGet(date?: string | null) : Sample | undefined {
    return date ? this.findSample(date, sample => sample) : this.#_history[0]
  }

  /**
   * Updates the data of a sample based on a given date.
   *
   * @param {string} date The date of the sample to update.
   * @param {string} updates The new data to be assigned to the sample.
   */
  update(date: string, updates: Partial<Sample>) {
    this.findSample(date, sample => {
      Object.assign(sample, updates)
      this.dispatchUpdate()
    })
  }

  /**
   * Dispatches an update event to notify subscribers of changes to the history.
   */
  private dispatchUpdate() : void {
    this.dispatchEvent(new CustomEvent('update', { detail: this.#_history }))
  }

  /**
   * Finds the index of a sample in the history and performs an action based on it.
  *
  * @param {string} date The date of the sample to find.
  * @param {(sample: Sample, index: number) => T} cb A callback to execute when the sample is found.
  *                                                  It receives the sample and its index in the history.
  * @returns {T | undefined} Returns the value of the callback or undefined if the sample is not found.
  */
  private findSample<T>(date: string, cb: (sample: Sample, index: number) => T) : T | undefined {
    const index = this.#_history.findIndex(sample => sample.date === date)

    if (index !== -1) return cb(this.#_history[index], index)
  }
}

export default new HistoryManager()
export type { HistoryManager }