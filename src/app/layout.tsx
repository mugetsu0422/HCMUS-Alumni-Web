// 'use client'
import './globals.css'
import FirebaseForeground from '@/config/notification/firebase-foreground'
import { inter } from './ui/fonts'
import StoreProvider from '@/config/store-provider'
import Socket from '@/config/socket/socket'
import CustomToaster from '@/app/ui/common/custom-toaster'
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false /* eslint-disable import/first */

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
