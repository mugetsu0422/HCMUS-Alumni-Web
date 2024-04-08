// 'use client'
import './globals.css'
import { inter } from './ui/fonts'
import StoreProvider from './../lib/store-provider'
// import { store } from '../lib/store'
// import { Provider } from 'react-redux'

export const metadata = {
  title: {
    template: '%s | Alumverse',
    default: 'Alumverse',
  },
  description: 'Alumverse',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} overflow-x-auto scrollbar-webkit-main`}>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
