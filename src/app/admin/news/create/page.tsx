'use client'

import React, { useCallback, useState } from 'react'
import TextEditor from '../../../ui/admin/text-editor/TextEditor'
import { nunito } from '../../../ui/fonts'
import {
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { JWT_COOKIE, FACULTIES, TAGS } from '../../../constant'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../../ui/error-input'
import DateTimeLocalPickerDialog from '../../../ui/admin/date-time-picker-dialog'
import { ReactTags } from 'react-tag-autocomplete'
import styles from '../../../ui/admin/react-tag-autocomplete.module.css'

export default function Page() {
  const [content, setContent] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [scheduledTime, setScheduledTime] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm()

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
  const handleDateTime = (props) => {
    setScheduledTime((state) => ({
      ...state,
      ...props,
    }))
  }
  const onAddTags = useCallback(
    (newTag) => {
      setSelectedTags([...selectedTags, newTag])
    },
    [selectedTags]
  )
  const onDeleteTags = useCallback(
    (tagIndex) => {
      setSelectedTags(selectedTags.filter((_, i) => i !== tagIndex))
    },
    [selectedTags]
  )

  const onSubmit = async (data) => {
    const news = {
      title: data.title,
      thumbnail: data.thumbnail[0],
      tagsId: selectedTags.map((tag) => {
        return tag.value
      }),
      facultyId: data.facultyId,
      scheduledTime: openDialog
        ? new Date(
            scheduledTime.date + 'T' + scheduledTime.time + ':00.000'
          ).getTime()
        : null,
    }

    const postToast = toast.loading(openDialog ? 'Đang lên lịch' : 'Đang đăng')
    try {
      // Post without content
      const res1 = await axios.postForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news`,
        news,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      const { data: id } = res1

      // Update content
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${id}/content`,
        { content: content },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )

      toast.success(openDialog ? 'Lên lịch thành công' : 'Đăng thành công', {
        id: postToast,
      })
    } catch ({ message }) {
      toast.error(message, {
        id: postToast,
      })
    }
  }

  return (
    <div
      className={`${nunito.className} max-w-[81.25%] max-h-[755px] m-auto bg-[#f7fafd] mt-8 rounded-lg`}>
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
            <label className="text-xl font-bold">Tiêu đề</label>
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

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold">Thẻ</label>
            <ReactTags
              activateFirstOption={true}
              placeholderText="Thêm thẻ"
              selected={selectedTags}
              suggestions={TAGS}
              onAdd={onAddTags}
              onDelete={onDeleteTags}
              noOptionsText="No matching countries"
              classNames={{
                root: `${styles['react-tags']}`,
                rootIsActive: `${styles['is-active']}`,
                rootIsDisabled: `${styles['is-disabled']}`,
                rootIsInvalid: `${styles['is-invalid']}`,
                label: `${styles['react-tags__label']}`,
                tagList: `${styles['react-tags__list']}`,
                tagListItem: `${styles['react-tags__list-item']}`,
                tag: `${styles['react-tags__tag']}`,
                tagName: `${styles['react-tags__tag-name']}`,
                comboBox: `${styles['react-tags__combobox']}`,
                input: `${styles['react-tags__combobox-input']}`,
                listBox: `${styles['react-tags__listbox']}`,
                option: `${styles['react-tags__listbox-option']}`,
                optionIsActive: `${styles['is-active']}`,
                highlight: `${styles['react-tags__listbox-option-highlight']}`,
              }}
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
            {
              <Image
                className="object-cover w-[300px] h-[200px]"
                src={thumbnailPreview || '/no-image-placeholder.png'}
                alt="preview-thumbnail"
                width={300}
                height={200}
              />
            }
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
              placeholder={undefined}
              size="lg"
              className={`${nunito.className} bg-[var(--secondary)] text-black normal-case text-md`}>
              Hủy
            </Button>
            <Button
              onClick={async () => {
                const output = await trigger(['title', 'thumbnail'], {
                  shouldFocus: true,
                })
                if (output) {
                  handleOpenDialog()
                }
              }}
              placeholder={undefined}
              size="lg"
              className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
              Lên lịch
            </Button>
            <DateTimeLocalPickerDialog
              open={openDialog}
              handleOpen={handleOpenDialog}
              onChange={handleDateTime}
              onSubmit={handleSubmit(onSubmit)}
            />
            <Button
              placeholder={undefined}
              size="lg"
              type="submit"
              className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
              Đăng ngay
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
