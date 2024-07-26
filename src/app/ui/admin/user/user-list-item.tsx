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
import { JWT_COOKIE, POST_STATUS, USER_GROUP_STATUS } from '../../../constant'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import toast from 'react-hot-toast'

function LockAccountDialog({
  openLockAccountDialog,
  handleOpenLockAccountDialog,
  isLock,
  handleLockAndUnlock,
}) {
  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openLockAccountDialog}
      handler={handleOpenLockAccountDialog}>
      <DialogHeader placeholder={undefined}>
        {isLock ? 'Mở khóa' : 'Khóa'} tài khoản
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn có muốn {isLock ? 'mở khóa' : 'khóa'} tài khoản này
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
          placeholder={undefined}
          onClick={handleOpenLockAccountDialog}>
          <span>Không</span>
        </Button>
        <Button
          onClick={() => handleLockAndUnlock(isLock)}
          className={`${nunito.className}  ${
            isLock ? 'bg-[--blue-05]' : 'bg-[--delete]'
          }  text-white normal-case text-md`}
          placeholder={undefined}>
          <span> {isLock ? 'Mở khóa' : 'Khóa'}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function UserListItem({ user, onLockUser, onUnlockUser }) {
  const [isLock, setIsLock] = React.useState(
    user.statusId === USER_GROUP_STATUS['Khóa']
  )
  const [openLockAccountDialog, setOpenLockAccountDialog] =
    React.useState(false)

  const handleOpenLockAccountDialog = () => setOpenLockAccountDialog((e) => !e)

  const handleLockAndUnlock = async (isLock: boolean) => {
    try {
      if (isLock) {
        await onUnlockUser(user.id)
        handleOpenLockAccountDialog()
        toast.success('Mở khóa tài khoản thành công')
        setIsLock((e) => !e)
      } else {
        await onLockUser(user.id)
        handleOpenLockAccountDialog()
        toast.success('Khóa tài khoản thành công')
        setIsLock((e) => !e)
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }

  return (
    <div
      className={`${nunito.className} border border-t-0 gap-2 border-[#CDCDCD] w-[1000px] m-auto items-center justify-between h-fit flex pl-2 py-2 last:rounded-b-lg`}>
      <p className="h-fit w-[250px] p-2 font-[600] text-black align-middle flex items-center">
        {user.fullName}
      </p>

      <p className="w-[250px] h-fit text-left text-black p-2 font-[600] flex items-center">
        {user.email}
      </p>

      <div className="w-[250px] flex flex-col h-20 text-left text-black p-2 font-[600] overflow-x-auto scrollbar-webkit-main">
        {user.roles.map(({ id, name }) => (
          <p key={id}>{name}</p>
        ))}
      </div>

      <div className="flex justify-end px-2">
        <Link href={`/admin/users/${user.id}`}>
          <Button variant="text" placeholder={undefined} className="px-4">
            <PencilSquare className="text-2xl text-[--blue-05]" />
          </Button>
        </Link>
        <Button
          variant="text"
          placeholder={undefined}
          className="px-4 w-12 flex justify-center"
          onClick={handleOpenLockAccountDialog}>
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
          handleOpenLockAccountDialog={handleOpenLockAccountDialog}
          openLockAccountDialog={openLockAccountDialog}
          isLock={isLock}
          handleLockAndUnlock={handleLockAndUnlock}
        />
        <Link href={`/profile/${user.id}/about`}>
          <Button variant="text" className="px-4" placeholder={undefined}>
            <Eye className="text-2xl  text-black" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
