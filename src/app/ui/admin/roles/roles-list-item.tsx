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
import { Trash3, PencilSquare } from 'react-bootstrap-icons'
import moment from 'moment'
import axios from 'axios'
import { JWT_COOKIE } from '../../../constant'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import useHasAnyPermission from '@/hooks/use-has-any-admin-permission'

type Role = {
  id: number
  name: string
  description: string
  createAt: string
  updateAt: string
}

function DeleteDialog({ id, open, handleOpen, onDelete }) {
  return (
    <Dialog placeholder={undefined} size="xs" open={open} handler={handleOpen}>
      <DialogHeader placeholder={undefined}>Xoá</DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn có muốn xoá vai trò này?
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          placeholder={undefined}
          onClick={handleOpen}
          className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}>
          Hủy
        </Button>
        <Button
          placeholder={undefined}
          className={`${nunito.className} bg-[--delete] text-white normal-case text-md`}
          onClick={() => {
            onDelete(id)
            handleOpen()
          }}>
          Xóa
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function RolesListItem({ role }: { role: Role }) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [isDeleted, setIsDeleted] = React.useState(false)
  const hasPermissionEdit = useHasAnyPermission(
    ['User.Role.Edit'],
    Cookies.get('permissions').split(',')
  )
  const hasPermissionDelete = useHasAnyPermission(
    ['User.Role.Delete'],
    Cookies.get('permissions').split(',')
  )

  const handleOpenDetele = () => setOpenDelete((e) => !e)

  const onDelete = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_HOST}/roles/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then((res) => {
        toast.success('Xoá thành công')
        setIsDeleted(true)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  if (isDeleted) return null
  return (
    <div
      className={`${nunito.className} border border-t-0 gap-2 border-[#CDCDCD] w-[1220px] m-auto items-center justify-between h-fit flex pl-2 py-2 last:rounded-b-lg`}>
      <div className="flex">
        <p className="h-full w-[250px] p-2 font-[600] text-black align-middle flex items-center justify-start pl-[50px]">
          {role.name}
        </p>
        <p className="h-full w-[500px] text-left text-black p-2 font-[600] flex items-center justify-center">
          {role.description}
        </p>
        <p className="h-full w-[200px] text-center text-black p-2 font-[600] flex items-center justify-center">
          {moment(role.updateAt).local().format('DD/MM/YYYY')}
        </p>
      </div>
      <div className="flex justify-end px-2">
        <Button
          variant="text"
          placeholder={undefined}
          className="px-4"
          disabled={!hasPermissionEdit}>
          <Link href={`/admin/roles/${role.id}`}>
            <PencilSquare className="text-2xl text-[--blue-05]" />
          </Link>
        </Button>
        <Button
          variant="text"
          onClick={handleOpenDetele}
          placeholder={undefined}
          className="px-4"
          disabled={!hasPermissionEdit}>
          <Trash3 className="text-2xl text-[--delete]" />
        </Button>
        <DeleteDialog
          id={role.id}
          open={openDelete}
          handleOpen={handleOpenDetele}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
