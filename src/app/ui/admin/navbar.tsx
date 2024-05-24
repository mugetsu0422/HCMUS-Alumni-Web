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
  faBell,
  faEnvelope,
  faNewspaper,
  faUserPlus,
  faCalendarDays,
  faCertificate,
  faComments,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons'

// nav list component
const navListItems = [
  {
    label: 'Xét duyệt',
    subMenu: [
      { title: 'Chưa xét duyệt', link: '/admin/alumni-verification/pending' },
      { title: 'Đã xét duyệt', link: '/admin/alumni-verification/resolved' },
    ],
    icon: faUserPlus,
  },
  {
    label: 'Tin tức',
    subMenu: null,
    icon: faNewspaper,
    link: '/admin/news',
  },
  {
    label: 'Sự kiện',
    subMenu: null,
    icon: faCalendarDays,
    link: '/admin/events',
  },
  {
    label: 'Gương thành công',
    subMenu: null,
    icon: faCertificate,
    link: '/admin/hof',
  },
  {
    label: 'Tư vấn',
    subMenu: null,
    icon: faComments,
    link: '#',
  },
  {
    label: 'Quản lý vai trò',
    subMenu: null,
    icon: faUserPen,
    link: '/admin/roles',
  },
]

function NavList() {
  return (
    <ul className="mt-2 mb-4 ml-3 lg:ml-5 flex flex-col gap-3 lg:gap-6 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center  ">
      {navListItems.map(({ label, subMenu, icon, link }) => (
        <div className="group cursor-pointer lg:py-3" key={label}>
          {subMenu ? (
            <>
              <div className="text-[--text-navbar] font-bold group-hover:text-[--blue-05] flex items-center gap-2">
                <FontAwesomeIcon icon={icon} className="text-2xl" />
                {label}
                <ChevronDown className="group-hover:rotate-180" />
              </div>
              <div className="w-[fit] px-5 py-3 ml-3 lg:ml-0 hidden group-hover:flex lg:absolute  flex-col gap-3 bg-white rounded-xl font-medium translate-y-1 border-2 border-[var(--blue-02)]">
                {subMenu.map(({ title, link }) => (
                  <Link
                    key={title}
                    className="text-[--text-navbar] hover:text-[var(--blue-05)]"
                    href={link}>
                    {title}
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <Link
              href={link}
              className="text-[--text-navbar] font-bold group-hover:text-[var(--blue-05)] flex items-center gap-2">
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
  //const [message, setMessage] = React.useState('')

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur)

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setIsNavOpen(false) // 960 = lg (tailwind)
    )
  }, [isNavOpen])

  return (
    <Navbar
      placeholder={undefined}
      fullWidth={true}
      className="px-3 lg:pl-6 py-5 lg:py-0 ">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
        <Link href="/">
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

        <Button
          placeholder={undefined}
          onClick={toggleIsNavOpen}
          variant="text"
          className="mr-auto lg:hidden text-[var(--blue-02)] px-3 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-list w-8 h-8"
            viewBox="0 0 16 16">
            <path
              fillRule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </Button>
        {/* <FontAwesomeIcon
          onClick={toggleIsNavOpen}
          className="mr-auto lg:hidden text-[var(--blue-02)] text-2xl"
          icon={faBars}
        /> */}

        <div className="lg:ml-auto flex gap-2 sm:gap-5 lg:pr-6 items-center">
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
                className="text-2xl text-[--text-navbar] "
              />
            </Button>
          </Badge>

          <Avatar placeholder={undefined} src="/demo.jpg" alt="avatar" />
        </div>
      </div>

      <Collapse
        open={isNavOpen}
        className="overflow-scroll overflow-x-hidden scrollbar-webkit">
        <NavList />
      </Collapse>
    </Navbar>
  )
}
