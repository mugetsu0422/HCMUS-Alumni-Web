'use client'
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react'
import { nunito } from '../../fonts'
import { Eye, PencilSquare } from 'react-bootstrap-icons'
import Image from 'next/image'
import moment from 'moment'
import axios from 'axios'
import { JWT_COOKIE, POST_STATUS } from '../../../constant'
import Cookies from 'js-cookie'
import Link from 'next/link'
import CustomToaster from '../../common/custom-toaster'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function LockAccountDialog({ openLockAccount, handleOpenLockAccount, isLock }) {
  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openLockAccount}
      handler={handleOpenLockAccount}>
      <DialogHeader placeholder={undefined}>
        {isLock ? 'Mở' : 'Khóa'} tài khoản
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn có muốn {isLock ? 'Mở' : 'Khóa'} tài khoản này
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
          placeholder={undefined}
          onClick={handleOpenLockAccount}>
          <span>Không</span>
        </Button>
        <Button
          className={`${nunito.className}  ${
            isLock ? 'bg-[--blue-05]' : 'bg-[--delete]'
          }  text-white normal-case text-md`}
          placeholder={undefined}>
          <span> {isLock ? 'Mở' : 'Khóa'}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function UserListItem({
  id,
  fullName,
  email,
  permissions,
  isLock,
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [isDeleted, setIsDeleted] = React.useState(false)
  const [openLockAccount, setOpenLockAccount] = React.useState(false)

  const handleOpenLockAccount = () => setOpenLockAccount((e) => !e)
  const handleOpenDetele = () => setOpenDelete((e) => !e)

  if (isDeleted) return null
  return (
    <div
      className={`${nunito.className} border border-t-0 gap-2 border-[#CDCDCD] w-[1000px] m-auto items-center justify-between h-fit flex pl-2 py-2 last:rounded-b-lg`}>
      <CustomToaster />
      <p className="h-fit w-[250px] p-2 font-[600] text-black align-middle flex items-center">
        {fullName}
      </p>

      <p className="w-[250px] h-fit text-left text-black p-2 font-[600] flex items-center">
        {email}
      </p>

      <div className="w-[250px] flex flex-col h-20 text-left text-black p-2 font-[600] overflow-x-auto scrollbar-webkit-main">
        {permissions.map(({ id, name }) => (
          <p key={id}>{name}</p>
        ))}
      </div>

      <div className="flex justify-end px-2">
        <Link href={`/admin/users/${id}`}>
          <Button variant="text" placeholder={undefined} className="px-4">
            <PencilSquare className="text-2xl text-[--blue-05]" />
          </Button>
        </Link>
        <Button
          variant="text"
          placeholder={undefined}
          className="px-4 w-12 flex justify-center"
          onClick={handleOpenLockAccount}>
          {isLock ? (
            <FontAwesomeIcon
              icon={faLock}
              className="text-2xl text-[--delete]"
            />
          ) : (
            <FontAwesomeIcon
              icon={faLockOpen}
              className="text-2xl text-black"
            />
          )}
        </Button>

        <LockAccountDialog
          handleOpenLockAccount={handleOpenLockAccount}
          openLockAccount={openLockAccount}
          isLock={isLock}
        />
        <Link href={`/profile/${id}/about`}>
          <Button variant="text" className="px-4" placeholder={undefined}>
            <Eye className="text-2xl  text-black" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
