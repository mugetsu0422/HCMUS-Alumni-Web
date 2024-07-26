'use client'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react'
import toast from 'react-hot-toast'
import Cropper from 'react-easy-crop'
import { Camera } from 'react-bootstrap-icons'
import { ConfirmChangeAvatarDialog } from './dialogs'
import axios from 'axios'
import { JWT_COOKIE } from '@/app/constant'

export default function ChangeAvatarUser({
  register,
  getValues,
  setInputs,
  setCroppedAvatar,
  handleChangeAvatar,
}) {
  const [open, setOpen] = useState(false)
  const [avatarForCropping, setAvatarForCropping] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog((e) => !e)
  }

  const handleOpen = () => {
    if (open) setAvatarForCropping(null)
    setOpen(!open)
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
      setAvatarForCropping({ file: file, src: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleCrop = async () => {
    try {
      const croppedImageBitmap = await createImageBitmap(
        avatarForCropping.file,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      const canvas = document.createElement('canvas')
      canvas.width = croppedImageBitmap.width
      canvas.height = croppedImageBitmap.height
      const ctx = canvas.getContext('2d') // Changed from 'bitmaprenderer' to '2d'
      ctx.drawImage(croppedImageBitmap, 0, 0)

      const croppedImageBlob = await new Promise<Blob>((resolve) => {
        if (avatarForCropping.file.type === 'image/jpeg') {
          canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8) // Add a non-null assertion
        } else {
          canvas.toBlob((blob) => resolve(blob!), avatarForCropping.file.type) // Add a non-null assertion
        }
      })

      const reader = new FileReader()
      reader.onload = () => {
        setCroppedAvatar(reader.result as string)
      }
      reader.readAsDataURL(croppedImageBlob)

      const originalAvatarFile = getValues('avatar')[0]
      const avatarFile = new File([croppedImageBlob], originalAvatarFile.name, {
        type: originalAvatarFile.type,
      })

      setInputs((values) => ({
        ...values,
        avatar: avatarFile,
      }))

      handleOpen()
      handleChangeAvatar()
    } catch (error) {
      console.error('Error during cropping process:', error)
      // toast.error(
      //   'An error occurred while cropping the image. Please try again.'
      // )
    }
  }

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  if (!isMounted) return null
  return (
    <>
      <Button
        placeholder={undefined}
        onClick={handleOpen}
        className="h-fit w-fit p-2 bg-[#e4e6eb] -mt-6 2xl:-mt-8 rounded-full z-0 relative right-2">
        <Camera className="text-base xl:text-xl text-black" />
      </Button>

      <Dialog
        className="overflow-y-auto scroll-smooth max-h-[90vh]"
        placeholder={undefined}
        open={open}
        handler={handleOpen}>
        <DialogHeader
          tabIndex={0}
          className="border-b-2 border-gray-300 justify-center"
          placeholder={undefined}>
          Chọn ảnh đại diện
        </DialogHeader>
        <DialogBody placeholder={undefined} className="h-[70vh] flex flex-col">
          {!avatarForCropping && (
            <>
              <label
                className="h-full w-full text-[var(--text)] text-xl cursor-pointer font-bold flex justify-center items-center"
                htmlFor="avatar">
                Tải ảnh lên
              </label>
              <input
                className="hidden"
                id="avatar"
                type="file"
                accept="image/png, image/jpeg"
                {...register('avatar', {
                  onChange: handleAvatarSelected,
                })}
              />
            </>
          )}
          {avatarForCropping && (
            <Cropper
              image={avatarForCropping.src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              zoomWithScroll={false}
              showGrid={false}
              cropShape="round"
            />
          )}
        </DialogBody>
        {avatarForCropping && (
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
          className="border-t-2 border-gray-300"
          placeholder={undefined}>
          <div className="font-semibold flex gap-4">
            <Button
              placeholder={undefined}
              onClick={handleOpen}
              className="text-black px-6 py-4 rounded-md bg-[--delete-filter]">
              <span>Hủy</span>
            </Button>
            <Button
              // type="submit"
              placeholder={undefined}
              onClick={handleOpenConfirmDialog}
              disabled={avatarForCropping === null ? true : false}
              className="bg-[--blue-05] text-white px-6 py-4 rounded-md">
              <span>Lưu</span>
            </Button>
          </div>
          <ConfirmChangeAvatarDialog
            openConfirmDialog={openConfirmDialog}
            handleOpenConfirmDialog={handleOpenConfirmDialog}
            handleCrop={handleCrop}
          />
        </DialogFooter>
      </Dialog>
    </>
  )
}
