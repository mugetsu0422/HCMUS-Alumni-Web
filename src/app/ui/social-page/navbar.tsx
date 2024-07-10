'use client'

import React, { useEffect } from 'react'
import {
  Navbar,
  Collapse,
  Badge,
  Avatar,
  Button,
  MenuItem,
  Menu,
  MenuHandler,
  MenuList,
  Typography,
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
  faUsers,
  faRightFromBracket,
  faCircleUser,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons'
import { ChatDotsFill } from 'react-bootstrap-icons'
import NotificationPopover from '../common/notification-popover'
import Cookies from 'js-cookie'
import axios from 'axios'
import { JWT_COOKIE } from '@/app/constant'
import { useRouter } from 'next/navigation'

// nav list component
const navListItems = [
  {
    label: 'Tin tức',
    icon: faNewspaper,
    link: '/news',
  },
  {
    label: 'Sự kiện',
    icon: faCalendarDays,
    link: '/events',
  },
  {
    label: 'Gương thành công',
    icon: faCertificate,
    link: '/hof',
  },
  {
    label: 'Tư vấn',
    icon: faComments,
    link: '/counsel',
  },
  {
    label: 'Nhóm',
    icon: faUsers,
    link: '/groups',
  },
  {
    label: 'Bạn bè',
    icon: faUserGroup,
    link: '/friends',
  },
]

function NavList() {
  return (
    <ul className="mt-2 mb-4 ml-3 lg:ml-5 flex flex-col lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {navListItems.map(({ label, icon, link }) => (
        <li className="group cursor-pointer lg:py-3" key={label}>
          <Link
            href={link}
            className="text-[--text-navbar] font-bold group-hover:text-[var(--blue-05)] flex items-center gap-2">
            <MenuItem
              placeholder={undefined}
              className="flex items-center gap-2 text-[--text-navbar] hover:text-[--blue-05] font-bold text-base lg:rounded-full">
              <FontAwesomeIcon icon={icon} className="text-2xl" />
              {label}
            </MenuItem>
          </Link>
          <Link
            href={link}
            className="text-[--text-navbar] font-bold group-hover:text-[var(--blue-05)] flex items-center gap-2">
            <MenuItem
              placeholder={undefined}
              className="flex items-center gap-2 text-[--text-navbar] hover:text-[--blue-05] font-bold text-base lg:rounded-full">
              <FontAwesomeIcon icon={icon} className="text-2xl" />
              {label}
            </MenuItem>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function MyNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false)
  const [userAvatar, setUserAvatar] = React.useState('')
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur)

  const userId = Cookies.get('userId')
  const permissions = Cookies.get('permissions')

  const router = useRouter()

  const handleLogout = () => {
    // Clear the cookies
    Cookies.remove('userId')
    Cookies.remove('jwt')
    Cookies.remove('permissions')

    // Redirect to sign-in page
    router.push('/signin')
  }

  React.useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 1150 && setIsNavOpen(false) // 960 = lg (tailwind)
    )
  }, [])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        setUserAvatar(data?.user?.avatarUrl)
        console.log(permissions)
      })
      .catch((error) => {})
  }, [])

  return (
    <Navbar
      placeholder={undefined}
      fullWidth={true}
      className="sticky top-0 z-10 px-3 lg:pl-10 py-4 lg:py-0 border-b-2 border-slate-700 h-[5.4rem] items-center"
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

          <Menu>
            <MenuHandler>
              <Button
                placeholder={undefined}
                variant="text"
                size="sm"
                className="p-0 rounded-full">
                <Avatar placeholder={undefined} src={userAvatar} alt="avatar" />
              </Button>
            </MenuHandler>
            <MenuList placeholder={undefined}>
              <MenuItem placeholder={undefined}>
                <Link
                  href={`/profile/${userId}/about`}
                  className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCircleUser} className="text-xl" />
                  Trang cá nhân
                </Link>
              </MenuItem>

              <MenuItem placeholder={undefined} onClick={handleLogout}>
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="text-xl"
                />
                Đăng xuất
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll flex text-left">
        <NavList />
      </Collapse>
    </Navbar>
  )
}
