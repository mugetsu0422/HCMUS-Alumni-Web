// 'use client'
import './globals.css'
import { inter } from './ui/fonts'
import ClientApplication from './../config/ClientApplication'

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
        <ClientApplication>{children}</ClientApplication>
      </body>
    </html>
  )
}
