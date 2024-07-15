// 'use client'
import './globals.css'
import FirebaseForeground from '@/config/notification/firebase-foreground'
import { inter } from './ui/fonts'
import StoreProvider from '@/config/store-provider'
import Socket from '@/config/socket/socket'
import CustomToaster from '@/app/ui/common/custom-toaster'

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
      <body className={`${inter.className} scrollbar-webkit-main`}>
        <StoreProvider>
          <CustomToaster />
          <FirebaseForeground />
          <Socket />
          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
