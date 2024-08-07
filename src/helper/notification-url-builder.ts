import { NOTIFICATION_ENTITY_TABLE, NOTIFICATION_TYPE } from '@/app/constant'

interface UserProps {
  id: number
  fullName: string
  avatarUrl: string
}

interface StatusProps {
  name: string
}

export interface NotificationProps {
  actorId: string | null // Assuming actorId can be null
  id: number
  notifier: UserProps
  actor: UserProps
  entityId: string
  entityTable: NotificationEntityTable
  notificationType: NotificationType
  createAt: string
  status: StatusProps
  notificationImageUrl: string
  notificationMessage: string
  parentId: string | null // Assuming parentId can be null
}

export type NotificationType = (typeof NOTIFICATION_TYPE)[number]
export type NotificationEntityTable = (typeof NOTIFICATION_ENTITY_TABLE)[number]
type NotificationEntityTableMapping = {
  [K in NotificationEntityTable]: string
}

export class NotificationUrlBuilder {
  private notification: NotificationProps

  constructor(notification: NotificationProps) {
    this.notification = notification
  }

  private NOTIFICATION_ENTITY_TABLE_MAPPING: NotificationEntityTableMapping = {
    friend: 'user',
    request_friend: 'user',
    comment_news: 'news',
    comment_event: 'events',
    interact_post_advise: 'counsel',
    comment_post_advise: 'counsel',
    group: 'groups',
    request_join_group: 'groups',
    interact_post_group: 'groups',
    comment_post_group: 'groups',
    message: 'messages/inbox',
  }

  public constructUrl(
    entityTable: NotificationEntityTable,
    type: NotificationType
  ): string {
    const entity = this.NOTIFICATION_ENTITY_TABLE_MAPPING[entityTable]
    switch (entity) {
      case 'user':
        return this.handleUser(entityTable, type)
      case 'news':
        return this.handleNews(entityTable, type)
      case 'events':
        return this.handleEvents(entityTable, type)
      case 'counsel':
        return this.handleCounsel(entityTable, type)
      case 'groups':
        return this.handleGroups(entityTable, type)
      case 'messages/inbox':
        return this.handleMessages(entityTable, type)
      default:
        return '#'
    }
  }

  private handleUser(
    entityTable: NotificationEntityTable,
    type: NotificationType
  ): string {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'request_friend':
          return `/friends/requests`
        case 'friend': {
          const id = this.notification.actorId || this.notification.actor.id
          return `/profile/${id}/about`
        }
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      return `#`
    } else if (type === 'DELETE') {
      switch (entityTable) {
        case 'request_friend': {
          const id = this.notification.actorId || this.notification.actor.id
          return `/profile/${id}/about`
        }
        default:
          return '#'
      }
    }
  }

  private handleNews(
    entityTable: NotificationEntityTable,
    type: NotificationType
  ): string {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'comment_news':
          return `/news/${this.notification.parentId}/comments/${this.notification.entityId}`
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      return `#`
    } else if (type === 'DELETE') {
      return `#`
    }
  }

  private handleEvents(
    entityTable: NotificationEntityTable,
    type: NotificationType
  ): string {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'comment_event':
          return `/events/${this.notification.parentId}/comments/${this.notification.entityId}`
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      return `#`
    } else if (type === 'DELETE') {
      return `#`
    }
  }

  private handleCounsel(
    entityTable: NotificationEntityTable,
    type: NotificationType
  ): string {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'interact_post_advise':
          return `/counsel/${this.notification.entityId}`
        case 'comment_post_advise':
          return `/counsel/${this.notification.parentId}/comments/${this.notification.entityId}`
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      return `#`
    } else if (type === 'DELETE') {
      return `#`
    }
  }

  private handleGroups(
    entityTable: NotificationEntityTable,
    type: NotificationType
  ): string {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'request_join_group':
          return `/groups/${this.notification.entityId}/member-requests`
        case 'interact_post_group':
          return `/groups/${this.notification.parentId}/posts/${this.notification.entityId}`
        case 'comment_post_group': {
          const [postId, groupId] = this.notification.parentId.split(',')
          return `/groups/${groupId}/posts/${postId}/comments/${this.notification.entityId}`
        }
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      switch (entityTable) {
        case 'group':
        case 'request_join_group':
          return `/groups/${this.notification.entityId}`
      }
    } else if (type === 'DELETE') {
      return `#`
    }
  }

  private handleMessages(
    entityTable: NotificationEntityTable,
    type: NotificationType
  ): string {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'message':
          return `/messages/inbox/${this.notification.parentId}`
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      return `#`
    } else if (type === 'DELETE') {
      return `#`
    }
  }
}
