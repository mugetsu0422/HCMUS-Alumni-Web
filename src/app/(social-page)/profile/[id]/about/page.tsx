'use client'

import React, { useState, useEffect } from 'react'
import {
  PersonFill,
  Mortarboard,
  PersonVcard,
  Calendar,
  GenderMale,
  GenderFemale,
  TelephoneFill,
  Envelope,
  PencilFill,
  PersonCheckFill,
  InfoCircle,
  BookHalf,
  Link45deg,
} from 'react-bootstrap-icons'
import { Button, Input } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FACULTIES, GENDER } from '@/app/constant'
import axios from 'axios'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'
import ErrorInput from '@/app/ui/error-input'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { usePathname } from 'next/navigation'
import moment from 'moment'

export default function Page() {
  const [openEditBasicInfor, setOpenEditBasicInfor] = useState(false)
  const [openEditVerifyInfor, setOpenEditVerifyInfor] = useState(false)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [userBasicInfor, setUserBasicInfor] = useState(null)
  const [alumniData, setAlumniData] = useState(null)
  const [verifyAlumni, setVerifyAlumni] = useState(null)
  const pathname = usePathname()
  const userId = Cookies.get('userId')
  const part = pathname.split('/')
  const isProfileLoginUser = userId === part[2]
  const [isMounted, setIsMounted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm()

  function handleOpenEditBasicInfor() {
    setOpenEditBasicInfor((e) => !e)
  }

  function handleOpenEditVerifyInfor() {
    setOpenEditVerifyInfor((e) => !e)
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${part[2]}/profile`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        console.log(data)
        setUserBasicInfor(data.user)
        setAlumniData(data.alumni)
        setVerifyAlumni(data.alumniVerification)
        setValue('fullName', data.user.fullName)
        setValue('socialMediaLink', data.user.socialMediaLink)
        setValue('phone', data.user.phone)
        setValue('sex', data.user.sex.id)
        setValue('aboutMe', data.user.aboutMe)
        setValue('dob', data.user.dob)
        setValue('faculty', data.user.faculty.Id)
        setValue('graduationYear', data.alumni.graduationYear)
        setValue('alumClass', data.alumni.alumClass)
        setValue('studentId', data.alumni.studentId)
        setValue('beginningYear', data.alumni.beginningYear)
      })
      .catch((error) => {})
  }, [part[2]])

  function convertToInputDate(timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const onSubmitVerifyInfor = async (data) => {
    const facultyData = {
      name: FACULTIES.find((f) => f.id === data.facultyId)?.name,
      id: data.facultyId,
    }

    const alumni = {
      alumClass: alumniData?.alumClass,
      graduationYear: alumniData?.graduationYear,
    }

    const userData = {
      aboutMe: userBasicInfor?.aboutMe,
      fullName: userBasicInfor?.fullName,
      sexId: Number(userBasicInfor?.sex) || null,
      phone: String(userBasicInfor?.phone),
      dob: String(userBasicInfor?.dob),
      socialMediaLink: userBasicInfor?.socialMediaLink,
      facultyId: Number(data.facultyId) || null,
    }

    const userVerification = {
      studentId: data.studentId,
      beginningYear: data.beginningYear,
      faculty: facultyData,
      socialMediaLink: userBasicInfor?.socialMediaLink,
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile`,
        { user: userData, alumni },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )

      await axios
        .put(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification`,
          userVerification,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            },
          }
        )
        .then(() => {
          toast.success('Cập nhật thành công')
          handleOpenEditVerifyInfor()
          setUserBasicInfor({
            id: userBasicInfor?.id,
            fullName: userBasicInfor?.fullName,
            socialMediaLink: userBasicInfor?.socialMediaLink,
            email: userBasicInfor?.email,
            avatarUrl: userBasicInfor?.avatarUrl,
            phone: userBasicInfor?.phone,
            sex: {
              name: GENDER.find((gender) => gender.id === userBasicInfor?.sex)
                ?.name,
              id: userBasicInfor?.sex,
            },
            aboutMe: userBasicInfor?.aboutMe,
            coverUrl: userBasicInfor?.coverUrl,
            dob: userBasicInfor?.dob
              ? convertToInputDate(userBasicInfor?.dob)
              : '',
            faculty: {
              name: FACULTIES.find((f) => f.id === data.facultyId)?.name,
              id: data.facultyId,
            },
          })
          setVerifyAlumni((prevState) => ({
            ...prevState,
            ...userVerification,
          }))
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.error?.message || 'Lỗi không xác định'
          )
        })
    } catch {
      ;(error) =>
        toast.error(
          error?.response?.data?.error?.message || 'Lỗi không xác định'
        )
    }
  }

  const onSubmitBasicInfor = async (data) => {
    const alumni = {
      alumClass: data.alumClass,
      graduationYear: data.graduationYear,
    }
    const userData = {
      aboutMe: data.aboutMe,
      fullName: data.fullName,
      sexId: Number(data.sex) || null,
      phone: String(data.phone),
      dob: String(data.dob),
      socialMediaLink: data.socialMediaLink,
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile`,
        { user: userData, alumni },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      toast.success('Cập nhật thành công')
      handleOpenEditBasicInfor()
      setAlumniData({
        graduationYear: data.graduationYear,
        alumClass: data.alumClass,
        studentId: alumniData?.studentId,
      })
      const facultyId = userBasicInfor?.faculty?.id
      setUserBasicInfor({
        id: userBasicInfor?.id,
        fullName: data.fullName,
        socialMediaLink: data.socialMediaLink,
        email: userBasicInfor?.email,
        avatarUrl: userBasicInfor?.avatarUrl,
        phone: data.phone,
        sex: {
          name: GENDER.find((gender) => gender.id === data.sex)?.name,
          id: data.sex,
        },
        aboutMe: data.aboutMe,
        coverUrl: userBasicInfor?.coverUrl,
        dob: data.dob ? convertToInputDate(data.dob) : '',
        faculty: {
          name: FACULTIES.find((f) => f.id === String(facultyId))?.name,
          id: Number(userBasicInfor?.faculty?.id),
        },
      })
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }

  const onSendRequest = () => {
    const verification = {
      avatar: userBasicInfor?.avatarUrl || '',
      fullName: userBasicInfor?.fullName,
      studentId: verifyAlumni?.studentId || '',
      beginningYear: verifyAlumni?.beginningYear || '',
      socialMediaLink: userBasicInfor?.socialMediaLink || '',
      facultyId: +userBasicInfor?.faculty.id || '',
    }
    if (verifyAlumni === null) {
      axios
        .postForm(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification`,
          verification,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            },
          }
        )
        .then(() => toast.success('Gửi yêu cầu xét duyệt thành công'))
        .catch((error) => {
          toast.error(
            error.response?.data?.error?.message || 'Lỗi không xác định'
          )
        })
    } else {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/alumni-verification`,
          verification,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
            },
          }
        )
        .then(() => toast.success('Gửi yêu cầu xét duyệt thành công'))
        .catch((error) => {
          toast.error(
            error.response?.data?.error?.message || 'Lỗi không xác định'
          )
        })
    }
  }

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  if (!isMounted) return null
  return (
    <div className="overflow-x-auto scrollbar-webkit-main">
      {/* Thông tin cá nhân */}
      <form
        onSubmit={handleSubmit(onSubmitBasicInfor)}
        className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[18px] lg:text-[22px] font-bold">
            Thông tin cơ bản
          </p>

          {isProfileLoginUser &&
            (!openEditBasicInfor ? (
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[#e4e4e7] text-black px-2"
                  placeholder={undefined}
                  onClick={handleOpenEditBasicInfor}>
                  <PencilFill /> Chỉnh sửa thông tin
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[#e4e4e7] text-black px-4"
                  placeholder={undefined}
                  onClick={handleOpenEditBasicInfor}>
                  Hủy
                </Button>

                <Button
                  type="submit"
                  className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[--blue-05] text-white px-4"
                  placeholder={undefined}>
                  Cập nhật
                </Button>
              </div>
            ))}
        </div>

        {/* About me */}

        <div className="flex items-start gap-4">
          <InfoCircle className="text-[20px] lg:text-[24px]" />
          {!openEditBasicInfor ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {userBasicInfor?.aboutMe}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Mô tả bản thân
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-[40%]">
              <label className="text-lg font-bold text-black">
                Mô tả bản thân
              </label>
              <Input
                crossOrigin={undefined}
                type="text"
                variant="outlined"
                defaultValue={userBasicInfor?.aboutMe}
                {...register('aboutMe')}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
              />
            </div>
          )}
        </div>

        {/* Tên */}

        <div className="flex items-start gap-4">
          <PersonFill className="text-[20px] lg:text-[24px]" />
          {!openEditBasicInfor ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {userBasicInfor?.fullName}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">Tên</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-[40%]">
              <label className="text-lg font-bold text-black">Tên</label>
              <Input
                crossOrigin={undefined}
                variant="outlined"
                type="text"
                defaultValue={userBasicInfor?.fullName}
                {...register('fullName', {
                  required: 'Vui lòng nhập thành tựu',
                })}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
              />
              <ErrorInput errors={errors?.fullName?.message} />
            </div>
          )}
        </div>

        {/* Lớp - Năm tốt nghiệp */}

        <div className="flex items-start gap-4">
          <BookHalf className="text-[20px] lg:text-[24px]" />
          {openEditBasicInfor && alumniData !== null ? (
            <div className="flex flex-col lg:flex-row gap-4 w-[40%]">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-bold text-black">Lớp</label>
                <Input
                  crossOrigin={undefined}
                  variant="outlined"
                  defaultValue={alumniData?.alumClass}
                  type="text"
                  {...register('alumClass')}
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                  className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
                />
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-lg font-bold text-black">
                    Năm tốt nghiệp
                  </label>
                  <Input
                    crossOrigin={undefined}
                    variant="outlined"
                    type="number"
                    defaultValue={alumniData?.graduationYear}
                    {...register('graduationYear', {
                      pattern: {
                        value: /^\d{4}$/,
                        message: 'Vui lòng nhập đúng 4 chữ số',
                      },
                    })}
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement
                      input.value = input.value.trim().slice(0, 4)
                    }} //
                    labelProps={{
                      className: 'before:content-none after:content-none',
                    }}
                    className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {alumniData?.alumClass}
                {alumniData?.alumClass && alumniData?.graduationYear && ' - '}
                {alumniData?.graduationYear}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Lớp - Năm tốt nghiệp
              </p>
            </div>
          )}
        </div>

        {/* Ngày sinh */}

        <div className="flex items-start gap-4">
          <Calendar className="text-[20px] lg:text-[24px]" />
          {!openEditBasicInfor ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {userBasicInfor?.dob &&
                  moment(userBasicInfor?.dob)
                    .local()
                    .format('DD/MM/YYYY')}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Ngày sinh
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-[40%]">
              <label className="text-lg font-bold text-black">Ngày sinh</label>
              <input
                className="w-full my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
                id="dob"
                type="date"
                defaultValue={
                  userBasicInfor?.dob && convertToInputDate(userBasicInfor?.dob)
                }
                onFocus={(e) => e.target.showPicker()}
                {...register('dob', {})}
              />
              <ErrorInput errors={errors?.dob?.message} />
            </div>
          )}
        </div>

        {/* Giới tính */}

        <div className="flex items-start gap-4">
          {userBasicInfor?.sex?.name === 'Nam' ? (
            <GenderMale className="text-[20px] lg:text-[24px]" />
          ) : (
            <GenderFemale className="text-[20px] lg:text-[24px]" />
          )}

          {!openEditBasicInfor ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {userBasicInfor?.sex?.name}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Giới tính
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-black">Giới tính</label>
              <select
                className="h-10 text-[14px] hover:cursor-pointer pl-3 pr-2 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
                {...register('sex')}
                defaultValue={userBasicInfor?.sex?.id}>
                <option value={0}>Không</option>
                {GENDER.map(({ id, name }) => {
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  )
                })}
              </select>
            </div>
          )}
        </div>
      </form>

      {/* Thông tin liên hệ */}
      <div className="w-full flex flex-col gap-4 mt-4">
        <p className="text-[18px] lg:text-[22px] font-bold">
          Thông tin liên hệ
        </p>

        <div className="flex items-start gap-4">
          <TelephoneFill className="text-[20px] lg:text-[24px]" />
          {!openEditBasicInfor ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {userBasicInfor?.phone !== 'null' && userBasicInfor?.phone}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Di động
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-[40%]">
              <label className="text-lg font-bold text-black">
                Số điện thoại
              </label>
              <Input
                crossOrigin={undefined}
                variant="outlined"
                type="number"
                {...register('phone')}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
              />
            </div>
          )}
        </div>
        {/* href={user && user.socialMediaLink} */}
        <div className="flex items-start gap-4">
          <Link45deg className="text-[20px] lg:text-[24px]" />
          {!openEditBasicInfor ? (
            <div>
              <Link
                href={`${userBasicInfor?.socialMediaLink}`}
                target="blank"
                className="text-base lg:text-[20px] font-semibold">
                {userBasicInfor?.socialMediaLink}
              </Link>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Trang cá nhân
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-[40%]">
              <label className="text-lg font-bold text-black">
                Trang cá nhân
              </label>
              <Input
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
                {...register('socialMediaLink', {
                  pattern: {
                    value:
                      /(https?:\/)?(www\.)?(?:facebook\.com|linkedin\.com)\/(?:[^\s\/]+)/,
                    message: 'Hãy nhập đúng đường dẫn',
                  },
                })}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                crossOrigin={undefined}
              />
              {/* <ErrorInput errors={errors?.name?.message} /> */}
            </div>
          )}
        </div>

        <div className="flex items-start gap-4">
          <Envelope className="text-[20px] lg:text-[24px]" />
          <div>
            <p className="text-base lg:text-[20px] font-semibold">
              {userBasicInfor?.email}
            </p>
            <p className="text-[12px] lg:text-base text-[--secondary]">Email</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmitVerifyInfor)}
        className="w-full flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <p className="text-[18px] lg:text-[22px] font-bold">
            Thông tin xét duyệt
          </p>
          {isProfileLoginUser &&
            (!openEditVerifyInfor ? (
              <div className="flex gap-2">
                {verifyAlumni?.status === 'APPROVED' ? (
                  ' '
                ) : (
                  <>
                    <Button
                      className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[#e4e4e7] text-black px-4"
                      placeholder={undefined}
                      onClick={handleOpenEditVerifyInfor}>
                      <PencilFill /> Chỉnh sửa thông tin
                    </Button>

                    <Button
                      onClick={onSendRequest}
                      placeholder={undefined}
                      className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[--blue-05] text-white px-4">
                      <PersonCheckFill className="text-base" />
                      Yêu cầu xét duyệt
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[#e4e4e7] text-black px-4"
                  placeholder={undefined}
                  onClick={handleOpenEditVerifyInfor}>
                  Hủy
                </Button>

                <Button
                  type="submit"
                  className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[--blue-05] text-white px-4"
                  placeholder={undefined}>
                  Cập nhật
                </Button>
              </div>
            ))}
        </div>
        {/* Khóa */}
        <div className="flex items-start gap-4">
          <Mortarboard className="text-[20px] lg:text-[24px]" />
          {openEditVerifyInfor && verifyAlumni?.status !== 'APPROVED' ? (
            <div className="flex flex-col lg:flex-row gap-4 w-[40%]">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-lg font-bold text-black">Khóa</label>
                <Input
                  crossOrigin={undefined}
                  variant="outlined"
                  type="number"
                  defaultValue={verifyAlumni?.beginningYear}
                  {...register('beginningYear', {
                    pattern: {
                      value: /^\d{4}$/,
                      message: 'Vui lòng nhập đúng 4 chữ số',
                    },
                  })}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement
                    input.value = input.value.trim().slice(0, 4)
                  }} //
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                  className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {verifyAlumni?.beginningYear}{' '}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Khóa
              </p>
            </div>
          )}
        </div>
        {/* Mã số sinh viên */}

        <div className="flex items-start gap-4">
          <Mortarboard className="text-[20px] lg:text-[24px]" />
          {openEditVerifyInfor && verifyAlumni?.status !== 'APPROVED' ? (
            <div className="flex flex-col gap-2 w-[40%]">
              <label className="text-lg font-bold text-black">
                Mã số sinh viên
              </label>
              <Input
                crossOrigin={undefined}
                variant="outlined"
                type="number"
                defaultValue={verifyAlumni?.studentId}
                {...register('studentId', {
                  pattern: {
                    value: /^\d{8}$/,
                    message: 'Vui lòng nhập đúng 8 chữ số',
                  },
                })}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement
                  input.value = input.value.trim().slice(0, 8)
                }} //
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 w-full"
              />
            </div>
          ) : (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {verifyAlumni?.studentId}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Mã số sinh viên
              </p>
            </div>
          )}
        </div>

        {/* Khoa */}
        <div className="flex items-start gap-4">
          <PersonVcard className="text-[20px] lg:text-[24px]" />
          {openEditVerifyInfor && verifyAlumni?.status !== 'APPROVED' ? (
            <div className="flex flex-col lg:flex-row gap-2 w-[40%]">
              <div className="flex flex-col gap-2 w-[40%]">
                <label className="text-lg font-bold text-black">Khoa</label>
                <select
                  className="w-fit h-10 text-[14px] hover:cursor-pointer pl-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
                  {...register('facultyId')}
                  defaultValue={userBasicInfor?.faculty?.id}>
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
          ) : (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {userBasicInfor?.faculty?.name}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Khoa
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
