'use client'
import React from 'react'
import { Card, Button } from '@material-tailwind/react'
import Link from 'next/link'
import Image from 'next/image'
import { nunito } from '../../ui/fonts'
import { getDataFromCard } from './newsSclice'
import { Trash3, Eye, EyeSlash } from 'react-bootstrap-icons'
import { useAppDispatch } from '../../../lib/hook'

const dataTemp = [
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 1',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 2',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 3',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 4',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 5',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 6',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 7',
    imgSrc: '/authentication.png',
    isShow: true,
  },
]

function CardNews({ name, imgSrc, isShow }) {
  const dispatch = useAppDispatch()

  function handleClick() {
    dispatch(getDataFromCard({ name, imgSrc }))
  }

  return (
    <Card
      placeholder={undefined}
      className={`${nunito.className} w-96 h-[350px] flex flex-col`}>
      <Link href={'news/edit'} onClick={handleClick}>
        <Image
          src={imgSrc}
          alt="news image"
          width={384}
          height={0}
          className="h-52 object-cover object-center mb-2"
        />
        <p className="h-20 text-center p-2 ">{name}</p>
      </Link>
      <div className="flex justify-end px-2">
        <Button
          variant="text"
          //onClick={handleClick}
          placeholder={undefined}
          className="">
          <Trash3 className="text-2xl" />
        </Button>
        <Button
          variant="text"
          //onClick={handleClick}
          placeholder={undefined}>
          {isShow ? (
            <Eye className="text-2xl" />
          ) : (
            <EyeSlash className="text-2xl" />
          )}
        </Button>
      </div>
    </Card>
  )
}

function Page() {
  return (
    <div className="flex flex-wrap sm:justify-center lg:justify-start m-auto max-w-[90%] gap-10 mt-[3vw]">
      {dataTemp.map(({ name, imgSrc, isShow }) => (
        <>
          <CardNews name={name} imgSrc={imgSrc} isShow={isShow} key={name} />
        </>
      ))}
    </div>
  )
}

export default Page
