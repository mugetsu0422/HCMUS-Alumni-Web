import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

class SocketManager {
  private userId: string
  private stompClient: Stomp.Client | null
  private subscribedTopics: Set<string>

  private static instance: SocketManager

  private constructor() {
    this.stompClient = null
    this.subscribedTopics = new Set<string>()
  }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  public connect(
    userId: string,
    showMessage: (message: any) => void,
    onConnect: () => void
  ): void {
    if (!this.stompClient || !this.stompClient.connected) {
      this.userId = userId
      const socket = new SockJS(`${process.env.NEXT_PUBLIC_SERVER_HOST}/ws`)
      this.stompClient = Stomp.over(socket)
      this.stompClient.debug = null
      this.stompClient.connect(
        {},
        (frame) => {
          this.subscribeToMessages(userId, showMessage, onConnect)
        },
        (error) => {
          console.error('Error during connection: ' + error)
        }
      )
    }
  }

  private subscribeToMessages(
    userId: string,
    showMessage: (message: any) => void,
    onConnect: () => void
  ): void {
    if (this.stompClient && this.stompClient.connected) {
      const topic = `/user/${userId}/queue/messages`
      if (!this.subscribedTopics.has(topic)) {
        this.stompClient.subscribe(topic, (res) => {
          showMessage(JSON.parse(res.body))
        })
        this.subscribedTopics.add(topic)
        onConnect()
        console.log(`Subscribed to topic successfully`)
      } else {
        console.warn(`Already subscribed to topic: ${topic}`)
      }
    } else {
      console.error('Unable to subscribe, client not connected.')
    }
  }

  public disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        this.subscribedTopics.clear()
      })
    }
  }

  public send(
    inboxId: number,
    headers = {},
    content: string,
    parentMessageId: number | null = null
  ): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        `/app/send-message/${inboxId}`,
        headers,
        JSON.stringify({
          senderId: this.userId,
          content: content,
          parentMessageId: parentMessageId,
        })
      )
    } else {
      console.error('Unable to send, client not connected.')
    }
  }

  public markAsRead(inboxId: number, lastReadMessageId: number) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(
        `/app/read-inbox/${inboxId}`,
        {},
        JSON.stringify({
          userId: this.userId,
          lastReadMessageId: lastReadMessageId,
        })
      )
    } else {
      console.error('Unable to send, client not connected.')
    }
  }
}
export default SocketManager
