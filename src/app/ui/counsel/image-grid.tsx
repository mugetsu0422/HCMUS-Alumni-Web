'use client'

import React, { useState } from 'react'
import {
  Carousel,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from '@material-tailwind/react'
import { XLg, CaretRightFill, CaretLeftFill } from 'react-bootstrap-icons'
import { nunito } from '../fonts'
/* eslint-disable @next/next/no-img-element */

function DialogViewImage({
  openDialogViewImage,
  handleOpenDialogViewImage,
  currentImageIndex,
  pictures,
  setCurrentImageIndex,
}) {
  const handlePrevImage = () => {
    const newIndex =
      currentImageIndex === 0 ? pictures.length - 1 : currentImageIndex - 1
    setCurrentImageIndex(newIndex)
  }

  const handleNextImage = () => {
    const newIndex =
      currentImageIndex === pictures.length - 1 ? 0 : currentImageIndex + 1
    setCurrentImageIndex(newIndex)
  }

  return (
    <Dialog
      placeholder={undefined}
      open={openDialogViewImage}
      handler={handleOpenDialogViewImage}
      size="lg"
      className="max-w-[1000px] w-[80%]">
      <DialogHeader
        placeholder={undefined}
        className={`${nunito.className} sticky top-0 h-fit pb-0 pt-2 flex items-center justify-end`}>
        <Button
          onClick={handleOpenDialogViewImage}
          placeholder={undefined}
          className="rounded-full p-2"
          variant="text">
          <XLg className="text-lg" />
        </Button>
      </DialogHeader>
      <DialogBody
        placeholder={undefined}
        className={`${nunito.className} h-[40vw] min-h-[500px] overflow-y-auto scrollbar-webkit-main flex flex-col gap-4`}>
        <Carousel
          prevArrow={() => <div></div>}
          nextArrow={() => <div></div>}
          navigation={() => <div></div>}
          placeholder={undefined}>
          <div className="flex justify-between z-10 items-center w-full h-full bg-black">
            <Button
              placeholder={undefined}
              onClick={handlePrevImage}
              className="ml-6 p-4 rounded-full hover:bg-gray-400 bg-gray-100"
              variant="text">
              <CaretLeftFill className="text-xl text-black" />
            </Button>
            <div className="flex justify-center items-center h-[35vw] min-h-[350px] w-full">
              <img
                src={pictures[currentImageIndex].pictureUrl}
                alt="image post"
                className="h-full object-cover object-center"
              />
            </div>

            <Button
              placeholder={undefined}
              onClick={handleNextImage}
              className="mr-6 p-4 rounded-full hover:bg-gray-400 bg-gray-100"
              variant="text">
              <CaretRightFill className="text-xl text-black" />
            </Button>
          </div>
        </Carousel>
      </DialogBody>
    </Dialog>
  )
}

export default function ImageGird({ pictures }) {
  const [openDialogViewImage, setOpenDialogViewImage] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  function handleOpenDialogViewImage() {
    setOpenDialogViewImage((e) => !e)
  }

  const handleImageClick = (index) => {
    setCurrentImageIndex(index)
    setOpenDialogViewImage(true)
  }

  if (pictures.length <= 2) {
    const height_of_picture = 550 / pictures.length
    return (
      <>
        <div className="flex flex-col gap-1">
          {pictures.map(({ id, pictureUrl }, idx) => (
            <img
              onClick={() => handleImageClick(idx)}
              key={id}
              src={pictureUrl}
              alt="image post"
              className={`w-full h-[${height_of_picture}px] object-cover object-center hover:cursor-pointer`}
            />
          ))}
        </div>
        <DialogViewImage
          setCurrentImageIndex={setCurrentImageIndex}
          pictures={pictures}
          openDialogViewImage={openDialogViewImage}
          handleOpenDialogViewImage={handleOpenDialogViewImage}
          currentImageIndex={currentImageIndex}
        />
      </>
    )
  }

  if (pictures.length == 3) {
    return (
      <>
        <div className="flex flex-col gap-1">
          {pictures.slice(0, 1).map(({ id, pictureUrl }, idx) => (
            <img
              onClick={() => handleImageClick(idx)}
              key={id}
              src={pictureUrl}
              alt="image post"
              className={`w-full h-[275px] object-cover object-center hover:cursor-pointer`}
            />
          ))}
          <div className="flex gap-1">
            {pictures.slice(1, 3).map(({ id, pictureUrl }, idx) => (
              <img
                onClick={() => handleImageClick(idx + 1)}
                key={id}
                src={pictureUrl}
                alt="image post"
                className={`w-[50%] h-[275px] object-cover object-center hover:cursor-pointer`}
              />
            ))}
          </div>
        </div>
        <DialogViewImage
          setCurrentImageIndex={setCurrentImageIndex}
          pictures={pictures}
          openDialogViewImage={openDialogViewImage}
          handleOpenDialogViewImage={handleOpenDialogViewImage}
          currentImageIndex={currentImageIndex}
        />
      </>
    )
  }

  if (pictures.length == 4) {
    return (
      <>
        <div className="grid grid-cols-2 gap-1">
          {pictures.map(({ id, pictureUrl }, idx) => (
            <img
              onClick={() => handleImageClick(idx)}
              key={id}
              src={pictureUrl}
              alt="image post"
              className={`w-full h-[275px] object-cover object-center hover:cursor-pointer`}
            />
          ))}
        </div>
        <DialogViewImage
          setCurrentImageIndex={setCurrentImageIndex}
          pictures={pictures}
          openDialogViewImage={openDialogViewImage}
          handleOpenDialogViewImage={handleOpenDialogViewImage}
          currentImageIndex={currentImageIndex}
        />
      </>
    )
  }

  if (pictures.length == 5) {
    return (
      <>
        <div className="flex flex-col gap-1">
          <div className="grid grid-cols-2 gap-1">
            {pictures.slice(0, 2).map(({ id, pictureUrl }, idx) => (
              <img
                onClick={() => handleImageClick(idx)}
                key={id}
                src={pictureUrl}
                alt="image post"
                className={`w-full h-[275px] object-cover object-center hover:cursor-pointer`}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {pictures.slice(2, 5).map(({ id, pictureUrl }, idx) => (
              <img
                onClick={() => handleImageClick(idx + 2)}
                key={id}
                src={pictureUrl}
                alt="image post"
                className={`w-full h-[275px] object-cover object-center hover:cursor-pointer`}
              />
            ))}
          </div>
        </div>
        <DialogViewImage
          setCurrentImageIndex={setCurrentImageIndex}
          pictures={pictures}
          openDialogViewImage={openDialogViewImage}
          handleOpenDialogViewImage={handleOpenDialogViewImage}
          currentImageIndex={currentImageIndex}
        />
      </>
    )
  }
}
