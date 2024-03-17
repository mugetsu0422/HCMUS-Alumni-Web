import '../globals.css'
import Navbar from '../ui/social-page/navbar'

export default function RootLayout({ children }) {
  return (
    <>
      <section>
        <Navbar />
      </section>
      <section>{children}</section>
    </>
  )
}
