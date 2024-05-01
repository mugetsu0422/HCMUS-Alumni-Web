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
import { useRouter } from 'next/navigation'
import { nunito } from '../../fonts'
import {
  Trash3,
  Eye,
  EyeSlash,
  PencilSquare,
  CalendarCheck,
} from 'react-bootstrap-icons'
import moment from 'moment'
import axios from 'axios'
import { JWT_COOKIE, POST_STATUS } from '../../../constant'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'

function DeleteDialog({ id, open, handleOpen, onDelete }) {
  return (
    <Dialog placeholder={undefined} size="xs" open={open} handler={handleOpen}>
      <DialogHeader placeholder={undefined}>Xoá</DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn có muốn xoá tin tức này?
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          placeholder={undefined}
          color="blue-gray"
          variant="gradient"
          onClick={handleOpen}
          className="mr-1">
          <span>Hủy</span>
        </Button>
        <Button
          placeholder={undefined}
          color="red"
          className="mr-1"
          onClick={() => {
            onDelete(id)
            handleOpen()
          }}>
          <span>Xác nhận</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

function HideOrShowDialog({ id, open, handleOpen, isHidden, onHideOrShow }) {
  let header = ''
  let body = ''
  let statusId = null
  if (isHidden) {
    header = 'Hiển thị'
    body = 'Bạn có muốn hiển thị bài viết này?'
    statusId = POST_STATUS['Bình thường']
  } else {
    header = 'Ẩn'
    body = 'Bạn có muốn ẩn bài viết này'
    statusId = POST_STATUS['Ẩn']
  }

  return (
    <Dialog placeholder={undefined} size="xs" open={open} handler={handleOpen}>
      <DialogHeader placeholder={undefined}>{header}</DialogHeader>
      <DialogBody placeholder={undefined}>{body}</DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          placeholder={undefined}
          color="blue-gray"
          variant="gradient"
          onClick={handleOpen}
          className="mr-1">
          <span>Hủy</span>
        </Button>
        <Button
          placeholder={undefined}
          color="red"
          className="mr-1"
          onClick={() => {
            onHideOrShow(id, statusId)
            handleOpen()
          }}>
          <span>Xác nhận</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function HofListItem({
  hof,
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openShow, setOpenShow] = React.useState(false)
  const [isDeleted, setIsDeleted] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(
    hof.status.name === 'Ẩn' ? true : hof.status.name === 'Bình thường' ? false : null
  )

  const handleOpenDetele = () => setOpenDelete((e) => !e)
  const handleOpenShow = () => setOpenShow((e) => !e)

  const router = useRouter()
  function handleEdit(id: string) {
    router.push(`/admin/hof/${id}`)
  }

  const onDelete = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_HOST}/hof/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then((res) => {
        toast.success('Xoá thành công')
        setIsDeleted(true)
      })
      .catch((e) => {
        toast.success('Xoá thất bại')
      })
  }

  const onHideOrShow = (id, statusId) => {
    axios
      .putForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/hof/${id}`,
        { statusId: statusId },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        if (isHidden) {
          toast.success('Hiển thị thành công')
        } else {
          toast.success('Ẩn thành công')
        }
        setIsHidden(!isHidden)
      })
      .catch((e) => {
        console.error(e)
        if (isHidden) {
          toast.error('Hiển thị thất bại')
        } else {
          toast.error('Ẩn thất bại')
        }
      })
  }

  if (isDeleted) return null
  return (
    <div
      className={`${nunito.className} border-2 border-t-0 gap-2 border-[--secondary] w-[1184px] m-auto items-center justify-between h-fit flex pl-4 py-2`}>
      <Toaster
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          success: {
            style: {
              background: '#00a700',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ea7b7b',
              color: 'white',
            },
          },
        }}
      />
      <img
        src={hof.thumbnail}
        alt="hall of fame image"
        className="h-[120px] w-[180px] object-cover object-center"
      />
      <p className="text-lg h-20 w-[320px]  p-2 font-[600] text-black  justify-center flex items-center">
        {hof.title}
      </p>
      <p className="text-lg w-[10rem] text-center text-black p-2 font-[600] flex items-center justify-center">
        {hof.faculty.name}
      </p>
      <p className="text-lg w-[8rem]  text-center text-black p-2 font-[600] flex items-center justify-center">
        {hof.beginningYear}
      </p>
      <p className="text-lg w-[7.5rem]  text-center text-black p-2 font-[600] flex items-center justify-center">
        {hof.views}
      </p>
      <div className="flex justify-end px-2">
        <Button
          variant="text"
          onClick={() => handleEdit(hof.id)}
          placeholder={undefined}
          className="px-4">
          <PencilSquare className="text-2xl text-[--blue-05]" />
        </Button>
        <Button
          variant="text"
          onClick={handleOpenDetele}
          placeholder={undefined}
          className="px-4">
          <Trash3 className="text-2xl text-[--delete]" />
        </Button>
        <DeleteDialog
          id={hof.id}
          open={openDelete}
          handleOpen={handleOpenDetele}
          onDelete={onDelete}
        />

        {hof.status.name === 'Chờ' ? (
          <div className="flex justify-center items-center px-4">
            <CalendarCheck className="text-2xl text-green-800" />
          </div>
        ) : (
          <Button
            variant="text"
            onClick={handleOpenShow}
            className="px-4"
            placeholder={undefined}>
            {!isHidden ? (
              <Eye className="text-2xl  text-black" />
            ) : (
              <EyeSlash className="text-2xl text-black" />
            )}
          </Button>
        )}

        <HideOrShowDialog
          id={hof.id}
          open={openShow}
          handleOpen={handleOpenShow}
          isHidden={isHidden}
          onHideOrShow={onHideOrShow}
        />
      </div>
    </div>
  )
}
