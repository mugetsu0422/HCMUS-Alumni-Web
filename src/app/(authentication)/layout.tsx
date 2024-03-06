import '../globals.css'
import Image from 'next/image'
import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <div className="flex items-center justify-between ">
      <Link href={'/'}>
        <Image
          className="absolute left-10 top-4 "
          alt="Alumni Logo"
          src="/logo.png"
          width={123}
          height={93}
          priority
        />
      </Link>
      {children}
      <div className="xl:flex w-full md:w-[48%] sm:hidden  ">
        <Image
          className="md:w-[100%] brightness-75 blur-sm md:m-auto "
          alt="Alumni Image"
          src="/authentication.png"
          width={950}
          height={100}
          priority
        />
      </div>
    </div>
  )
}
