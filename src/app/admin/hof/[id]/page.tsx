'use client'

import React, { useCallback, useState } from 'react'
import TextEditor from '../../../ui/admin/text-editor/TextEditor'
import { nunito } from '../../../ui/fonts'
import {
  Input,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../../ui/error-input'
import { FACULTIES } from '../../../constant'
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
            router.push('/admin/news')
          }}>
          <span>Hủy</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export default function Page() {
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [content, setContent] = useState(null)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm()
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

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog)
  }
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(!openCancelDialog)
  }

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
            <label className="text-xl font-bold">Tên gương thành công</label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('title', {
                required: 'Vui lòng nhập gương thành công',
              })}
              label="Tên gương thành công"
              className="bg-white"
            />
            <ErrorInput
              // This is the error message
              errors={errors?.title?.message}
            />
          </div>

          <div className="flex w-[422px] flex-col gap-2">
            <label className="text-xl font-bold">Khóa</label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('beginningYear', {
                required: 'Vui lòng nhập khóa',
              })}
              label="Khóa"
              className="bg-white"
            />
            <ErrorInput
              // This is the error message
              errors={errors?.beginningYear?.message}
            />
          </div>

          <div className="flex w-[422px] flex-col gap-2">
            <label className="text-xl font-bold">Email gương thành công</label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              label="Email gương thành công"
              className="bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="facultyId" className="text-xl font-bold">
              Khoa
            </label>
            <select
              className="h-full hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 p-3 rounded-md border-blue-gray-200 focus:border-gray-900"
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
            <TextEditor
              readOnly={false}
              content={content}
              setContent={setContent}
            />
            {/* <div className="ql-editor" dangerouslySetInnerHTML={{__html: content}}></div> */}
          </div>
          <div className="flex justify-end gap-x-4 pt-6 ">
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
