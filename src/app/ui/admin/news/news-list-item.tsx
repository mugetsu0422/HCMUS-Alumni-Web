'use client'
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import { Button } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { nunito } from '../../fonts'
import { getDataFromCard } from '../../../admin/news/newsSclice'
import { Trash3, Eye, EyeSlash, PencilSquare } from 'react-bootstrap-icons'
import { useAppDispatch } from '../../../../lib/hook'
export default function NewsListItem({ name, imgSrc, isShow }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  function handleClick() {
    router.push('news/edit')
    dispatch(getDataFromCard({ name, imgSrc }))
  }

  return (
    <div
      className={`${nunito.className} border-2 border-t-0 gap-2 border-[--blue-02] w-[1184px] m-auto items-center justify-between h-fit flex pl-6 py-2`}>
      <img
        src={imgSrc}
        alt="news image"
        className="h-36 w-[300px] object-cover object-center"
      />
      <p className="h-20 w-[500px] text-left p-2 font-[600]  text-black">
        {name}
      </p>
      <p className="w-[8rem] text-center text-black p-2 font-[600] ">
        20/10/2024
      </p>
      <p className="w-[7.5rem] text-center text-black p-2 font-[600] ">
        1000000000
      </p>
      <div className="flex justify-end px-2">
        <Button
          variant="text"
          onClick={handleClick}
          placeholder={undefined}
          className="px-4">
          <PencilSquare className="text-2xl text-[--blue-05]" />
        </Button>
        <Button
          variant="text"
          //onClick={handleClick}
          placeholder={undefined}
          className="px-4">
          <Trash3 className="text-2xl text-[--delete]" />
        </Button>
        <Button
          variant="text"
          //onClick={handleClick}
          className="px-4"
          placeholder={undefined}>
          {isShow ? (
            <Eye className="text-2xl  text-black" />
          ) : (
            <EyeSlash className="text-2xl text-black" />
          )}
        </Button>
      </div>
    </div>
  )
}
