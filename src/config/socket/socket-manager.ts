import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

class SocketManager {
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

  public connect(userId: string, showMessage: (message: string) => void): void {
    if (!this.stompClient || !this.stompClient.connected) {
      const socket = new SockJS(`${process.env.NEXT_PUBLIC_SERVER_HOST}/ws`)
      this.stompClient = Stomp.over(socket)
      this.stompClient.debug = null
      this.stompClient.connect(
        {},
        (frame) => {
          this.subscribeToMessages(userId, showMessage)
        },
        (error) => {
          console.error('Error during connection: ' + error)
        }
      )
    }
  }

  private subscribeToMessages(
    userId: string,
    showMessage: (message: string) => void
  ): void {
    if (this.stompClient && this.stompClient.connected) {
      const topic = `/user/${userId}/queue/messages`
      if (!this.subscribedTopics.has(topic)) {
        console.log(`Subscribing to topic: ${topic}`)
        this.stompClient.subscribe(topic, (res) => {
          showMessage(JSON.parse(res.body).message)
        })
        this.subscribedTopics.add(topic)
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
        console.log('Disconnected')
        this.subscribedTopics.clear()
      })
    }
  }

  public send(destination: string, headers = {}, message: string): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, headers, message)
    } else {
      console.error('Unable to send, client not connected.')
    }
  }
}
export default SocketManager
