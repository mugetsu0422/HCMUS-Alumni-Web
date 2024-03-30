import '../globals.css'
import Navbar from '../ui/admin/navbar'

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
