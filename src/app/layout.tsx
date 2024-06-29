// 'use client'
import './globals.css'
import FirebaseForeground from '@/config/firebase-foreground'
import { inter } from './ui/fonts'

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
        <FirebaseForeground />
        {children}
      </body>
    </html>
  )
}
