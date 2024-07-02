import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

class WebSocketManager {
  constructor() {
    if (!WebSocketManager.instance) {
      this.stompClient = null
      WebSocketManager.instance = this
    }
    return WebSocketManager.instance
  }

  connect(userId, showMessage) {
    if (!this.stompClient || !this.stompClient.connected) {
      const socket = new SockJS('http://localhost:8080/ws')
      this.stompClient = Stomp.over(socket)
      this.stompClient.connect(
        {},
        (frame) => {
          console.log('Connected: ' + frame)
          this.subscribeToMessages(userId, showMessage)
        },
        (error) => {
          console.error('Error during connection: ' + error)
        }
      )
    }
  }

  subscribeToMessages(userId, showMessage) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.subscribe(`/user/${userId}/queue/messages`, (res) => {
        console.log('Received message: ' + res.body)
        showMessage(JSON.parse(res.body).message)
      })
    } else {
      console.error('Unable to subscribe, client not connected.')
    }
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected')
      })
    }
  }

  send(destination, headers = {}, message) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, headers, message)
    } else {
      console.error('Unable to send, client not connected.')
    }
  }
}

const instance = new WebSocketManager()
export default instance
