import { Navbar } from '@material-tailwind/react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

export default function NavbarSkeleton() {
  return (
    <Navbar
      placeholder={undefined}
      fullWidth={true}
      className={`sticky top-0 z-[999] px-3 lg:pl-6 py-5 lg:py-0 shadow`}>
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Link href="/home-page">
          <Image
            className="hidden lg:block"
            src="/logo-square.png"
            alt="log"
            width={80}
            height={80}
          />
        </Link>
      </div>
    </Navbar>
  )
}
