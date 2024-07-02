// // context/AuthContext.js
// import React, { createContext, useState, useEffect, useContext } from 'react'
// import SockJS from 'sockjs-client'
// import Stomp from 'stompjs'

// const AuthContext = createContext(null)

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [stompClient, setStompClient] = useState(null)

//   useEffect(() => {
//     if (user && !stompClient) {
//       connect()
//     }
//   }, [user])

//   const connect = () => {
//     var socket = new SockJS('http://localhost:8080/ws')
//     const client = Stomp.over(socket)
//     client.connect({}, function (frame) {
//       console.log('Connected: ' + frame)
//       client.subscribe(`/user/${user.id}/queue/messages`, function (res) {
//         console.log('Received message: ' + res.body)
//         //showMessage(JSON.parse(res.body).message);
//       })
//     })
//     setStompClient(client)
//   }

//   const login = (userData) => {
//     setUser(userData)
//     // Redirect to home page or other page after login
//   }

//   return (
//     <AuthContext.Provider value={{ user, login }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export const useAuth = () => useContext(AuthContext)
