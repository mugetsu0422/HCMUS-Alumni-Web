'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import TextEditor from '../../../ui/admin/text-editor/TextEditor'
import { nunito } from '../../../ui/fonts'
import {
  Input,
  Button,
  Textarea,
  DialogFooter,
  Dialog,
  DialogBody,
  DialogHeader,
} from '@material-tailwind/react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { FACULTIES, JWT_COOKIE, TAGS } from '../../../constant'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../../ui/error-input'
import NoData from '../../../ui/no-data'
import { ReactTags } from 'react-tag-autocomplete'
import styles from '../../../ui/admin/react-tag-autocomplete.module.css'
import ImageSkeleton from '../../../ui/skeleton/image-skeleton'
import { useRouter } from 'next/navigation'

function CancelDialog({ open, handleOpen }) {
  const router = useRouter()

  return (
    <Dialog placeholder={undefined} size="xs" open={open} handler={handleOpen}>
      <DialogHeader placeholder={undefined}>Huỷ</DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn có muốn huỷ các thay đổi?
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

export default function Page({ params }: { params: { id: string } }) {
  const [news, setNews] = useState(null)
  const [noData, setNoData] = useState(false)
  const [content, setContent] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [summaryCharCount, setSummaryCharCount] = useState(0)
  const summaryMaxCharCount = 150
  const [openCancelDialog, setOpenCancelDialog] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(!openCancelDialog)
  }
  const onThumbnailChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setNews((news) => ({
        ...news,
        thumbnail: null,
      }))
      return
    }

    if (file.size > 1024 * 1024 * 5) {
      toast.error('Hãy chọn file có dung lượng thấp hơn 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setNews((news) => ({
        ...news,
        thumbnail: reader.result as string,
      }))
    }
    reader.readAsDataURL(file)
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
      thumbnail: data.thumbnail[0] || null,
      tagsId: selectedTags.map((tag) => {
        return tag.value
      }),
      facultyId: data.facultyId,
    }

    const putToast = toast.loading('Đang cập nhật')
    try {
      // Post without content
      await axios.putForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}`,
        news,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )

      // Update content
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}/content`,
        { content: content },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )

      toast.success('Cập nhật thành công', {
        id: putToast,
      })
    } catch ({ message }) {
      toast.error(message, {
        id: putToast,
      })
    }
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        setNews(data)
        setValue('title', data.title)
        setValue('facultyId', data.faculty?.id || '0')
        setSelectedTags(
          data.tags.map((tag) => {
            const { id } = tag
            return TAGS.find(({ value }) => value === id)
          })
        )
        setValue('summary', data.summary)
        setContent(data.content)
      })
      .catch((e) => {
        console.log(e)

        setNoData(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) {
    return <NoData />
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
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              {...register('title', {
                required: 'Vui lòng nhập tiêu đề',
              })}
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
              className="hidden"
              accept="image/png, image/jpeg"
              {...register('thumbnail', {
                onChange: onThumbnailChange,
              })}
            />
            {news?.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="object-cover w-[300px] h-[200px]"
                src={news?.thumbnail}
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
              Tóm tắt
              <p className="absolute right-0 bottom-0 font-normal text-base">
                {summaryCharCount}/{summaryMaxCharCount}
              </p>
            </label>
            <Textarea
              maxLength={summaryMaxCharCount}
              size="lg"
              variant="outlined"
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
              containerProps={{
                className: 'max-w-[400px] h-[110px]',
              }}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              {...register('summary', {
                onChange: (e) => setSummaryCharCount(e.target.value.length),
              })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <TextEditor
              readOnly={false}
              content={content}
              setContent={setContent}
            />
          </div>
          <div className="flex justify-end gap-x-4 pt-6 ">
            <Button
              onClick={handleOpenCancelDialog}
              placeholder={undefined}
              size="lg"
              className={`${nunito.className} bg-[var(--secondary)] text-black normal-case text-md`}>
              Hủy
            </Button>
            <CancelDialog open={openCancelDialog} handleOpen={handleOpenCancelDialog}/>
            <Button
              placeholder={undefined}
              size="lg"
              type="submit"
              className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
