'use client'

import React, { useEffect, useState } from 'react'
import TextEditor from '../../../ui/admin/text-editor/TextEditor'
import { nunito } from '../../../ui/fonts'
import { Input, Button } from '@material-tailwind/react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { JWT_COOKIE } from '../../../constant'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import ErrorInput from '../../../ui/error-input'
import NoData from '../../../ui/no-data'

export default function Page({ params }: { params: { id: string } }) {
  const [news, setNews] = useState(null)
  const [noData, setNoData] = useState(false)
  const [content, setContent] = useState(null)
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

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

  const onSubmit = async(data) => {
    const putToast = toast.loading('Đang cập nhật')

    try {
      // Post without content
      await axios.putForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/${params.id}`,
        { title: data.title, thumbnail: data.thumbnail[0] },
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
        setContent(data.content)
      })
      .catch((e) => {
        setNoData(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

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
              {...register('title', {
                required: 'Vui lòng nhập tiêu đề',
              })}
              // value={inputs.title}
              // onChange={onTitleChange}
              label="Nội dung tiêu đề"
            />
            <ErrorInput
              // This is the error message
              errors={errors?.title?.message}
            />
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
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="object-cover w-[300px] h-[200px]"
                src={news?.thumbnail || '/no-image-placeholder.png'}
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
          </div>
          <div className="flex justify-end gap-x-4 pt-6 ">
            <Button
              placeholder={undefined}
              size="lg"
              type="submit"
              className={`${nunito.className} bg-[var(--secondary)] text-black normal-case text-md`}>
              Hủy
            </Button>
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