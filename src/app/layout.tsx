import './globals.css'
import { inter } from './ui/fonts'

export const metadata = {
  title: 'Alumverse',
  description: 'Alumverse',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
