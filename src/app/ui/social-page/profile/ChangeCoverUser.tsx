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
  handleChangeCover,
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

  const handleCoverSelected = (e) => {
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
    try {
      const croppedImageBitmap = await createImageBitmap(
        coverForCropping.file,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
  
      const canvas = document.createElement('canvas');
      canvas.width = croppedImageBitmap.width;
      canvas.height = croppedImageBitmap.height;
      const ctx = canvas.getContext('2d'); // Changed from 'bitmaprenderer' to '2d'
      ctx.drawImage(croppedImageBitmap, 0, 0);
  
      const croppedImageBlob = await new Promise<Blob>((resolve) => {
        if (coverForCropping.file.type === 'image/jpeg') {
          canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.8); // Add a non-null assertion
        } else {
          canvas.toBlob((blob) => resolve(blob!), coverForCropping.file.type); // Add a non-null assertion
        }
      });
  
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(croppedImageBlob);
  
      const originalCoverFile = getValues('cover')[0];
      const coverFile = new File([croppedImageBlob], originalCoverFile.name, {
        type: originalCoverFile.type,
      });
  
      setInputs((values) => ({
        ...values,
        cover: coverFile,
      }));
  
      handleOpenChangeCover();
      handleChangeCover();
    } catch (error) {
      console.error("Error during cropping process:", error);
      //toast.error("An error occurred while cropping the image. Please try again.");
    }
  };
  

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
          Chọn ảnh bìa
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
                  onChange: handleCoverSelected,
                })}
              />
            </>
          )}
          {coverForCropping && (
            <>
              <Cropper
                image={coverForCropping.src}
                crop={crop}
                zoom={zoom}
                aspect={1350 / 384}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                zoomWithScroll={false}
                showGrid={false}
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
