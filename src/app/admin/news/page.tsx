'use client'
import React from 'react'
import { Card, CardBody, CardFooter, Button } from '@material-tailwind/react'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { nunito } from '../../ui/fonts'

const dataTemp = [
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn a a a a a  a a a aa a a ',
    imgSrc: '/authentication.png',
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn',
    imgSrc: '/authentication.png',
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn',
    imgSrc: '/authentication.png',
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn',
    imgSrc: '/authentication.png',
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn',
    imgSrc: '/authentication.png',
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn',
    imgSrc: '/authentication.png',
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn',
    imgSrc: '/authentication.png',
  },
]

function CardNews({ name, imgSrc }) {
  // const [data, setData] = React.useState({ name: name, imgSrc }) //get data from API
  // const router = useRouter()
  // const handleClick = () => {
  //   router.push('#', data)
  // }

  return (
    <Card
      placeholder={undefined}
      className={`${nunito.className} w-96 h-[400px] bg-[var(--blue-03)]`}>
      <CardBody placeholder={undefined}>
        <Image
          src={imgSrc}
          alt="news image"
          width={384}
          height={0}
          className="h-52 object-cover object-center mb-2"
        />
        <p className="h-16">{name}</p>
      </CardBody>
      <CardFooter
        placeholder={undefined}
        className=" flex justify-between py-0">
        <Button
          //onClick={handleClick}
          placeholder={undefined}
          className="bg-[var(--blue-05)]">
          Chỉnh sửa
        </Button>
        <Button
          //onClick={handleClick}
          placeholder={undefined}
          className="bg-[var(--delete)]">
          Xóa
        </Button>
      </CardFooter>
    </Card>
  )
}

function Page() {
  return (
    <div className="flex flex-wrap sm:justify-center lg:justify-start m-auto max-w-[90%] gap-10 mt-[3vw]">
      {dataTemp.map(({ name, imgSrc }) => (
        <>
          <CardNews name={name} imgSrc={imgSrc} />
        </>
      ))}
    </div>
  )
}

export default Page
