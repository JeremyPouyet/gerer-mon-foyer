import { ref, type Ref } from 'vue'
import type { ID } from '@/types'
import { newId } from '@/helpers'

export enum NotificationType {
  Success = 'success',
  Error = 'error'
}

interface Notification {
  type: NotificationType,
  text: string
}

class NotificationManager {
  /**
   * Reactive collection of notifications.
   * The key is the notification's unique ID, and the value is the Notification object.
   */
  readonly notifications: Ref<Map<ID, Notification>> = ref(new Map())

  /**
   * Creates and adds a new Error notification to the collection.
   *
   * @param text - The content of the notification.
   */
  error(text: string) : void {
    this.notifications.value.set(newId(), { text, type: NotificationType.Error })
  }

  /**
   * Deletes a notification by its ID.
   *
   * @param id - The unique ID of the notification to remove.
   */
  delete(id: ID) {
    this.notifications.value.delete(id)
  }

  /**
   * Creates and adds a new Success notification to the collection.
   *
   * @param text - The content of the notification.
   */
  success(text: string) : void {
    this.notifications.value.set(newId(), { text, type: NotificationType.Success})
  }
}

export default new NotificationManager()
export type { NotificationManager }