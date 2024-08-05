import FirebaseForeground from '@/config/notification/firebase-foreground'
import Navbar from '../ui/admin/common/navbar'

export default function RootLayout({ children }) {
  return (
    <>
      <FirebaseForeground />
      <Navbar />
      {children}
    </>
  )
}
