/* eslint-disable @next/next/no-img-element */
'use client'

import '../../../globals.css'
import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
} from 'react'
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
import ChangeAvatarUser from '@/app/ui/social-page/profile/ChangeAvatarUser'
import ChangeCoverUser from '@/app/ui/social-page/profile/ChangeCoverUser'
import ButtonRedering from '@/app/ui/social-page/profile/ButtonRender'
import { JWT_COOKIE } from '@/app/constant'
import DialogFriend from '@/app/ui/social-page/profile/DialogFriend'

const FormContext = createContext(null)

function AvatarAndCoverUser({
  register,
  getValues,
  user,
  isProfileLoginUser,
  numberFriend,
  friendList,
  hasMore,
  onFetchMoreFriend,
}) {
  const {
    setInputs,
    croppedAvatar,
    setCroppedAvatar,
    coverImage,
    setCoverImage,
  } = useContext(FormContext)

  const [isMounted, setIsMounted] = useState(false)
  const [openChangeCover, setOpenChangeCover] = useState(false)
  const [openFriendDiaolog, setOpenFriendDiaolog] = useState(false)

  const handleOpenFriendDiaolog = () => {
    setOpenFriendDiaolog((e) => !e)
  }
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
        toast.success('Đổi ảnh đại diện thành công')
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

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
        toast.success('Đổi ảnh bìa thành công')
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  const onHandleRequest = () => {
    const data = {
      friendId: user?.user?.id,
    }
    console.log(data)
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/friends/requests`,
        data,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Gửi lời mời kết bạn thành công')
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  const handledeletefriend = () => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/friends/${user?.user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Xóa bạn bè thành công')
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  return (
    <div className="relative">
      <figure className="relative h-40 xl:h-96 w-full">
        <img
          src={coverImage}
          alt="user cover"
          className="w-full h-40 xl:h-96 object-cover object-center"
        />
        {isMounted && isProfileLoginUser && (
          <figcaption className="absolute bottom-0 left-2/4 flex justify-end w-full -translate-x-2/4 py-2 px-4">
            <Button
              placeholder={undefined}
              onClick={handleOpenChangeCover}
              className="text-[14px] text-black flex w-fit justify-end items-center gap-2 rounded-lg bg-[white] py-2 px-4 z-10">
              <Camera className="text-lg" />
              Chỉnh sửa ảnh bìa
            </Button>
          </figcaption>
        )}
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

        {isProfileLoginUser && (
          <ChangeAvatarUser
            register={register}
            getValues={getValues}
            setInputs={setInputs}
            setCroppedAvatar={setCroppedAvatar}
            handleChangeAvatar={handleChangeAvatar}
          />
        )}
      </div>

      <div className="mt-6 flex justify-between items-center ml-[24vw] md:ml-[16vw] xl:ml-[17vw] 2xl:ml-[17%]">
        <div className="flex flex-col w-full">
          <div className="flex justify-between items-center w-full">
            <p className="text-[20px] xl:text-[28px] font-bold flex items-center gap-2">
              {user?.user?.fullName}
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
            <ButtonRedering
              isProfileLoginUser={isProfileLoginUser}
              onHandleRequest={onHandleRequest}
              handledeletefriend={handledeletefriend}
              user={user}
            />
          </div>

          <div
            className="flex items-center gap-2 hover:underline hover:cursor-pointer"
            onClick={handleOpenFriendDiaolog}>
            <p className="text-black font-bold">{numberFriend}</p>
            <p className="text-[--secondary]"> bạn bè</p>
          </div>

          <DialogFriend
            friendList={friendList}
            openFriendDiaolog={openFriendDiaolog}
            handleOpenFriendDiaolog={handleOpenFriendDiaolog}
            userFullName={user?.user?.fullName}
            hasMore={hasMore}
            onFetchMoreFriend={onFetchMoreFriend}
          />

          <div>
            {friendList.slice(0, 7).map(({ friend }) => (
              <Link key={friend.id} href={`/profile/${friend.id}/about`}>
                <Avatar
                  size="sm"
                  src={friend.avatarUrl}
                  placeholder={undefined}
                />
              </Link>
            ))}
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
  const [friendList, setFriendList] = useState([])
  const userId = Cookies.get('userId')
  const part = pathname.split('/')
  const isProfileLoginUser = userId === part[2]
  const [numberFriend, setNumberFriend] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const curPage = useRef(0)
  const [totalPages, setTotalPages] = useState(1)

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  const handleClickTab = (url) => {
    setActiveTab(url)
    router.push(`/profile/${params.id}/${url}`)
  }

  const onFetchMoreFriend = () => {
    curPage.current++
    if (curPage.current >= totalPages) {
      setHasMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userId}/friends?page=${curPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { friends } }) => {
        setFriendList(friendList.concat(friends))
      })
      .catch((err) => {})
  }

  useEffect(() => {
    const userPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${part[2]}/profile`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    const userFriendPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${part[2]}/friends/count`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    const userFriendListPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${part[2]}/friends`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([userPromise, userFriendPromise, userFriendListPromise])
      .then(([userRes, userFriendRes, userFriendListRes]) => {
        setUser(userRes.data)
        setCroppedAvatar(
          userRes.data?.user?.avatarUrl === null
            ? '/placeholderImage.png'
            : userRes.data?.user?.avatarUrl
        )
        setCoverImage(
          userRes.data?.user?.coverUrl === null
            ? '/placeholderImage.png'
            : userRes.data?.user?.coverUrl
        )
        setNumberFriend(userFriendRes.data)
        setFriendList(userFriendListRes.data.friends)

        setHasMore(userFriendListRes.data.totalPages > 0)
        setTotalPages(userFriendListRes.data.totalPages) // Set total pages here
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
        {isMounted && (
          <AvatarAndCoverUser
            register={register}
            getValues={getValues}
            user={user}
            isProfileLoginUser={isProfileLoginUser}
            numberFriend={numberFriend}
            friendList={friendList}
            hasMore={hasMore}
            onFetchMoreFriend={onFetchMoreFriend}
          />
        )}
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
