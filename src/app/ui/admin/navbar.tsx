'use client'

import React from 'react'
import {
  Navbar,
  Collapse,
  Badge,
  Avatar,
  Button,
} from '@material-tailwind/react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'react-bootstrap-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faBell,
  faEnvelope,
  faHouse,
  faUserPlus,
  faCalendar,
  faUserGroup,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons'

// nav list component
const navListItems = [
  {
    label: 'Trang chủ',
    subMenu: null,
    icon: faHouse,
  },
  {
    label: 'Xét duyệt',
    subMenu: [
      { title: 'Chưa xét duyệt', link: 'alumni-verification/pending' },
      { title: 'Đã xét duyệt', link: 'alumni-verification/resolved' },
    ],
    icon: faUserPlus,
  },
  {
    label: 'Sự kiện',
    subMenu: null,
    icon: faCalendar,
  },
  {
    label: 'Gương thành công',
    subMenu: null,
    icon: faUserGroup,
  },
  {
    label: 'Tư vấn',
    subMenu: null,
    icon: faCircleQuestion,
  },
]

function NavList() {
  return (
    <ul className="mt-2 mb-4 ml-3 lg:ml-5 flex flex-col gap-3 lg:gap-6 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center  ">
      {navListItems.map(({ label, subMenu, icon }) => (
        <div className="group cursor-pointer lg:py-3" key={label}>
          {subMenu ? (
            <>
              <div className="text-[var(--text)] font-bold group-hover:text-[var(--blue-02)] flex items-center gap-2">
                <FontAwesomeIcon icon={icon} className="text-2xl" />
                {label}
                <ChevronDown className="group-hover:rotate-180" />
              </div>
              <div className="w-[fit] px-5 py-3 ml-3 lg:ml-0 hidden group-hover:flex lg:absolute  flex-col gap-3 bg-white rounded-xl font-medium translate-y-1 border-2 border-[var(--blue-02)]">
                {subMenu.map(({ title, link }) => (
                  <Link
                    key={title}
                    className="text-[var(--text)] hover:text-[var(--blue-02)]"
                    href={link}>
                    {title}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Link
              href="#"
              className="text-[var(--text)] font-bold group-hover:text-[var(--blue-02)] flex items-center gap-2">
              <FontAwesomeIcon icon={icon} className="text-2xl" />

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
      className="px-3 lg:pl-6 py-5 lg:py-0 ">
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
        {/* <div className=" w-[40vw] m-auto ">
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
        </div> */}

        <div className="lg:ml-auto flex gap-2 sm:gap-5 lg:pr-6 items-center">
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

          <Avatar placeholder={undefined} src="/demo.jpg" alt="avatar" />
        </div>
      </div>

      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList />
      </Collapse>
    </Navbar>
  )
}
