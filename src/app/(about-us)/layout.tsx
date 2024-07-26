
import Navbar from '../ui/landing-page/navbar'
import Footer from '../ui/landing-page/footer'

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
