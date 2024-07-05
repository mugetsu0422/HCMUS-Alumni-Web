'use client'

import React, { useEffect, useState } from 'react'
import {
  Navbar,
  Collapse,
  Badge,
  Avatar,
  Button,
  Popover,
  PopoverHandler,
  PopoverContent,
  MenuItem,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
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
  faUsers,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons'
import { ChatDotsFill, ChevronDown, ChevronUp } from 'react-bootstrap-icons'
import NotificationPopover from '../common/notification-popover'
import { inter } from '../fonts'

// nav list component
const navListItems = [
  {
    label: 'Tin tức',
    subMenu: null,
    icon: faNewspaper,
    link: '/news',
  },
  {
    label: 'Sự kiện',
    subMenu: null,
    icon: faCalendarDays,
    link: '/events',
  },
  {
    label: 'Gương thành công',
    subMenu: null,
    icon: faCertificate,
    link: '/hof',
  },
  {
    label: 'Tư vấn',
    subMenu: null,
    icon: faComments,
    link: '/counsel',
  },
  {
    label: 'Nhóm',
    subMenu: null,
    icon: faUsers,
    link: '/groups',
  },
  {
    label: 'Bạn bè',
    subMenu: null,
    icon: faUserGroup,
    link: '/friends',
  },
]

function NavListMenu({ label, icon, navListMenuItems }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => (window.innerWidth >= 960 ? setIsMobile(false) : setIsMobile(true)) // 960 = lg (tailwind)
    )
  }, [isMobile])

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openSubMenuWeb, setOpenSubMenuWeb] = useState(false)
  const [openSubMenuMobile, setOpenSubMenuMobile] = useState(false)

  const renderItemsForWeb = navListMenuItems.map(({ title, link, subMenu }) => {
    return subMenu ? (
      <Menu
        allowHover
        key={title}
        placement="right-start"
        open={openSubMenuWeb}
        handler={setOpenSubMenuWeb}
        offset={15}>
        <MenuHandler
          className={`${inter.className} flex items-center justify-between gap-2 text-base hover:text-[var(--blue-05)]`}>
          <MenuItem placeholder={undefined}>
            {title}
            <ChevronUp
              className={`h-3.5 w-3.5 transition-transform ${
                openSubMenuWeb ? 'rotate-90' : ''
              }`}
            />
          </MenuItem>
        </MenuHandler>
        <MenuList
          placeholder={undefined}
          className="bg-white rounded-xl border-2 border-[var(--blue-02)]">
          {subMenu.map(({ title, link }) => (
            <Link
              href={link}
              key={title}
              className="focus-visible:outline-none">
              <MenuItem
                placeholder={undefined}
                className={`${inter.className} font-medium text-base hover:text-[var(--blue-05)]`}>
                {title}
              </MenuItem>
            </Link>
          ))}
        </MenuList>
      </Menu>
    ) : (
      <Link href={link} key={title}>
        <MenuItem
          placeholder={undefined}
          className={`${inter.className} text-base hover:text-[var(--blue-05)]`}>
          {title}
        </MenuItem>
      </Link>
    )
  })
  const renderItemsForMobile = navListMenuItems.map(
    ({ title, link, subMenu }) => {
      return subMenu ? (
        <Menu
          allowHover
          key={title}
          placement="bottom-start"
          open={openSubMenuMobile}
          handler={setOpenSubMenuMobile}
          offset={15}>
          <MenuHandler
            className={`${inter.className} w-fit flex items-center justify-between gap-2 text-base hover:text-[var(--blue-05)]`}>
            <MenuItem placeholder={undefined}>
              {title}
              <ChevronUp
                className={`h-3.5 w-3.5 transition-transform ${
                  openSubMenuMobile ? 'rotate-180' : ''
                }`}
              />
            </MenuItem>
          </MenuHandler>
          <MenuList
            placeholder={undefined}
            className="bg-white rounded-xl border-2 border-[var(--blue-02)]">
            {subMenu.map(({ title, link }) => (
              <Link
                href={link}
                key={title}
                className="focus-visible:outline-none">
                <MenuItem
                  placeholder={undefined}
                  className={`${inter.className} font-medium text-base hover:text-[var(--blue-05)]`}>
                  {title}
                </MenuItem>
              </Link>
            ))}
          </MenuList>
        </Menu>
      ) : (
        <Link href={link} key={title}>
          <MenuItem
            placeholder={undefined}
            className={`${inter.className} text-base hover:text-[var(--blue-05)]`}>
            {title}
          </MenuItem>
        </Link>
      )
    }
  )

  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <div className="font-normal">
            <MenuItem
              placeholder={undefined}
              className="hidden items-center gap-2 text-[--text-navbar] hover:text-[--blue-05] font-bold text-base lg:flex lg:rounded-full">
              <FontAwesomeIcon icon={icon} className="text-2xl" />
              {label}
              <ChevronDown
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </MenuItem>
          </div>
        </MenuHandler>
        <MenuList
          placeholder={undefined}
          className="hidden w-fit lg:grid bg-white rounded-xl font-medium border-2 border-[var(--blue-02)]">
          <ul className="font-medium text-base text-[--text-navbar] focus-visible:outline-none">
            {renderItemsForWeb}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem
        placeholder={undefined}
        className="flex items-center gap-2 text-[--text-navbar] hover:text-[--blue-05] font-bold text-base lg:hidden">
        <FontAwesomeIcon icon={icon} className="text-2xl" />
        {label}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden text-[--text-navbar] font-medium text-base">
        {renderItemsForMobile}
      </ul>
    </React.Fragment>
  )
}

function NavList() {
  return (
    <ul className="mt-2 mb-4 ml-3 lg:ml-5 flex flex-col lg:mb-0 lg:mt-0 lg:flex-row lg:items-center  ">
      {navListItems.map(({ label, subMenu, icon, link }, idx) => (
        <li className={`group cursor-pointer lg:py-3`} key={label}>
          {subMenu ? (
            <NavListMenu label={label} icon={icon} navListMenuItems={subMenu} />
          ) : (
            <Link
              href={link}
              className={`text-[--text-navbar] font-bold group-hover:text-[var(--blue-05)] flex items-center gap-2`}>
              <MenuItem
                placeholder={undefined}
                className="flex items-center gap-2 text-[--text-navbar] hover:text-[--blue-05] font-bold text-base lg:rounded-full">
                <FontAwesomeIcon icon={icon} className="text-2xl" />
                {label}
              </MenuItem>
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function MyNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false)
  //const [message, setMessage] = React.useState('')

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur)

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setIsNavOpen(false) // 960 = lg (tailwind)
    )
  }, [isNavOpen])

  return (
    <Navbar
      placeholder={undefined}
      fullWidth={true}
      className={`sticky top-0 z-[999] px-3 lg:pl-6 py-5 lg:py-0 shadow`}>
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

        <div className="lg:ml-auto flex sm:gap-4 lg:pr-6">
          <NotificationPopover />

          <Button placeholder={undefined} variant="text" size="sm">
            <Link href={`messages/inbox`}>
              <Badge
                invisible={true}
                content={undefined}
                className="bg-[var(--blue-05)]">
                <div className="h-[24px] w-[24px]">
                  <ChatDotsFill className="h-full w-full text-[--text-navbar]" />
                </div>
              </Badge>
            </Link>
          </Button>

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
