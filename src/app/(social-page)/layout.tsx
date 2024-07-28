import Navbar from '../ui/social-page/navbar'
import { Provider } from 'react-redux'

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="">
        {children}
      </main>
    </>
  )
}
