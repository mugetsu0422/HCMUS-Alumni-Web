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
} from 'react-bootstrap-icons'
import { Button, Input } from '@material-tailwind/react'

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
            <Button
              className="flex items-center gap-2 text-[10px] lg:text-[14px] normal-case bg-[#e4e4e7] text-black px-2"
              placeholder={undefined}
              onClick={handleOpenEdit}>
              <PencilFill /> Chỉnh sửa thông tin
            </Button>
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

        <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-4">
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
                <label className="text-lg font-bold text-black">Khóa</label>
                <Input
                  crossOrigin={undefined}
                  variant="outlined"
                  type="text"
                  // {...register('name', {
                  //   required: 'Vui lòng nhập thành tựu',
                  // })}
                  labelProps={{
                    className: 'before:content-none after:content-none ',
                  }}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 "
                />
                {/* <ErrorInput errors={errors?.title?.message} /> */}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-black">Khoa</label>
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
                {/* <ErrorInput errors={errors?.title?.message} /> */}
              </div>
            </div>
          )}
        </div>

        {/* Mã số sinh viên */}

        <div className="flex items-center gap-4">
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

        {/* Ngày sinh */}

        <div className="flex items-center gap-4">
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

        {/* Giới tính */}

        <div className="flex items-center gap-4">
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
      </div>

      {/* Thông tin liên hệ */}
      <div className="w-full flex flex-col gap-4 mt-4">
        <p className="text-[18px] lg:text-[22px] font-bold">
          Thông tin liên hệ
        </p>

        <div className="flex items-center gap-4">
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

        <div className="flex items-center gap-4">
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
