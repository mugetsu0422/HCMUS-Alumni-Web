importScripts(
  'https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js'
)

class NotificationUrlBuilder {
  constructor(client, notification) {
    this.client = client
    this.notification = notification
    this.NOTIFICATION_ENTITY_TABLE_MAPPING = {
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
  }

  constructUrl(entityTable, type) {
    const entity = this.NOTIFICATION_ENTITY_TABLE_MAPPING[entityTable]
    switch (entity) {
      case 'user':
        return this.client + this.handleUser(entityTable, type)
      case 'news':
        return this.client + this.handleNews(entityTable, type)
      case 'events':
        return this.client + this.handleEvents(entityTable, type)
      case 'counsel':
        return this.client + this.handleCounsel(entityTable, type)
      case 'groups':
        return this.client + this.handleGroups(entityTable, type)
      case 'messages/inbox':
        return this.handleMessages(entityTable, type)
      default:
        return '#'
    }
  }

  handleUser(entityTable, type) {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'request_friend':
          return `/friends/requests`
        case 'friend':
          return `profile/${this.notification.entityId}/about`
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      return `#`
    } else if (type === 'DELETE') {
      switch (entityTable) {
        case 'friend':
        case 'request_friend':
          return `profile/${this.notification.entityId}/about`
      }
    }
  }

  handleNews(entityTable, type) {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'comment_news':
          return `/news/${this.notification.parentId}/comments/${this.notification.entityId}`
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      return '#'
    } else if (type === 'DELETE') {
      return '#'
    }
  }

  handleEvents(entityTable, type) {
    if (type === 'CREATE') {
      switch (entityTable) {
        case 'comment_event':
          return `/events/${this.notification.parentId}/comments/${this.notification.entityId}`
        default:
          return '#'
      }
    } else if (type === 'UPDATE') {
      return '#'
    } else if (type === 'DELETE') {
      return '#'
    }
  }

  handleCounsel(entityTable, type) {
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
      return '#'
    } else if (type === 'DELETE') {
      return '#'
    }
  }

  handleGroups(entityTable, type) {
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
        default:
          return '#'
      }
    } else if (type === 'DELETE') {
      return '#'
    }
  }

  handleMessages(entityTable, type) {
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

self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search)
  self.client = urlParams.get('client')
})

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAjMk78erlhD1QURXiAcy3Cz2WhIN2Ig0A',
  authDomain: 'alumverse-23173.firebaseapp.com',
  projectId: 'alumverse-23173',
  storageBucket: 'alumverse-23173.appspot.com',
  messagingSenderId: '436562093949',
  appId: '1:436562093949:web:f0e6eba6d4b3d2f50a4e14',
}

firebase.initializeApp(firebaseConfig)

class CustomPushEvent extends Event {
  constructor(data) {
    super('push')

    Object.assign(this, data)
    this.custom = true
  }
}

/*
 * Overrides push notification data, to avoid having 'notification' key and firebase blocking
 * the message handler from being called
 */
self.addEventListener('push', (e) => {
  // Skip if event is our own custom event
  if (e.custom) return

  // Kep old event data to override
  const oldData = e.data

  // Create a new event to dispatch, pull values from notification key and put it in data key,
  // and then remove notification key
  const newEvent = new CustomPushEvent({
    data: {
      ehheh: oldData.json(),
      json() {
        const newData = oldData.json()
        newData.data = {
          ...newData.data,
          notification: newData.notification,
        }
        delete newData.notification
        return newData
      },
    },
    waitUntil: e.waitUntil.bind(e),
  })

  // Stop event propagation
  e.stopImmediatePropagation()

  // Dispatch the new wrapped event
  dispatchEvent(newEvent)
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const jsonBody = JSON.parse(payload.data.body)
  const notificationTitle = payload.data.notification.title
  const notificationOptions = {
    body: payload.data.notification.body,
    data: jsonBody,
    icon: jsonBody.notificationImageUrl,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
  const data = event.notification.data
  const notificationUrlBuilder = new NotificationUrlBuilder(self.client, data)
  const url = notificationUrlBuilder.constructUrl(
    data.entityTable,
    data.notificationType
  )

  event.notification.close()

  // Get all the Window clients
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // Check if there's a window already focused on the URL
      const alreadyFocusedWindow = clientsArr.find(
        (windowClient) => windowClient.url === url && windowClient.focus()
      )

      if (!alreadyFocusedWindow) {
        // Open a new window and attempt to focus it
        clients.openWindow(url).then((newWindowClient) => {
          if (newWindowClient) {
            newWindowClient.focus()
          }
          return Promise.resolve()
        })
      }
      return Promise.resolve()
    })
  )
})
