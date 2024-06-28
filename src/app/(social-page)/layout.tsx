import '../globals.css'
import Navbar from '../ui/social-page/navbar'

export default function RootLayout({ children }) {
  return (
    <div className="flex flex-col">
      <div className="relative">
        <Navbar />
      </div>
      <main className="relative ">{children}</main>
    </div>
  )
}
