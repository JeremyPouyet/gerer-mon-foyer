import { ref, type Ref } from 'vue'
import type { ID } from './types'
import { newId } from './helpers'

export enum NotificationType {
  Success = 'success',
  Error = 'error'
}
export interface Notification {
  type: NotificationType,
  text: string
}

export default new class NotificationManager {
  /**
   * Reactive collection of notifications.
   * The key is the notification's unique ID, and the value is the Notification object.
   */
  readonly notifications: Ref<Map<ID, Notification>> = ref(new Map())

  /**
   * Creates and adds a new notification to the collection.
   *
   * @param text - The content of the notification.
   * @param type - The type of notification (Success, Error).
   */
  create(text: string, type: NotificationType) : void {
    this.notifications.value.set(newId(), { text, type })
  }

  /**
   * Deletes a notification by its ID.
   *
   * @param id - The unique ID of the notification to remove.
   */
  delete(id: ID) {
    this.notifications.value.delete(id)
  }
}
