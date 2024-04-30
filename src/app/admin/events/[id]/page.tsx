'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { nunito } from '../../../ui/fonts'
import toast, { Toaster } from 'react-hot-toast'
import { set, useForm } from 'react-hook-form'
import ErrorInput from '../../../ui/error-input'
import { JWT_COOKIE, FACULTIES, TAGS } from '../../../constant'
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
import { ReactTags } from 'react-tag-autocomplete'
import styles from '../../../ui/admin/react-tag-autocomplete.module.css'
import NoData from '../../../ui/no-data'
import axios from 'axios'
import Cookies from 'js-cookie'
import moment from 'moment'

const getTodayDate = () => {
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

  return `${year}-${month}-${date}T00:00`.toString()
}

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

export default function Page({ params }: { params: { id: string } }) {
  const [noData, setNoData] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [openCancelDialog, setOpenCancelDialog] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const today = getTodayDate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(!openCancelDialog)
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
    const event = {
      ...data,
      thumbnail: data.thumbnail[0] || null,
      organizationTime: moment(data.organizationTime).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
      tagsId: selectedTags.map((tag) => {
        return tag.value
      }),
    }

    const postToast = toast.loading('Đang cập nhật')
    axios
      .putForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}`,
        event,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Cập nhật thành công', {
          id: postToast,
        })
      })
      .catch(({ message }) => {
        toast.error(message, {
          id: postToast,
        })
      })
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        setThumbnailPreview(data.thumbnail)
        setValue('title', data.title)
        setValue('facultyId', data.faculty?.id || '0')
        setValue(
          'organizationTime',
          moment(data.organizationTime).format('YYYY-MM-DDTHH:mm')
        )
        setValue('organizationLocation', data.organizationLocation)
        setValue('content', data.content)
        setSelectedTags(
          data.tags.map((tag) => {
            const { id } = tag
            return TAGS.find(({ value }) => value === id)
          })
        )
      })
      .catch((e) => {
        setNoData(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) {
    return <NoData />
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
            <label className="text-xl font-bold">Tiêu đề</label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('title', {
                required: 'Vui lòng nhập tiêu đề',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput
              // This is the error message
              errors={errors?.title?.message}
            />
          </div>

          <div className="flex gap-6 flex-wrap">
            <div className="flex flex-col gap-2">
              <label className="text-xl font-bold">Thời gian</label>
              <Input
                size="lg"
                crossOrigin={undefined}
                variant="outlined"
                min={today}
                type="datetime-local"
                {...register('organizationTime', {
                  required: 'Vui lòng nhập thời gian diễn ra',
                })}
                containerProps={{ className: 'h-[50px]' }}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white w-[350px] !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              <ErrorInput
                // This is the error message
                errors={errors?.organizationTime?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xl font-bold">Địa điểm</label>
              <Input
                size="lg"
                crossOrigin={undefined}
                variant="outlined"
                type="text"
                {...register('organizationLocation', {
                  required: 'Vui lòng nhập địa điểm',
                })}
                containerProps={{ className: 'h-[50px]' }}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !w-[300px] !border-t-blue-gray-200 focus:!border-t-gray-900"
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
                className="h-[50px] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 p-3 rounded-md border-blue-gray-200 focus:border-gray-900"
                {...register('facultyId')}>
                <option value={0}>Tất cả</option>
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
          <div className="flex gap-6 flex-wrap">
            <div className="flex flex-col gap-2">
              <label className="text-xl font-bold">Tham gia tối thiểu</label>
              <Input
                size="lg"
                crossOrigin={undefined}
                variant="outlined"
                type="number"
                {...register('minimumParticipants', {
                  required: 'Vui lòng nhập số lượng tối thiểu',
                  validate: {
                    nonNegative: (value) =>
                      parseInt(value) >= 0 || 'Số lượng không được âm',
                  },
                })}
                containerProps={{ className: 'h-[50px]' }}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !w-[214px] !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              <ErrorInput
                // This is the error message
                errors={errors?.minimumParticipants?.message}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xl font-bold">Tham gia tối đa</label>
              <Input
                size="lg"
                crossOrigin={undefined}
                variant="outlined"
                type="number"
                {...register('maximumParticipants', {
                  required: 'Vui lòng nhập số lượng tối đa',
                  validate: {
                    minMaxRelation: (value) =>
                      parseInt(value) >=
                        parseInt(watch('minimumParticipants')) ||
                      'Số lượng tối đa phải lớn hơn hoặc bằng số lượng tối thiểu',

                    nonNegative: (value) =>
                      parseInt(value) >= 0 || 'Số lượng không được âm',
                  },
                })}
                containerProps={{ className: 'h-[50px]' }}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !w-[214px] !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              <ErrorInput
                // This is the error message
                errors={errors?.maximumParticipants?.message}
              />
            </div>
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
            <p className="text-xl font-bold">Ảnh thumbnail</p>
            <label
              htmlFor="thumbnail"
              className="w-fit h-fit hover:cursor-pointer">
              <input
                type="file"
                id="thumbnail"
                className="opacity-0 absolute w-0"
                accept="image/png, image/jpeg"
                {...register('thumbnail', {
                  onChange: onThumbnailChange,
                })}
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
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <label className={`relative max-w-[400px] text-xl font-bold`}>
              Thông tin chi tiết
            </label>
            <Textarea
              size="lg"
              variant="outlined"
              className="bg-white h-44 !border-t-blue-gray-200 focus:!border-t-gray-900"
              containerProps={{
                className: 'w-full h-fit',
              }}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              {...register('content')}
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
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
