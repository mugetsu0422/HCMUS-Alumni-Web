// WebSocketManager.js
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
      this.stompClient.connect({}, (frame) => {
        console.log('Connected: ' + frame)
        this.stompClient.subscribe(`/user/${userId}/queue/messages`, (res) => {
          console.log('Received message: ' + res.body)
          showMessage(JSON.parse(res.body).message)
        })
      })
    }
  }

  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect()
    }
  }

  send(destination, headers = {}, message) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, headers, message)
    }
  }
}

const instance = new WebSocketManager()

export default instance
