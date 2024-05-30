'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useState } from 'react'
import { XLg, ArrowLeft, FileEarmarkImage } from 'react-bootstrap-icons'
import { Button, Input, Textarea } from '@material-tailwind/react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import ErrorInput from '../../../ui/error-input'
import { nunito } from '../../../ui/fonts'
import styles from '../../../ui/admin/react-tag-autocomplete.module.css'
import { JWT_COOKIE } from '../../../constant'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import page from './../../../admin/page'

const privacyValue = [
  {
    id: '1',
    name: 'Công khai',
  },
  {
    id: '2',
    name: 'Riêng tư',
  },
]

export default function Page() {
  const [previewImage, setPreviewImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  //const [privacy, setPrivacy] = useState('')

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    const group = {
      name: data.name,
      description: data.description,
      privacy: { name: data.privacy },
      cover: imageFile,
    }

    console.log(imageFile)
    console.log(group)
    const groupToast = toast.loading('Đang tạo')

    axios
      .postForm(`${process.env.NEXT_PUBLIC_SERVER_HOST}/groups`, group, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(() => {
        toast.success('Đăng thành công', {
          id: groupToast,
        })
      })
      .catch(({ message }) => {
        toast.error(message, {
          id: groupToast,
        })
      })
  }

  const onDragOver = (event) => {
    event.preventDefault()
  }

  const onDrop = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'

    const files = event.dataTransfer.files

    if (files.length > 1) {
      toast.error('Bạn chỉ được chọn tối đa 1 ảnh!')
      return
    }

    const file = files[0]
    if (file.size > 1024 * 1024 * 5) {
      toast.error('Bạn chỉ được chọn ảnh dưới 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setPreviewImage({ src: event.target.result })
    }
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  const onClickDropzone = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png, image/jpeg'
    input.click()

    input.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement
      const files = target.files
      if (!files) return // Ensure files is not null

      if (files.length > 1) {
        toast.error('Bạn chỉ được chọn tối đa 1 ảnh!')
        return
      }

      const file = files[0]
      if (file.size > 1024 * 1024 * 5) {
        toast.error('Bạn chỉ được chọn ảnh dưới 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage({ src: event.target.result })
      }
      reader.readAsDataURL(file)
      setImageFile(file)
    })
  }

  const removeImage = (event) => {
    event.stopPropagation()
    setPreviewImage(null)
    setImageFile(null)
  }

  return (
    <div
      className={`${nunito.className} flex flex-col gap-8 mt-8 max-w-[800px] w-[80%] m-auto`}>
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
      <div className="w-full flex">
        <Link href={'/groups'}>
          {/*Replace with the exact id */}
          <Button
            placeholder={undefined}
            variant="text"
            className="p-2 rounded-full">
            <ArrowLeft className="text-xl" />
          </Button>
        </Link>

        <p className="m-auto text-2xl text-black font-bold">Tạo nhóm mới</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xl font-bold">
            Tên nhóm
          </label>
          <Input
            size="lg"
            crossOrigin={undefined}
            type="text"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            {...register('name', {
              required: 'Vui lòng nhập tiêu đề',
            })}
          />
          <ErrorInput
            // This is the error message
            errors={errors?.name?.message}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="privacy" className="text-xl font-bold">
            Quyền riêng tư
          </label>
          <select
            className="hover:cursor-pointer pl-3 w-full text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 p-3 rounded-md border-blue-gray-200 focus:border-gray-900"
            {...register('privacy')}>
            {privacyValue.map(({ id, name }) => {
              return (
                <option key={id} value={name}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="facultyId" className="text-xl font-bold">
            Mô tả nhóm
          </label>
          <Textarea
            size="lg"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            {...register('description', {
              required: 'Vui lòng nhập tiêu đề',
            })}
          />
          <ErrorInput
            // This is the error message
            errors={errors?.description?.message}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="facultyId" className="text-xl font-bold">
            Hashtag
          </label>
          <Input
            size="lg"
            crossOrigin={undefined}
            type="text"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            //   {...register('hashtag')}
          />
          {/* <ErrorInput
          // This is the error message
          errors={errors?.hashtag?.message}
        /> */}
        </div>

        <div className="container flex flex-col items-end relative mx-auto my-2">
          <div
            className="border-dashed border-2 w-full border-gray-400 p-4 flex flex-col items-center justify-center hover:cursor-pointer"
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={onClickDropzone}>
            {previewImage === null ? (
              <>
                <FileEarmarkImage className="text-[64px] text-[--secondary]" />
                <p className="text-[--secondary]">
                  Chọn hoặc kéo và thả ảnh vào đây
                </p>
              </>
            ) : (
              <div className="mt-4 flex flex-col items-end w-full">
                <Button
                  placeholder={undefined}
                  className="z-10 -mb-8 mr-1 p-2 cursor-pointer bg-black hover:bg-black opacity-75"
                  onClick={removeImage}>
                  <XLg />
                </Button>
                <img
                  src={previewImage.src}
                  alt="Ảnh được kéo thả"
                  className="max-w-[800px] w-full h-60 object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <Button
          placeholder={undefined}
          size="lg"
          type="submit"
          className={`${nunito.className} h-12 w-full text-center mb-5 py-2 px-4 bg-[var(--blue-05)] normal-case text-base`}>
          Tạo nhóm
        </Button>
      </form>
    </div>
  )
}
