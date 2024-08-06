import FirebaseForeground from '@/config/notification/firebase-foreground'
import Navbar from '../ui/social-page/navbar'

export default function RootLayout({ children }) {
  return (
    <>
      <FirebaseForeground />
      <Navbar />
      <main className="">{children}</main>
    </>
  )
}
