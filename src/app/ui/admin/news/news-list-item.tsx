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
import { getDataFromCard } from '../../../admin/news/newsSclice'
import { Trash3, Eye, EyeSlash, PencilSquare } from 'react-bootstrap-icons'
import { useAppDispatch } from '../../../../lib/hook'
import Image from 'next/image'
import moment from 'moment'

function DialogComfirm({ id, open, handleOpen, title, noti }) {
  function handleClick() {
    console.log({ id })
  }

  return (
    <Dialog placeholder={undefined} size="xs" open={open} handler={handleOpen}>
      <DialogHeader placeholder={undefined}>{title}</DialogHeader>
      <DialogBody placeholder={undefined}>{noti}</DialogBody>
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
          onClick={handleOpen}>
          <span>Xác nhận</span>
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
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openShow, setOpenShow] = React.useState(false)

  const handleOpenDetele = () => setOpenDelete((e) => !e)
  const handleOpenShow = () => setOpenShow((e) => !e)

  const router = useRouter()
  function handleEdit() {
    router.push('news/edit')
  }

  const formatedPublishedAt = moment(publishedAt).format("DD/MM/YYYY HH:mm:ss")

  return (
    <div
      className={`${nunito.className} border-2 border-t-0 gap-2 border-[--blue-02] w-[1184px] m-auto items-center justify-between h-fit flex pl-6 py-2`}>
      <img
        src={imgSrc}
        alt="news image"
        className="h-[200px] w-[300px] object-cover object-center"
      />
      <p className="h-20 w-[500px] p-2 font-[600] text-black align-middle flex items-center">
        {name}
      </p>
      <p className="w-[8rem] text-center text-black p-2 font-[600] flex items-center justify-center">
        {moment(publishedAt).local().format("DD/MM/YYYY HH:mm:ss")}
      </p>
      <p className="w-[7.5rem] text-center text-black p-2 font-[600] flex items-center justify-center">
        {views}
      </p>
      <div className="flex justify-end px-2">
        <Button
          variant="text"
          onClick={handleEdit}
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
        <DialogComfirm
          id={id}
          open={openDelete}
          handleOpen={handleOpenDetele}
          title={'Xác nhận xóa'}
          noti={'Bạn có chắc chắn muốn xóa.'}
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
        <DialogComfirm
          id={id}
          open={openShow}
          handleOpen={handleOpenShow}
          title={status.name === 'Ẩn' ? 'Xác nhận hiện' : 'Xác nhận ẩn'}
          noti={
            status.name === 'Ẩn'
              ? 'Bạn có chắc chắn muốn hiện tin tức'
              : 'Bạn có chắc chắn muốnn ẩn tin tức'
          }
        />
      </div>
    </div>
  )
}
