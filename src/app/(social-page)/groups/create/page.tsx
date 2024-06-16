'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useState, useRef } from 'react'
import { XLg, ArrowLeft, FileEarmarkImage } from 'react-bootstrap-icons'
import { Button, Input, Textarea } from '@material-tailwind/react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import ErrorInput from '../../../ui/error-input'
import { nunito } from '../../../ui/fonts'
import styles from '@/app/ui/common/react-tag-autocomplete.module.css'
import { JWT_COOKIE, TAGS_LIMIT } from '../../../constant'
import { useForm, Controller } from 'react-hook-form'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import CustomToaster from '@/app/ui/common/custom-toaster'
import { ReactTags } from 'react-tag-autocomplete'

const privacyValue = [
  {
    id: '1',
    name: 'Công khai',
    value: 'PUBLIC',
  },
  {
    id: '2',
    name: 'Riêng tư',
    value: 'PRIVATE',
  },
]

export default function Page() {
  const router = useRouter()
  const [previewImage, setPreviewImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  //const [privacy, setPrivacy] = useState('')
  const tagsInputRef = useRef(null)
  const [selectedTags, setSelectedTags] = useState([])

  const {
    control,
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
      privacy: data.privacy,
      cover: imageFile,
      tagNames: selectedTags.map((tag) => {
        return tag.value
      }).join(','),
    }

    const groupToast = toast.loading('Đang tạo')

    axios
      .postForm(`${process.env.NEXT_PUBLIC_SERVER_HOST}/groups`, group, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        toast.success('Tạo thành công', {
          id: groupToast,
        })
        router.push(`/groups/${data}`)
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

  return (
    <div
      className={`${nunito.className} flex flex-col gap-8 mt-8 max-w-[800px] w-[80%] m-auto`}>
      <CustomToaster />
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
          <ErrorInput errors={errors?.name?.message} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="privacy" className="text-xl font-bold">
            Quyền riêng tư
          </label>
          <select
            className="hover:cursor-pointer pl-3 w-full text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 p-3 rounded-md border-blue-gray-200 focus:border-gray-900"
            {...register('privacy')}>
            {privacyValue.map(({ id, name, value }) => {
              return (
                <option key={id} value={value}>
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
              required: 'Vui lòng nhập mô tả',
            })}
          />
          <ErrorInput errors={errors?.description?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tagNames" className="text-xl font-bold">
            Thẻ
          </label>
          <ReactTags
            ref={tagsInputRef}
            id="tags-input-validity-description"
            suggestions={[]}
            selected={selectedTags}
            onAdd={onAddTags}
            onDelete={onDeleteTags}
            isInvalid={selectedTags.length > TAGS_LIMIT}
            ariaErrorMessage="tags-input-error"
            ariaDescribedBy="tags-input-validity-description"
            allowNew={true}
            activateFirstOption={true}
            placeholderText="Nhập thẻ"
            newOptionText="Thêm thẻ %value%"
            noOptionsText="Không tim thấy the %value%"
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
          <Controller
            name="tagNames"
            control={control}
            render={() => <input type="text" className="hidden" />}
            rules={{
              validate: {
                validateTagsInput: () => {
                  if (selectedTags.length > 5) {
                    tagsInputRef.current.input.focus()
                    return false
                  }
                  return true
                },
              },
            }}
          />
          {selectedTags.length > TAGS_LIMIT && (
            <ErrorInput errors={`Tối đa ${TAGS_LIMIT} thẻ được thêm`} />
          )}
        </div>

        <div className="container flex flex-col relative mx-auto my-2">
          <label htmlFor="facultyId" className="text-xl font-bold">
            Ảnh bìa
          </label>
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
                  className="-mb-8 mr-1 p-2 cursor-pointer bg-black hover:bg-black opacity-75"
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
