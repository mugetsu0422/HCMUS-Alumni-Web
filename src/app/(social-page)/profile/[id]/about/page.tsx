'use client'

import React, { useState } from 'react'
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
} from 'react-bootstrap-icons'
import { Button, Input } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FACULTIES, GENDER } from '@/app/constant'

const user = {
  fullName: 'Trương Samuel',
  numberBegin: 2020,
  faculties: 'Sinh học - Công nghệ sinh học',
  MSSV: 20127610,
  DOB: '01/01/2002',
  gender: 'Nữ',
  phoneNumber: '0123456789',
  email: 'tsamuel20@clc.fitus.edu.vn',
}

export default function Page() {
  const [onpenEdit, setOpenEdit] = useState(false)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowString = tomorrow.toISOString().split('T')[0]

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm()

  function handleOpenEdit() {
    setOpenEdit((e) => !e)
  }

  return (
    <div className="overflow-x-auto scrollbar-webkit-main">
      {/* Thông tin cá nhân */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[18px] lg:text-[22px] font-bold">
            Thông tin cơ bản
          </p>

          {!onpenEdit ? (
            <div className="flex gap-2">
              <Button
                className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[#e4e4e7] text-black px-2"
                placeholder={undefined}
                onClick={handleOpenEdit}>
                <PencilFill /> Chỉnh sửa thông tin
              </Button>

              <Button
                placeholder={undefined}
                className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[--blue-05] text-white px-2">
                <PersonCheckFill className="text-base" />
                Yêu cầu xét duyệt
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[#e4e4e7] text-black px-4"
                placeholder={undefined}
                onClick={handleOpenEdit}>
                Hủy
              </Button>

              <Button
                className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[--blue-05] text-white px-4"
                placeholder={undefined}>
                Cập nhật
              </Button>
            </div>
          )}
        </div>

        {/* Tên */}

        <div className="flex items-start gap-4">
          <PersonFill className="text-[20px] lg:text-[24px]" />
          {!onpenEdit ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {user.fullName}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">Tên</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-black">Tên</label>
              <Input
                crossOrigin={undefined}
                variant="outlined"
                type="text"
                // {...register('name', {
                //   required: 'Vui lòng nhập thành tựu',
                // })}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              {/* <ErrorInput errors={errors?.name?.message} /> */}
            </div>
          )}
        </div>

        {/* Khóa - Khoa */}

        <div className="flex items-start gap-4">
          <Mortarboard className="text-[20px] lg:text-[24px]" />
          {!onpenEdit ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {user.numberBegin} - {user.faculties}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Khóa - Khoa
              </p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-black">Khoa</label>
                <select
                  className="h-10 text-[14px] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
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
                <label className="text-lg font-bold text-black">Khóa</label>
                <Input
                  crossOrigin={undefined}
                  variant="outlined"
                  type="number"
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
                  className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
                />
                {/* <ErrorInput errors={errors?.title?.message} /> */}
              </div>
            </div>
          )}
        </div>

        {/* Mã số sinh viên */}

        <div className="flex items-start gap-4">
          <PersonVcard className="text-[20px] lg:text-[24px]" />
          {!onpenEdit ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {user.MSSV}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Mã số sinh viên
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-black">
                Mã số sinh viên
              </label>
              <Input
                crossOrigin={undefined}
                variant="outlined"
                type="number"
                {...register('MSSV', {
                  pattern: {
                    value: /^\d{4}$/,
                    message: 'Vui lòng nhập đúng 4 chữ số',
                  },
                })}
                onInput={(e) => {
                  const input = e.target as HTMLInputElement
                  input.value = input.value.trim().slice(0, 8)
                }} //
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              {/* <ErrorInput errors={errors?.name?.message} /> */}
            </div>
          )}
        </div>

        {/* Ngày sinh */}

        <div className="flex items-start gap-4">
          <Calendar className="text-[20px] lg:text-[24px]" />
          {!onpenEdit ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {user.DOB}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Ngày sinh
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-black">Ngày sinh</label>
              <input
                className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
                id="date"
                type="date"
                defaultValue={tomorrowString}
                onFocus={(e) => e.target.showPicker()}
                //onChange={(e) => onChange({ date: e.target.value })}
                // {...register('date', {})}
              />
              {/* <ErrorInput errors={errors?.name?.message} /> */}
            </div>
          )}
        </div>

        {/* Giới tính */}

        <div className="flex items-start gap-4">
          {user.gender == 'Nam' ? (
            <GenderMale className="text-[20px] lg:text-[24px]" />
          ) : (
            <GenderFemale className="text-[20px] lg:text-[24px]" />
          )}

          {!onpenEdit ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {user.gender}
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
                {...register('gender')}>
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
      </div>

      {/* Thông tin liên hệ */}
      <div className="w-full flex flex-col gap-4 mt-4">
        <p className="text-[18px] lg:text-[22px] font-bold">
          Thông tin liên hệ
        </p>

        <div className="flex items-start gap-4">
          <TelephoneFill className="text-[20px] lg:text-[24px]" />
          {!onpenEdit ? (
            <div>
              <p className="text-base lg:text-[20px] font-semibold">
                {user.phoneNumber}
              </p>
              <p className="text-[12px] lg:text-base text-[--secondary]">
                Di động
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <label className="text-lg font-bold text-black">
                Số điện thoại
              </label>
              <Input
                crossOrigin={undefined}
                variant="outlined"
                type="number"
                // {...register('name', {
                //   required: 'Vui lòng nhập thành tựu',
                // })}
                labelProps={{
                  className: 'before:content-none after:content-none',
                }}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              {/* <ErrorInput errors={errors?.name?.message} /> */}
            </div>
          )}
        </div>

        <div className="flex items-start gap-4">
          <Envelope className="text-[20px] lg:text-[24px]" />
          <div>
            <p className="text-base lg:text-[20px] font-semibold">
              {user.email}
            </p>
            <p className="text-[12px] lg:text-base text-[--secondary]">Email</p>
          </div>
        </div>
      </div>
    </div>
  )
}
