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

export default function HofListItem({
  id,
  title,
  beginning_year,
  thumbnail,
  faculty,
  views,
  status,
}) {
  const [openDelete, setOpenDelete] = React.useState(false)
  const [openShow, setOpenShow] = React.useState(false)
  const [isDeleted, setIsDeleted] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(
    status.name === 'Ẩn' ? true : status.name === 'Bình thường' ? false : null
  )

  const handleOpenDetele = () => setOpenDelete((e) => !e)
  const handleOpenShow = () => setOpenShow((e) => !e)

  const router = useRouter()
  function handleEdit(id: string) {
    router.push(`/admin/hof/${id}`)
  }

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
        if (isHidden) {
          toast.success('Hiển thị thất bại')
        } else {
          toast.success('Ẩn thất bại')
        }
      })
  }

  if (isDeleted) return null
  return (
    <div
      className={`${nunito.className} border-2 border-t-0 gap-2 border-[--blue-02] w-[1184px] m-auto items-center justify-between h-fit flex pl-6 py-2`}>
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
        src={thumbnail}
        alt="hall of fame image"
        className="h-[200px] w-[300px] object-cover object-center"
      />
      <p className="text-lg h-20 bg-red-200 w-[320px]  p-2 font-[600] text-black  justify-center flex items-center">
        {title}
      </p>
      <p className="text-lg w-[10rem] bg-red-300 text-center text-black p-2 font-[600] flex items-center justify-center">
        {faculty}
      </p>
      <p className="text-lg w-[8rem] bg-red-400  text-center text-black p-2 font-[600] flex items-center justify-center">
        {beginning_year}
      </p>
      <p className="text-lg w-[7.5rem] bg-red-500  text-center text-black p-2 font-[600] flex items-center justify-center">
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
        {/* <DeleteDialog
            id={id}
            open={openDelete}
            handleOpen={handleOpenDetele}
            onDelete={onDelete}
          />
   */}
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

        {/* <HideOrShowDialog
            id={id}
            open={openShow}
            handleOpen={handleOpenShow}
            isHidden={isHidden}
            onHideOrShow={onHideOrShow}
          /> */}
      </div>
    </div>
  )
}
