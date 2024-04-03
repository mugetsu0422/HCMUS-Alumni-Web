'use client'
import React from 'react'
import { Card, Button } from '@material-tailwind/react'
import Link from 'next/link'
import Image from 'next/image'
import { nunito } from '../../ui/fonts'
import { useDispatch } from 'react-redux'
import getDataFromCard from './newsSclice'
import { Trash3, Eye, EyeSlash } from 'react-bootstrap-icons'

export function CardNews({ name, imgSrc, isShow }) {
  const dispatch = useDispatch()
  function handleClick() {
    dispatch(getDataFromCard(name, imgSrc))
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
