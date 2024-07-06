/* eslint-disable @next/next/no-img-element */
'use client'

import '../../../globals.css'
import React, { useState, useEffect, useContext, createContext } from 'react'
import { nunito } from '../../../ui/fonts'
import {
  Button,
  Avatar,
  Tab,
  Tabs,
  TabsHeader,
  Tooltip,
} from '@material-tailwind/react'
import Cookies from 'js-cookie'
import { useForm } from 'react-hook-form'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import axios, { AxiosResponse } from 'axios'
import { CheckCircleFill, XCircleFill, Camera } from 'react-bootstrap-icons'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { PROFILE_TABS } from '../../../constant'
import clsx from 'clsx'
import Image from 'next/image'
import ChangeAvatarUser from '@/app/ui/social-page/profile/ChangeAvatarUser'
import ChangeCoverUser from '@/app/ui/social-page/profile/ChangeCoverUser'
import CustomToaster from '@/app/ui/common/custom-toaster'
import { JWT_COOKIE } from '@/app/constant'

const FormContext = createContext(null)

function AvatarAndCoverUser({ register, getValues, user }) {
  const {
    setInputs,
    croppedAvatar,
    setCroppedAvatar,
    coverImage,
    setCoverImage,
  } = useContext(FormContext)

  const [openChangeCover, setOpenChangeCover] = useState(false)
  const handleOpenChangeCover = () => {
    setOpenChangeCover((e) => !e)
  }

  const handleChangeAvatar = () => {
    const formData = new FormData()

    formData.append('avatar', getValues('avatar')[0]) // Ensure this is a File object

    axios
      .putForm(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((response) => {
        // Handle success response
        toast.success('Avatar updated successfully')
      })
      .catch((error) => {
        // Handle error response
        toast.error('Failed to update avatar')
        console.log(error)
      })
  }

  const handleChangeCover = () => {
    const formData = new FormData()
    formData.append('cover', getValues('cover')[0]) // Ensure this is a File object

    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/cover`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then((response) => {
        toast.success('Cover updated successfully')
      })
      .catch((error) => {
        toast.error('Failed to update cover')
      })
  }

  return (
    <div className="relative">
      <CustomToaster />
      <figure className="relative h-40 xl:h-96 w-full">
        <img
          src={coverImage}
          alt="user cover"
          className="w-full h-40 xl:h-96 object-cover object-center"
        />
        <figcaption className="absolute bottom-0 left-2/4 flex justify-end w-full -translate-x-2/4 py-2 px-4">
          <Button
            placeholder={undefined}
            onClick={handleOpenChangeCover}
            className="text-[14px] text-black flex w-fit justify-end items-center gap-2 rounded-lg bg-[white] py-2 px-4 z-10">
            <Camera className="text-lg" />
            Chỉnh sửa ảnh bìa
          </Button>
        </figcaption>
      </figure>

      <ChangeCoverUser
        register={register}
        getValues={getValues}
        setInputs={setInputs}
        setCoverImage={setCoverImage}
        handleOpenChangeCover={handleOpenChangeCover}
        openChangeCover={openChangeCover}
        handleChangeCover={handleChangeCover}
      />

      <div className="absolute top-[70%] ml-[2vw] 2xl:ml-[1.5vw] lg:top-[50%] xl:top-[70%] flex flex-col items-end">
        <Avatar
          placeholder={undefined}
          src={croppedAvatar}
          alt="user avatar"
          className="w-24 h-24 lg:w-32 lg:h-32 2xl:w-40 2xl:h-40 border-4 border-white border-radius object-cover "
        />

        <ChangeAvatarUser
          register={register}
          getValues={getValues}
          setInputs={setInputs}
          setCroppedAvatar={setCroppedAvatar}
          handleChangeAvatar={handleChangeAvatar}
        />
      </div>

      <div className="mt-6 flex justify-between items-center ml-[24vw] md:ml-[16vw] xl:ml-[17vw] 2xl:ml-[17%]">
        <div className="flex flex-col">
          <p className="text-[28px] font-bold flex items-center gap-2">
            {user?.fullName}
            {user?.alumniVerification?.status === 'APPROVED' ? (
              <Tooltip
                className="bg-[--blue-05] mt-1"
                content="Tài khoản đã xác thực"
                placement="right-end"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}>
                <CheckCircleFill className="text-[20px] text-[--blue-05]" />
              </Tooltip>
            ) : (
              <Tooltip
                className="bg-[--delete] mt-1"
                content="Tài khoản chưa xác thực"
                placement="right-end"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}>
                <XCircleFill className="text-[20px] text-[--delete]" />
              </Tooltip>
            )}
          </p>

          <div className="flex items-center gap-2">
            {/* <p className="text-black font-bold">{user.numberOfFriends}</p>
            <p className="text-[--secondary]">bạn bè</p> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const [inputs, setInputs] = useState({ avatar: null, cover: null })
  const userId = Cookies.get('userId')
  const router = useRouter()
  const [croppedAvatar, setCroppedAvatar] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(() => {
    const parts = pathname.split('/')
    if (parts[3] === undefined) return ''
    return parts[3]
  })
  const [user, setUser] = useState(null)

  const handleClickTab = (url) => {
    setActiveTab(url)
    router.push(`/profile/${params.id}/${url}`)
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userId}/profile`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        setUser(data.user)
        setCroppedAvatar(
          data?.user?.avatarUrl === null
            ? '/placeholderImage.png'
            : data?.user?.avatarUrl
        )
        setCoverImage(
          data?.user?.coverUrl === null
            ? '/placeholderImage.png'
            : data?.user?.coverUrl
        )
      })
      .catch((error) => {})
  }, [userId])

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      avatar: croppedAvatar,
      cover: coverImage,
    },
  })

  return (
    <div
      className={`${nunito.className} max-w-[1350px] min-w-[480px] w-[80%] m-auto overflow-x-hidden mb-10`}>
      <FormContext.Provider
        value={{
          inputs: inputs,
          setInputs: setInputs,
          croppedAvatar: croppedAvatar,
          setCroppedAvatar: setCroppedAvatar,
          coverImage: coverImage,
          setCoverImage: setCoverImage,
        }}>
        <AvatarAndCoverUser
          register={register}
          getValues={getValues}
          user={user}
        />
      </FormContext.Provider>

      <main className="mt-10">
        <Tabs value={activeTab || ''} className="flex w-[90%] m-auto">
          <TabsHeader
            placeholder={undefined}
            className="w-full bg-white"
            indicatorProps={{
              className: 'bg-[#e6f0fb] shadow-none rounded-none z-0',
            }}>
            {PROFILE_TABS.map(({ label, url }) => (
              <Tab
                placeholder={undefined}
                key={label}
                value={label}
                onClick={() => handleClickTab(url)}
                className={clsx({
                  'text-nowrap w-fit font-bold px-4 py-2 xl:px-6 xl:py-4 flex justify-start text-sm lg:text-base z-0':
                    true,
                  'text-nowrap border-b-2 px-4 py-2 border-[--blue-05]  bg-[#e6f0fb] w-fit text-[--blue-05] flex justify-start text-sm lg:text-base z-0':
                    activeTab === url,
                })}
                activeClassName="text-[--blue-05] bg-[#e6f0fb]">
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>

        {children}
      </main>
    </div>
  )
}
