/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import { Trash3, Eye, EyeSlash, PencilSquare } from 'react-bootstrap-icons'
import { nunito } from '../fonts'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react'
import { useRouter } from 'next/navigation'

import { JWT_COOKIE, POST_STATUS } from '../../constant'

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

function HideOrShowDialog({ id, open, handleOpen, status, onHideOrShow }) {
  let header = ''
  let body = ''
  let statusId = null
  if (status === 'Bình thường') {
    header = 'Ẩn'
    body = 'Bạn có muốn ẩn bài viết này'
    statusId = POST_STATUS['Ẩn']
  } else if (status === 'Ẩn') {
    header = 'Hiện thị'
    body = 'Bạn có muốn hiển thị bài viết này?'
    statusId = POST_STATUS['Bình thường']
  } else {
    return null
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
          // onClick={() => {
          //   onHideOrShow(id, statusId)
          //   handleOpen()
          // }}
        >
          <span>Xác nhận</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function EventsListItem({
  id,
  title,
  thumbnail,
  views,
  organizationLocation,
  organizationTime,
  status,
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openShow, setOpenShow] = React.useState(false)

  const handleOpenDetele = () => setOpenDelete((e) => !e)
  const handleOpenShow = () => setOpenShow((e) => !e)
  const onDelete = (id) => {}
  const onHideOrShow = (id, statusId) => {}

  const router = useRouter()
  function handleEdit(id: string) {
    router.push(`/admin/events/${id}`)
  }

  return (
    <div
      className={`${nunito.className} border-2 border-t-0 gap-2 border-[--blue-02] w-[1500px] m-auto items-center justify-between h-fit flex pl-6 py-2`}>
      <img
        src={thumbnail}
        alt="news image"
        className="h-[200px] w-[300px] object-cover object-center"
      />
      <p className="h-24 w-80 p-2 font-[600] text-black align-middle flex items-center">
        {title}
      </p>
      <p className="w-[8rem] text-center text-black p-2 font-[600] flex items-center justify-center">
        {organizationTime}
      </p>
      <p className="w-[20rem] text-center text-black p-2 font-[600] flex items-center justify-center">
        {organizationLocation}
      </p>
      <p className=" w-[7.5rem] text-center text-black p-2 font-[600] flex items-center justify-center">
        {views}
      </p>

      <div className="flex justify-end px-2">
        <Button
          variant="text"
          onClick={() => handleEdit(id)}
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
          id={id}
          open={openDelete}
          handleOpen={handleOpenDetele}
          onDelete={onDelete}
        />

        <Button
          variant="text"
          onClick={handleOpenShow}
          className="px-4"
          placeholder={undefined}>
          {status.name === 'Bình thường' ? (
            <Eye className="text-2xl  text-black" />
          ) : status.name === 'Ẩn' ? (
            <EyeSlash className="text-2xl text-black" />
          ) : (
            ''
          )}
        </Button>
        <HideOrShowDialog
          id={id}
          open={openShow}
          handleOpen={handleOpenShow}
          status={status.name}
          onHideOrShow={onHideOrShow}
        />
      </div>
    </div>
  )
}
