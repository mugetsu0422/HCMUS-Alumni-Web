'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Input, Textarea } from '@material-tailwind/react'
import { XLg, ArrowLeft, FileEarmarkImage } from 'react-bootstrap-icons'
import { nunito } from '../../../../ui/fonts'
import ErrorInput from '../../../../ui/error-input'
import { Controller, useForm } from 'react-hook-form'
import { ReactTags } from 'react-tag-autocomplete'
import styles from '@/app/ui/common/react-tag-autocomplete.module.css'
import { JWT_COOKIE, TAGS_LIMIT } from '@/app/constant'
import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import NotFound404 from '@/app/ui/common/not-found-404'

export default function Page({ params }: { params: { id: string } }) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const [notFound, setNotFound] = useState(false)
  const [currentImages, setCurrentImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [addedImageFiles, setAddedImageFiles] = useState([])
  const [deleteImageIds, setDeleteImageIds] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const router = useRouter()
  const tagsInputRef = useRef(null)

  const onDragOver = (event) => {
    event.preventDefault()
  }

  const removeImage = (index, id, event) => {
    event.stopPropagation()

    if (index < currentImages.length) {
      // Removing from currentImages
      if (id) {
        setDeleteImageIds((prev) => prev.concat(id))
      }
      const newCurrentImages = currentImages.filter((_, i) => i !== index)
      setCurrentImages(newCurrentImages)
    } else {
      // Removing from previewImages
      const previewIndex = index - currentImages.length
      const newPreviewImages = previewImages.filter(
        (_, i) => i !== previewIndex
      )
      setPreviewImages(newPreviewImages)
    }
  }

  const onDrop = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'

    const files = event.dataTransfer.files
    const newPreviewImages = [...previewImages]
    const newAddedImageFiles = [...addedImageFiles]

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 1024 * 1024 * 5) {
        toast.error('Bạn chỉ được chọn ảnh dưới 5MB')
        return
      }
      if (currentImages.length + previewImages.length + files.length > 5) {
        toast.error('Bạn chỉ được chọn tối đa 5 ảnh!')
        return
      }
      const file = files[i]
      newAddedImageFiles.push(file) // Add new file to the array

      const reader = new FileReader()
      reader.onload = (event) => {
        newPreviewImages.push({ pictureUrl: event.target.result })
        setPreviewImages([...newPreviewImages]) // Update preview images state
      }
      reader.readAsDataURL(file)
    }

    setAddedImageFiles(newAddedImageFiles) // Update added image files state
  }

  const onClickDropzone = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/png, image/jpeg'
    input.multiple = true
    input.click()

    input.addEventListener('change', (event) => {
      const files = (event.target as HTMLInputElement).files // Type cast here
      if (files.length > 0) {
        const newPreviewImages = [...previewImages]
        const newAddedImageFiles = [...addedImageFiles]

        for (let i = 0; i < files.length; i++) {
          if (files[i].size > 1024 * 1024 * 5) {
            toast.error('Bạn chỉ được chọn ảnh dưới 5MB')
            return
          }
        }
        if (currentImages.length + previewImages.length + files.length > 5) {
          toast.error('Bạn chỉ được chọn tối đa 5 ảnh!')
          return
        }

        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          newAddedImageFiles.push(file) // Add new file to the array

          const reader = new FileReader()
          reader.onload = (event) => {
            newPreviewImages.push({ pictureUrl: event.target.result })
            setPreviewImages([...newPreviewImages]) // Update preview images state
          }
          reader.readAsDataURL(file)
        }

        setAddedImageFiles(newAddedImageFiles) // Update added image files state
      }
    })
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

  const onSubmit = (data) => {
    const { tagsDummy, ...rest } = data
    const post = {
      ...rest,
      tags: selectedTags.map((tag) => {
        return { name: tag.value }
      }),
    }

    const imagesForm = new FormData()
    for (const image of addedImageFiles) {
      imagesForm.append('addedImages', image)
    }
    for (const id of deleteImageIds) {
      imagesForm.append('deletedImageIds', id)
    }

    // If there are no images left to be updated, ensure we handle this case
    if (currentImages.length === 0 && previewImages.length === 0) {
      imagesForm.append('noImages', 'true') // Use a flag to indicate no images are left
    }

    const putToast = toast.loading('Đang cập nhật bài viết...')

    const updatePromise = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}`,
      post,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const updateImages = axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}/images`,
      imagesForm,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([updatePromise, updateImages])
      .then(() => {
        toast.success('Cập nhật bài viết thành công', {
          id: putToast,
        })
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định',
          {
            id: putToast,
          }
        )
      })
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/counsel/${params.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { title, content, tags, pictures } }) => {
        setValue('title', title)
        setValue('content', content)
        setSelectedTags(
          tags.map((tag) => ({
            value: tag.name,
            label: tag.name,
          }))
        )
        //console.log("Pictures:", pictures); // Log the pictures data
        setCurrentImages(pictures)
      })
      .catch((error) => {
        setNotFound(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (notFound) {
    return <NotFound404 />
  }

  return (
    <div
      className={`${nunito.className} flex flex-col gap-8 mt-8 max-w-[1200px] w-[81.25%] m-auto`}>
      <div className="w-full flex">
        <Button
          onClick={() => router.push('/counsel')}
          placeholder={undefined}
          variant="text"
          className="p-2 rounded-full">
          <ArrowLeft className="text-xl" />
        </Button>
        <p className="m-auto text-2xl text-black font-bold">
          Chỉnh sửa bài viết
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          size="lg"
          crossOrigin={undefined}
          label="Tiêu đề"
          type="text"
          {...register('title', {
            required: 'Vui lòng nhập tiêu đề',
          })}
        />
        <ErrorInput errors={errors?.title?.message} />
        <Textarea
          rows={8}
          label="Nội dung"
          {...register('content', {
            required: 'Vui lòng nhập nội dung',
          })}
        />
        <ErrorInput errors={errors?.content?.message} />

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
          name="tagsDummy"
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

        <AddImagePost
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClickDropzone={onClickDropzone}
          removeImage={removeImage}
          currentImages={currentImages}
          previewImages={previewImages}
        />

        <Button
          placeholder={undefined}
          size="lg"
          type="submit"
          className={`${nunito.className} h-12 w-full text-center mb-5 py-2 px-4 bg-[var(--blue-05)] normal-case text-base`}>
          Cập nhật
        </Button>
      </form>
    </div>
  )
}

function AddImagePost({
  onDragOver,
  onDrop,
  onClickDropzone,
  removeImage,
  currentImages,
  previewImages,
}) {
  return (
    <div>
      <div className="flex text-gray-700 text-xl font-bold mb-2 ">Thêm ảnh</div>
      <div className="container flex flex-col items-end relative mx-auto my-2">
        <div
          className="border-dashed border-2 w-full border-gray-400 p-4 flex flex-col items-center justify-center hover:cursor-pointer"
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={onClickDropzone}>
          {currentImages.length == 0 && previewImages.length == 0 ? (
            <>
              <FileEarmarkImage className="text-[50px] text-[--secondary]" />
              <p className="text-[--secondary]">
                Chọn hoặc kéo và thả ảnh vào đây
              </p>
              <span className="text-red-700">(Tối đa 5 ảnh)</span>
            </>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              {currentImages.map((image, index) => (
                <div
                  key={image.pictureUrl || index} // Added fallback for key
                  className="relative flex flex-col items-end">
                  <Button
                    placeholder={undefined}
                    className="-mb-8 mr-1 p-2 cursor-pointer bg-black hover:bg-black opacity-75"
                    onClick={(event) => removeImage(index, image.id, event)}>
                    <XLg />
                  </Button>
                  <img
                    src={image.pictureUrl}
                    alt="Ảnh hiện tại"
                    className="w-48 h-48 object-cover rounded-md"
                  />
                </div>
              ))}
              {previewImages.map((image, index) => (
                <div
                  key={image.pictureUrl || index} // Added fallback for key
                  className="relative flex flex-col items-end">
                  <Button
                    placeholder={undefined}
                    className="-mb-8 mr-1 p-2 cursor-pointer bg-black hover:bg-black opacity-75"
                    onClick={(event) =>
                      removeImage(index + currentImages.length, null, event)
                    }>
                    <XLg />
                  </Button>
                  <img
                    src={image.pictureUrl}
                    alt="Ảnh được thêm"
                    className="w-48 h-48 object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
