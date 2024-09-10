import { reactive } from 'vue'

import DBSnapshot from '@/dbSnapshot'

export interface Sample {
  date: string, // ISO String
  data: string
  note?: string
}

class HistoryManager {
  readonly history = reactive<Sample[]>([])

  /**
   * Sets the active date in the session storage.
   *
   * @param {string} date - The date string to set as the current active history date.
   *                        If the value is empty, an empty string is stored.
   */
  set activeDate(date: string) {
    sessionStorage.setItem('currentHistoryDate', date || '')
  }

  /**
   * Gets the active date from the session storage.
   *
   * @returns {string | null} - The currently active date from session storage or null if not set.
   */
  get activeDate() : string | null {
    return sessionStorage.getItem('currentHistoryDate')
  }

  /**
   * Retrieves the active sample based on the active date.
   *
   * @returns {Sample | undefined} - The active sample associated with the current date.
   *                                 Returns undefined if no sample is found.
   */
  get activeSample() : Sample | undefined {
    return this.sampleGet(this.activeDate)
  }

  /**
   * Loads the history from localStorage and updates the reactive history array.
   *
   * It clears the current history, parses the stored data from localStorage,
   * and pushes the new samples into the history array.
   */
  load() {
    this.history.splice(0)
    const samples = JSON.parse(localStorage.getItem('history') ?? '[]') as Sample[]

    this.history.push(...samples)
  }

  /**
   * Gets a specific sample from the history based on a date.
   *
   * @param {string | null} [date] - The date string of the history sample to retrieve.
   *                                 If null or undefined, returns the most recent sample (first in the array).
   * @returns {Sample | undefined} - The matching sample from the history or undefined if not found.
   */
  sampleGet(date?: string | null) : Sample | undefined {
    return date ? this.findSample(date, sample => sample) : this.history[0]
  }

  /**
   * Creates a new sample and adds it to the history.
   *
   * @param {DBSnapshot} snapshot - Snapshot to insert at the beginning of the history (most recent).
   *                                Also sets the active date to the date of the new sample.
   */
  sampleCreate(snapshot: DBSnapshot) {
    const sample: Sample = { data: JSON.stringify(snapshot), date: new Date().toISOString() }
    this.history.unshift(sample)
    this.activeDate = sample.date
  }

  /**
   * Deletes a sample from the history based on a given date.
   *
   * @param {string} date - The date of the sample to delete.
   *                        After deletion, if the active sample is the one being deleted,
   *                        the active date is updated to the next available sample in the history.
   *                        If no samples remain, the active date is cleared.
   */
  sampleDelete(date: string) : void {
    this.findSample(date, (sample, index) => {
      this.history.splice(index, 1)

      if (date !== this.activeDate) return

      if (this.history.length === 0) {
        this.activeDate = ''
        return
      }

      // substract 1 if the deleted sample was the last one
      this.activeDate = (this.history[index] || this.history[index - 1]).date
    })
  }

  /**
   * Updates the data of a sample based on a given date.
   *
   * @param {string} date - The date of the sample to update.
   * @param {string} data - The new data to be assigned to the sample.
   */
  sampleUpdate(date: string, data: string) {
    this.findSample(date, sample => sample.data = data)
  }

  /**
   * Finds the index of a sample in the history and performs an action based on it.
  *
  * @param {string} date - The date of the sample to find.
  * @param {(sample: Sample, index: number) => T} cb - A callback to execute when the sample is found.
  *                                                    It receives the sample and its index in the history.
  * @returns {T | undefined} - Returns the value of the callback or undefined if the sample is not found.
  */
  private findSample<T>(date: string, cb: (sample: Sample, index: number) => T) : T | undefined {
     const index = this.history.findIndex(sample => sample.date === date)

     if (index !== -1) return cb(this.history[index], index)
  }
}

export default new HistoryManager()
