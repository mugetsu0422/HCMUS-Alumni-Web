import Image from 'next/image'
import Link from 'next/link'

export default function RootLayout({ children }) {
  return (
    <div className="flex justify-between flex-col sm:flex-row h-screen">
      <Link href={'/'}>
        <Image
          className="sm:absolute sm:left-10 sm:top-4 "
          alt="Alumni Logo"
          src="/logo-square.png"
          width={125}
          height={125}
          priority
        />
      </Link>
      {children}
      <div className="xl:flex w-full md:w-[48%] hidden  ">
        <Image
          className="md:h-[100%] brightness-75 blur-sm md:m-auto "
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
