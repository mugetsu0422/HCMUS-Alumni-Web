'use client'

import React from 'react'
import {
  Navbar,
  Collapse,
  Badge,
  Avatar,
  Button,
  Input,
} from '@material-tailwind/react'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faHouse,
  faUserGroup,
  faCalendarDays,
  faCertificate,
  faBell,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'

// nav list component
const navListItems = [
  {
    label: 'Trang chủ',
    icon: faHouse,
  },
  {
    label: 'Mọi người',
    icon: faUserGroup,
  },
  {
    label: 'Sự kiện',
    icon: faCalendarDays,
  },
  {
    label: 'Gương thành công',
    icon: faCertificate,
  },
]

function NavList() {
  return (
    <ul className="mt-2 mb-4 ml-3 lg:ml-5 flex flex-col gap-3 lg:gap-6 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, icon }) => (
        <div className="group cursor-pointer lg:py-3" key={label}>
          <Link
            href="#"
            className="text-[var(--text)] font-bold group-hover:text-[var(--blue-02)] flex items-center gap-2">
            <FontAwesomeIcon
              className="mr-auto text-[var(--blue-02)] text-2xl lg:block hidden"
              icon={icon}
            />
            {label}
          </Link>
        </div>
      ))}
    </ul>
  )
}

export default function MyNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')

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
        <div className=" w-[40vw] m-auto ">
          <Input
            placeholder="Tìm kiếm ..."
            crossOrigin={undefined}
            size="lg"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20 max-w-sm"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                alert(message)
              }
            }}
            type="text"
          />
        </div>
        <div className="lg:ml-auto flex gap-2 sm:gap-5 lg:pr-6">
          <Badge content={2} color="blue">
            <Button placeholder={undefined} variant="text" size="sm">
              <FontAwesomeIcon icon={faBell} className="text-2xl" />
            </Button>
          </Badge>

          <Badge content={2} color="blue">
            <Button placeholder={undefined} variant="text" size="sm">
              <FontAwesomeIcon icon={faEnvelope} className="text-2xl " />
            </Button>
          </Badge>

          <Avatar placeholder={undefined} src="/logo.png" alt="avatar" />
        </div>
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll flex text-left">
        <NavList />
      </Collapse>
    </Navbar>
  )
}
