// 'use client'
import './globals.css'
import FirebaseForeground from '@/config/firebase-foreground'
import { inter } from './ui/fonts'
import CustomToaster from './ui/common/custom-toaster'
import { Toaster } from 'react-hot-toast'

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
        <CustomToaster />
        <FirebaseForeground />
        {children}
      </body>
    </html>
  )
}
