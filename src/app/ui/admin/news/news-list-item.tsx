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
import {
  Trash3,
  Eye,
  EyeSlash,
  PencilSquare,
  CalendarCheck,
} from 'react-bootstrap-icons'
import Image from 'next/image'
import moment from 'moment'
import axios from 'axios'
import { JWT_COOKIE, POST_STATUS } from '../../../constant'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'

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
          onClick={handleOpen}
          className="mr-1 bg-[--delete-filter] text-black">
          Hủy
        </Button>
        <Button
          placeholder={undefined}
          className="mr-1 bg-[--delete]"
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
          onClick={handleOpen}
          className="mr-1 bg-[--delete-filter] text-black">
          Hủy
        </Button>
        <Button
          placeholder={undefined}
          className="mr-1 bg-[--delete]"
          onClick={() => {
            onHideOrShow(id, statusId)
            handleOpen()
          }}>
          {header}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function NewsListItem({
  name,
  imgSrc,
  status,
  views,
  publishedAt,
  id,
  faculty,
  tags,
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openShow, setOpenShow] = React.useState(false)
  const [isDeleted, setIsDeleted] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(
    status.name === 'Ẩn' ? true : status.name === 'Bình thường' ? false : null
  )

  const handleOpenDetele = () => setOpenDelete((e) => !e)
  const handleOpenShow = () => setOpenShow((e) => !e)

  const onDelete = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${id}`, {
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${id}`,
        { id: id, statusId: statusId },
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
      className={`${nunito.className} border-2 border-t-0 gap-2 border-[--secondary] w-[1220px] m-auto items-center justify-between h-fit flex pl-2 py-2 last:rounded-b-lg`}>
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
      <div className="h-[120px] w-[180px]">
        <img
          src={imgSrc}
          alt="news image"
          className="h-full w-full object-cover object-center rounded-lg p-1 border-solid border border-black"
        />
      </div>
      <p className="h-20 w-[250px] p-2 font-[600] text-black align-middle flex items-center">
        {name}
      </p>

      <p className="w-[8rem] max-h-20 scrollbar-webkit-main overflow-y-auto text-left text-black p-2 font-[600] flex flex-col gap-1">
        {tags &&
          tags.map((tag) => {
            return <span key={tag.name}>{tag.name}</span>
          })}
      </p>

      <p className="w-[8rem] h-20 text-center text-black p-2 font-[600] flex items-center justify-center">
        {faculty ? faculty.name : 'Tất cả'}
      </p>
      <p className="w-[8rem] h-20 text-center text-black p-2 font-[600] flex items-center justify-center">
        {moment(publishedAt).local().format('DD/MM/YYYY HH:mm:ss')}
      </p>
      <p className="w-[7.5rem] h-20 text-center text-black p-2 font-[600] flex items-center justify-center">
        {views}
      </p>
      <div className="flex justify-end px-2">
        <Link href={`/admin/news/${id}`}>
          <Button variant="text" placeholder={undefined} className="px-4">
            <PencilSquare className="text-2xl text-[--blue-05]" />
          </Button>
        </Link>
        <Button
          variant="text"
          onClick={handleOpenDetele}
          placeholder={undefined}
          className="px-4">
          <Trash3 className="text-2xl text-[--delete]" />
        </Button>
        <DeleteDialog
          id={id}
          open={openDelete}
          handleOpen={handleOpenDetele}
          onDelete={onDelete}
        />

        {status.name === 'Chờ' ? (
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
          id={id}
          open={openShow}
          handleOpen={handleOpenShow}
          isHidden={isHidden}
          onHideOrShow={onHideOrShow}
        />
      </div>
    </div>
  )
}
