'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  Navbar,
  Collapse,
  Badge,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from '@material-tailwind/react'
import Image from 'next/image'
import Link from 'next/link'
import { ChatDotsFill, ChevronDown, ChevronUp } from 'react-bootstrap-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faRightFromBracket,
  faNewspaper,
  faCalendarDays,
  faCertificate,
  faUser,
  faCircleUser,
} from '@fortawesome/free-solid-svg-icons'
import NotificationPopover from '@/app/ui/common/notification-popover'
import { inter } from '@/app/ui/fonts'
import { useAppSelector } from '@/lib/hooks'
import AvatarUser from '../../common/avatar-user'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import NavbarSkeleton from '../../common/navbar-skeleton'

const NavbarContext = createContext(null)

// nav list component
const navListItems = [
  {
    label: 'Tài khoản',
    subMenu: [
      { title: 'Quản lý vai trò', link: '/admin/roles' },
      { title: 'Quản lý tài khoản', link: '/admin/users' },
      {
        title: 'Xét duyệt cựu sinh viên',
        link: '/admin/alumni-verification/pending',
        subMenu: [
          {
            title: 'Chưa xét duyệt',
            link: '/admin/alumni-verification/pending',
          },
          {
            title: 'Đã xét duyệt',
            link: '/admin/alumni-verification/resolved',
          },
        ],
      },
    ],
    icon: faUser,
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
]

function NavListMenu({ label, icon, navListMenuItems }) {
  const { isNavOpen, toggleIsNavOpen } = useContext(NavbarContext)
  const [isMobile, setIsMobile] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openSubMenuWeb, setOpenSubMenuWeb] = useState(false)
  const [openSubMenuMobile, setOpenSubMenuMobile] = useState(false)

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => (window.innerWidth >= 960 ? setIsMobile(false) : setIsMobile(true)) // 960 = lg (tailwind)
    )
  }, [isMobile])

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
              onClick={() => {
                if (isNavOpen) toggleIsNavOpen()
              }}
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
                onClick={() => {
                  if (isNavOpen) toggleIsNavOpen()
                }}
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
        <Link onClick={toggleIsNavOpen} href={link} key={title}>
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
  const { isNavOpen, toggleIsNavOpen } = useContext(NavbarContext)

  return (
    <ul className="mt-2 mb-4 ml-3 lg:ml-5 flex flex-col lg:mb-0 lg:mt-0 lg:flex-row lg:items-center  ">
      {navListItems.map(({ label, subMenu, icon, link }, idx) => (
        <li className={`group cursor-pointer lg:py-3`} key={label}>
          {subMenu ? (
            <NavListMenu label={label} icon={icon} navListMenuItems={subMenu} />
          ) : (
            <Link
              onClick={() => {
                if (isNavOpen) toggleIsNavOpen()
              }}
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

function AdminNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false)
  const { unreadInboxSet } = useAppSelector((state) => state.inboxManager)
  const userId = Cookies.get('userId')
  const [userAvatar, setUserAvatar] = React.useState('')

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur)

  const router = useRouter()

  const handleLogout = () => {
    // Clear the cookies
    Cookies.remove('userId')
    Cookies.remove('jwt')
    Cookies.remove('permissions')

    // Redirect to sign-in page
    router.push('/signin')
  }

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setIsNavOpen(false) // 960 = lg (tailwind)
    )
  }, [isNavOpen])

  return (
    <NavbarContext.Provider
      value={{
        toggleIsNavOpen,
        isNavOpen,
      }}>
      <Navbar
        placeholder={undefined}
        fullWidth={true}
        className={`sticky top-0 z-[999] px-3 lg:pl-6 py-5 lg:py-0 shadow`}>
        <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
          <Link href="/admin">
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
          <div className="lg:ml-auto flex sm:gap-4 lg:pr-6">
            <NotificationPopover />
            <Link href={`/messages/inbox`} className="group">
              <Button
                placeholder={undefined}
                className="h-full w-full"
                variant="text"
                size="sm">
                <Badge
                  invisible={!unreadInboxSet.length}
                  content={unreadInboxSet.length}
                  className="bg-[var(--blue-05)]">
                  <div className="h-[24px] w-[24px]">
                    <ChatDotsFill className="h-full w-full text-[--text-navbar] group-hover:text-[--blue-05]" />
                  </div>
                </Badge>
              </Button>
            </Link>

            {/* Avatar dropdown */}
            <Menu>
              <MenuHandler>
                <Button
                  placeholder={undefined}
                  variant="text"
                  size="sm"
                  className="p-0 rounded-full">
                  <AvatarUser />
                </Button>
              </MenuHandler>
              <MenuList placeholder={undefined} className="text-base">
                <MenuItem placeholder={undefined} className="group">
                  <Link
                    href={`/profile/${userId}/about`}
                    className="flex items-center gap-2 text-[--text-navbar] group-hover:text-[--blue-05]">
                    <span className="w-[25px]">
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        className="text-xl"
                      />
                    </span>
                    Trang cá nhân
                  </Link>
                </MenuItem>

                <MenuItem placeholder={undefined} className="group">
                  <Link
                    href={`/home-page`}
                    className="flex items-center gap-2 text-[--text-navbar] group-hover:text-[--blue-05]">
                    <span className="w-[25px]">
                      <FontAwesomeIcon icon={faUser} className="text-xl" />
                    </span>
                    Người dùng
                  </Link>
                </MenuItem>

                <MenuItem
                  placeholder={undefined}
                  className="flex items-center gap-2 text-[--text-navbar] hover:!text-[--blue-05]"
                  onClick={handleLogout}>
                  <span className="w-[25px]">
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="text-xl"
                    />
                  </span>
                  Đăng xuất
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
        <Collapse
          open={isNavOpen}
          className="overflow-scroll overflow-x-hidden scrollbar-webkit">
          <NavList />
        </Collapse>
      </Navbar>
    </NavbarContext.Provider>
  )
}

export default function MyNavbar() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) return <NavbarSkeleton />
  else return <AdminNavbar />
}
