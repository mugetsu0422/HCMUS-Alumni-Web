'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react'
import toast from 'react-hot-toast'
import Cropper from 'react-easy-crop'
import { ConfirmChangeCoverDialog } from './dialogs'

// Khi có API thì có thể bỏ setCroppedAvatar
export default function ChangeCoverUser({
  register,
  getValues,
  setInputs,
  setCoverImage,
  handleOpenChangeCover,
  openChangeCover,
}) {
  const [coverForCropping, setCoverForCropping] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [width, setWidth] = useState(null)

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog((e) => !e)
  }

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleAvatarSelected = (e) => {
    const file = e.target.files[0]

    if (!file) {
      return
    }

    if (file.size > 1024 * 1024 * 5) {
      toast.error('Hãy chọn file có dung lượng thấp hơn 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setCoverForCropping({ file: file, src: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleCrop = async () => {
    const croppedImageBitmap = await createImageBitmap(
      coverForCropping.file,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )
    const canvas = document.createElement('canvas') as HTMLCanvasElement

    // resize it to the size of our ImageBitmap
    canvas.width = croppedImageBitmap.width
    canvas.height = croppedImageBitmap.height

    // get a bitmaprenderer context
    const ctx = canvas.getContext('bitmaprenderer')
    ctx.transferFromImageBitmap(croppedImageBitmap)

    // get it back as a Blob
    const croppedImageBlob = (await new Promise((res) => {
      if (coverForCropping.file.type == 'image/jpeg') {
        canvas.toBlob(res, 'image/jpeg', 0.8)
      } else {
        canvas.toBlob(res)
      }
    })) as Blob

    const reader = new FileReader()
    reader.onload = () => {
      setCoverImage(reader.result as string)
    }
    reader.readAsDataURL(croppedImageBlob)

    const originalCoverFile = getValues('cover')[0]
    const coverFile = new File([croppedImageBlob], originalCoverFile.name, {
      type: originalCoverFile.type,
    })
    setInputs((values) => ({
      ...values,
      cover: coverFile,
    }))

    handleOpenChangeCover()
  }

  const ImageWidth = ({ src }) => {
    useEffect(() => {
      const img = new Image()
      img.src = src

      img.onload = () => {
        setWidth(img.width)
      }

      img.onerror = (error) => {
        console.error('Failed to load the image', error)
      }
    }, [src])

    return null
  }

  return (
    <>
      <Dialog
        placeholder={undefined}
        className="overflow-y-auto scroll-smooth max-h-[90vh]"
        open={openChangeCover}
        handler={handleOpenChangeCover}
        size="xl">
        <DialogHeader
          placeholder={undefined}
          className="border-b-2 border-gray-300 justify-center">
          Chọn ảnh đại diện
        </DialogHeader>
        <DialogBody placeholder={undefined} className="h-[30vw] flex flex-col">
          {!coverForCropping && (
            <>
              <label
                className="h-full w-full text-[var(--text)] text-xl cursor-pointer font-bold flex justify-center items-center"
                htmlFor="cover">
                Tải ảnh lên
              </label>
              <input
                className="hidden"
                id="cover"
                type="file"
                accept="image/png, image/jpeg"
                {...register('cover', {
                  onChange: handleAvatarSelected,
                })}
              />
            </>
          )}
          {coverForCropping && (
            <>
              <ImageWidth src={coverForCropping.src} />
              <Cropper
                image={coverForCropping.src}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                zoomWithScroll={false}
                showGrid={false}
                cropSize={{ height: 240, width: Number(width) }}
              />
            </>
          )}
        </DialogBody>
        {coverForCropping && (
          <div className="flex justify-center">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(+e.target.value)
              }}
              className="w-1/2 hover:cursor-pointer h-[3rem]"
            />
          </div>
        )}
        <DialogFooter
          placeholder={undefined}
          className="border-t-2 border-gray-300">
          <div className="font-semibold flex gap-4">
            <Button
              placeholder={undefined}
              onClick={() => {
                handleOpenChangeCover()
                setCoverForCropping(null)
              }}
              className="text-black px-6 py-4 rounded-md bg-[--delete-filter]">
              <span>Hủy</span>
            </Button>
            <Button
              placeholder={undefined}
              onClick={handleOpenConfirmDialog}
              disabled={coverForCropping === null}
              className="bg-[--blue-05] text-white px-6 py-4 rounded-md">
              <span>Lưu</span>
            </Button>
          </div>
          <ConfirmChangeCoverDialog
            openConfirmDialog={openConfirmDialog}
            handleOpenConfirmDialog={handleOpenConfirmDialog}
            handleCrop={handleCrop}
          />
        </DialogFooter>
      </Dialog>
    </>
  )
}
