import Navbar from '../ui/admin/common/navbar'

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
