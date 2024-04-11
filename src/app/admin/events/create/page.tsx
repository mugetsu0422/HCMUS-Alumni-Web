'use client'

import React, { useState, useRef } from 'react'
import { nunito } from '../../../ui/fonts'
import toast, { Toaster } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../../ui/error-input'
import { JWT_COOKIE, FACULTIES } from '../../../constant'
import { useRouter } from 'next/navigation'
import {
  Input,
  Button,
  Textarea,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react'
import ImageSkeleton from '../../../ui/skeleton/image-skeleton'

function CancelDialog({ open, handleOpen }) {
  const router = useRouter()

  return (
    <Dialog placeholder={undefined} size="xs" open={open} handler={handleOpen}>
      <DialogHeader placeholder={undefined}>Huỷ</DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn có muốn huỷ tạo bài viết?
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          className={`${nunito.className} mr-4 bg-[var(--secondary)] text-black normal-case text-md`}
          placeholder={undefined}
          onClick={handleOpen}>
          <span>Không</span>
        </Button>
        <Button
          className={`${nunito.className} bg-[var(--blue-05)] text-white normal-case text-md`}
          placeholder={undefined}
          onClick={() => {
            router.push('/admin/events')
          }}>
          <span>Hủy</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function Page() {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm()
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const textareaRef = useRef(null)

  const onSubmit = async (data) => {}

  const onThumbnailChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setThumbnailPreview(null)
      return
    }

    if (file.size > 1024 * 1024 * 5) {
      toast.error('Hãy chọn file có dung lượng thấp hơn 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setThumbnailPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(!openCancelDialog)
  }
  //*Get current date
  let newDate = new Date()
  let date =
    newDate.getDate() < 10
      ? '0' + newDate.getDate().toString()
      : newDate.getDate().toString()

  let month =
    newDate.getMonth() + 1 < 10
      ? '0' + (newDate.getMonth() + 1).toString()
      : (newDate.getMonth() + 1).toString()

  let year = newDate.getFullYear().toString()

  let mindate = `${year}-${month}-${date}T00:00`.toString()

  return (
    <div
      className={`${nunito.className} max-w-[81.25%] h-fit m-auto bg-[#f7fafd] mt-8 rounded-lg`}>
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
      <header className="font-extrabold text-2xl h-16 py-3 px-8 bg-[var(--blue-02)] flex items-center text-white rounded-tl-lg rounded-tr-lg">
        Thông tin chi tiết
      </header>
      <div className="px-8 py-10 overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              className="text-xl font-bold"
              //* INPUT CHO TIÊU ĐỀ
            >
              Tiêu đề
            </label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('title', {
                required: 'Vui lòng nhập tiêu đề',
              })}
              label="Nội dung tiêu đề"
              className="bg-white"
            />
            <ErrorInput
              // This is the error message
              errors={errors?.title?.message}
            />
          </div>

          <div
            className="flex gap-6"
            //* INPUT CHO THỜI GIAN ĐỊA ĐIỂM VÀ KHOA
          >
            <div className="flex flex-col gap-2">
              <label
                className="text-xl font-bold"
                //* INPUT CHO THỜI GIAN
              >
                Thời gian
              </label>
              <Input
                size="lg"
                crossOrigin={undefined}
                variant="outlined"
                min={mindate}
                type="datetime-local"
                {...register('organizationTime', {
                  required: 'Vui lòng nhập địa chỉ',
                })}
                label="Thời gian bắt đầu"
                className="bg-white w-[350px]"
              />
              <ErrorInput
                // This is the error message
                errors={errors?.organizationTime?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                className="text-xl font-bold"
                //* INPUT CHO ĐỊA CHỈ
              >
                Địa điểm
              </label>
              <Input
                size="lg"
                crossOrigin={undefined}
                variant="outlined"
                type="text"
                {...register('organizationLocation', {
                  required: 'Vui lòng nhập địa chỉ',
                })}
                label="Địa chỉ"
                className="bg-white w-[600px]"
              />
              <ErrorInput
                // This is the error message
                errors={errors?.organizationLocation?.message}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="facultyId" className="text-xl font-bold">
                Khoa
              </label>
              <select
                className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 p-3 rounded-md border-blue-gray-200 focus:border-gray-900"
                {...register('facultyId')}>
                <option value={0}>Không</option>
                {FACULTIES.map(({ id, name }) => {
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xl font-bold">Ảnh thumbnail</p>
            <label
              htmlFor="thumbnail"
              className="hover:cursor-pointer shadow-md shadow-gray-900/10 rounded-lg hover:shadow-lg hover:shadow-gray-900/20 text-white font-bold w-fit px-7 py-3.5 bg-[var(--blue-05)] normal-case text-md">
              Tải ảnh lên
            </label>
            <input
              type="file"
              id="thumbnail"
              className="opacity-0 absolute w-0"
              accept="image/png, image/jpeg"
              {...register('thumbnail', {
                onChange: onThumbnailChange,
                required: 'Vui lòng chọn ảnh thumbnail',
              })}
            />
            <ErrorInput
              // This is the error message
              errors={errors?.thumbnail?.message}
            />
            {thumbnailPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="object-cover w-[300px] h-[200px]"
                src={thumbnailPreview}
                alt="preview-thumbnail"
                width={300}
                height={200}
              />
            ) : (
              <ImageSkeleton width={300} height={200} />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className={`relative max-w-[400px] text-xl font-bold`}>
              Thông tin chi tiết
            </label>
            <Textarea
              ref={textareaRef}
              size="lg"
              variant="outlined"
              className="bg-white h-44 !border-t-blue-gray-200 focus:!border-t-gray-900"
              containerProps={{
                className: 'max-w-[50%] h-fit',
              }}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              {...register('summary')}
            />
          </div>

          <div className="flex justify-end gap-x-4 pt-2">
            <Button
              onClick={handleOpenCancelDialog}
              placeholder={undefined}
              size="lg"
              className={`${nunito.className} bg-[var(--secondary)] text-black normal-case text-md`}>
              Hủy
            </Button>
            <CancelDialog
              open={openCancelDialog}
              handleOpen={handleOpenCancelDialog}
            />
            <Button
              placeholder={undefined}
              size="lg"
              type="submit"
              className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
              Đăng
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
