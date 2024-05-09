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
  faComments,
  faNewspaper,
  faCalendarDays,
  faCertificate,
  faBell,
  faMagnifyingGlass,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'

// nav list component
const navListItems = [
  {
    label: 'Tin tức',
    icon: faNewspaper,
    urlLink: '/news',
  },
  {
    label: 'Sự kiện',
    icon: faCalendarDays,
    urlLink: '/events',
  },
  {
    label: 'Gương thành công',
    icon: faCertificate,
    urlLink: '/hof',
  },
  {
    label: 'Tư vấn',
    icon: faComments,
    urlLink: '/counsel',
  },
]

function NavList() {
  return (
    <ul className="mt-2 mb-4 ml-3 lg:ml-5 flex flex-col gap-3 lg:gap-6 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, icon, urlLink }) => (
        <div className="group cursor-pointer lg:py-3" key={label}>
          <Link
            href={urlLink}
            className="text-[--text-navbar] font-semibold group-hover:text-[--blue-05] flex items-center gap-2">
            <FontAwesomeIcon
              className="mr-auto text-[--text-navbar] group-hover:text-[--blue-05] text-2xl lg:block hidden"
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
      className="sticky top-0 z-10 px-3 lg:pl-10 py-4 lg:py-0 border-b-2 border-slate-700 "
      shadow={false}>
      <div className="mx-auto flex items-center justify-between text-blue-gray-900">
        <Link href="/home-page">
          <Image
            className="hidden lg:block"
            src="/logo-square.png"
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
          className="ml-5 mr-auto lg:hidden text-[--text-navbar] text-2xl"
          icon={faBars}
        />
        {/* <div className=" w-[40vw] m-auto ">
          <Input
            label="Tìm kiếm"
            crossOrigin={undefined}
            size="lg"
            className="pl-2 !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20 max-w-sm"
            labelProps={{
              className: 'pl-2 before:content-none after:content-none',
            }}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                alert(message)
              }
            }}
            type="text"
          />
        </div> */}

        <div className="lg:ml-auto flex sm:gap-4 lg:pr-6">
          {/* <Button placeholder={undefined} variant="text" size="sm">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="text-2xl text-[--text-navbar]"
            />
          </Button> */}
          <Badge content={2} color="blue">
            <Button placeholder={undefined} variant="text" size="sm">
              <FontAwesomeIcon
                icon={faBell}
                className="text-2xl text-[--text-navbar]"
              />
            </Button>
          </Badge>
          <Badge content={2} color="blue">
            <Button placeholder={undefined} variant="text" size="sm">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-2xl text-[--text-navbar]"
              />
            </Button>
          </Badge>

          <Avatar placeholder={undefined} src="/demo.jpg" alt="avatar" />
        </div>
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll flex text-left">
        <NavList />
      </Collapse>
    </Navbar>
  )
}
