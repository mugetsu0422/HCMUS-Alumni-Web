'use client'

import React from 'react'
import {
  Navbar,
  Collapse,
} from '@material-tailwind/react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'react-bootstrap-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

// nav list component
const navListItems = [
  {
    label: 'Về chúng tôi',
    subMenu: [
      { title: 'Nhà trường' },
      { title: 'AlumVerse' },
      { title: 'Cựu sinh viên tiêu biểu' },
    ],
  },
  {
    label: 'Tin tức & Sự kiện',
    subMenu: null,
  },
  {
    label: 'Tư vấn',
    subMenu: null,
  },
]

function NavList() {
  return (
    <ul className="mt-2 mb-4 ml-3 lg:ml-5 flex flex-col gap-3 lg:gap-6 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, subMenu }) => (
        <div className="group cursor-pointer lg:py-3" key={label}>
          {subMenu ? (
            <>
              <div className="text-[var(--text)] font-bold group-hover:text-[var(--blue-02)] flex items-center gap-2">
                {label}
                <ChevronDown className="group-hover:rotate-180" />
              </div>
              <div className="w-[fit] px-5 py-3 ml-3 lg:ml-0 hidden group-hover:flex lg:absolute  flex-col gap-3 bg-white rounded-xl font-medium translate-y-1 border-2 border-[var(--blue-02)]">
                {subMenu.map(({ title }) => (
                  <Link
                    key={title}
                    className="text-[var(--text)] hover:text-[var(--blue-02)]"
                    href={'#'}>
                    {title}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Link
              href="#"
              className="text-[var(--text)] font-bold group-hover:text-[var(--blue-02)] flex items-center gap-2">
              {label}
            </Link>
          )}
        </div>
      ))}
    </ul>
  )
}

export default function MyNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false)

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur)

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setIsNavOpen(false) // 960 = lg (tailwind)
    )
  }, [])

  return (
    <Navbar
      placeholder={undefined}
      fullWidth={true}
      className="px-3 lg:pl-6 py-4 lg:py-0">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Link href="/">
          <Image
            className="hidden lg:block"
            src="/logo-square.svg"
            alt="log"
            width={80}
            height={80}
          />
        </Link>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <FontAwesomeIcon
          onClick={toggleIsNavOpen}
          className="mr-auto lg:hidden text-[var(--blue-02)] text-2xl"
          icon={faBars}
        />

        <div className="lg:ml-auto flex gap-2 sm:gap-5 lg:pr-6">
          <Link
            href={'/signup'}
            className="text-[var(--blue-02)] text-center text-sm sm:text-base sm:w-[7.25rem] py-2 px-3 sm:px-0 border-2 border-[var(--blue-02)] rounded-xl font-bold hover:bg-[var(--blue-05-10)]">
            Đăng ký
          </Link>
          <Link
            href={'/signin'}
            className="bg-[var(--blue-02)] text-white text-center text-sm sm:text-base sm:w-[7.25rem] py-2 px-3 sm:px-0 rounded-xl font-bold hover:opacity-90">
            Đăng nhập
          </Link>
        </div>
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList />
      </Collapse>
    </Navbar>
  )
}
