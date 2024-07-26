'use client'

import React, { useState, useEffect } from 'react'
import { PencilFill, Award, Briefcase, PlusCircle } from 'react-bootstrap-icons'
import {
  Button,
  Dialog,
  DialogFooter,
  DialogBody,
  DialogHeader,
  Input,
  Checkbox,
} from '@material-tailwind/react'
import { nunito } from '../../fonts'
import axios from 'axios'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import ErrorInput from '@/app/ui/error-input'
import toast from 'react-hot-toast'

export function DialogAddEducation({
  openDialogAddEducation,
  handleOpenDialogAddEducation,
  onHandleAddEducation,
}) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data, e) => {
    const convertToDDMMYYYY = (mmYYYY: string): string | null => {
      const [year, month] = mmYYYY.split('-')
      if (!month || !year || month.length !== 2 || year.length !== 4) {
        return null
      }
      return `${year}-${month}-01`
    }
    const eudcation = {
      schoolName: data.schoolName,
      degree: data.degree,
      startTime: convertToDDMMYYYY(data.startTime),
      endTime: convertToDDMMYYYY(data.endTime),
      privacy: 'PUBLIC',
      isLearning: false,
    }
    onHandleAddEducation(eudcation, e)
    reset()
  }

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogAddEducation}
      handler={handleOpenDialogAddEducation}>
      <DialogHeader placeholder={undefined}>Thêm học vấn</DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody placeholder={undefined}>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Tên trường</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('schoolName', {
                required: 'Vui lòng nhập tên trường',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.schoolName?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Chứng chỉ</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('degree', {
                required: 'Vui lòng nhập thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.degree?.message} />
          </div>
          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="startTime">
              Ngày bắt đầu
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="startTime"
              type="month"
              //min={todayString}
              //defaultValue={tomorrowString}
              onFocus={(e) => e.target.showPicker()}
              //onChange={(e) => onChange({ date: e.target.value })}
              {...register('startTime', {})}
            />
          </div>

          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="endTime">
              Ngày kết thúc
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="endTime"
              type="month"
              //min={todayString}
              //defaultValue={tomorrowString}
              onFocus={(e) => e.target.showPicker()}
              //onChange={(e) => onChange({ date: e.target.value })}
              {...register('endTime', {})}
            />
          </div>
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
            placeholder={undefined}
            onClick={handleOpenDialogAddEducation}>
            Hủy
          </Button>
          <Button
            type="submit"
            className={`${nunito.className} bg-[--blue-05] text-white normal-case text-md`}
            placeholder={undefined}>
            Thêm
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}

function DialogEditEducation({
  openDialogEdit,
  handleOpenDialogEdit,
  educationData,
  setEducationData,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    const convertToDDMMYYYY = (mmYYYY: string): string | null => {
      const [year, month] = mmYYYY.split('-')
      if (!month || !year || month.length !== 2 || year.length !== 4) {
        return null
      }
      return `${year}-${month}-01`
    }
    const education = {
      educationId: educationData.educationId,
      schoolName: data.schoolName,
      degree: data.degree,
      startTime: convertToDDMMYYYY(data.startTime),
      endTime: convertToDDMMYYYY(data.endTime),
      privacy: 'PUBLIC',
      isLearning: data.isLearning,
      isDelete: false,
    }
    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/education/${educationData.educationId}`,
        education,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Cập nhật học vấn thành công')
        handleOpenDialogEdit()
        setEducationData(education)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  const convertToMonthInputValue = (dateTimeString) => {
    const date = new Date(dateTimeString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Add 1 because getMonth() returns 0-11
    return `${year}-${month}`
  }

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogEdit}
      handler={handleOpenDialogEdit}>
      <DialogHeader placeholder={undefined}>Chỉnh sửa học vấn</DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody placeholder={undefined}>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Tên trường</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              defaultValue={educationData.schoolName}
              type="text"
              {...register('schoolName', {
                required: 'Vui lòng nhập thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.schoolName?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Chứng chỉ</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              defaultValue={educationData.degree}
              type="text"
              {...register('degree', {
                required: 'Vui lòng nhập thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.degree?.message} />
          </div>

          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="startTime">
              Ngày bắt đầu
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="startTime"
              type="month"
              defaultValue={convertToMonthInputValue(educationData.startTime)}
              onFocus={(e) => e.target.showPicker()}
              {...register('startTime', {})}
            />
          </div>

          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="endTime">
              Ngày kết thúc
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="endTime"
              type="month"
              defaultValue={convertToMonthInputValue(educationData.endTime)}
              onFocus={(e) => e.target.showPicker()}
              {...register('endTime', {})}
            />
          </div>
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
            placeholder={undefined}
            onClick={handleOpenDialogEdit}>
            Hủy
          </Button>
          <Button
            type="submit"
            className={`${nunito.className} bg-[--blue-05] text-white normal-case text-md`}
            placeholder={undefined}>
            Cập nhật
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}

export default function EducationListItem({ education, isProfileLoginUser }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [educationData, setEducationData] = useState(education)
  console.log(education)
  function handleOpenEditDialog() {
    setOpenEditDialog((e) => !e)
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-start gap-4">
        <Award className="text-[20px] lg:text-[24px]" />
        <div>
          <p className="text-base lg:text-[20px] font-semibold">
            {educationData.schoolName}
          </p>
          <p className="text-[12px] lg:text-base text-black font-semibold">
            {educationData.degree}
          </p>
          <p className="text-[12px] lg:text-base text-[--secondary] font-semibold">
            {moment(educationData.startTime).local().format('MM/YYYY')} -{' '}
            {educationData.endTime === null
              ? 'Hiện tại'
              : moment(educationData.endTime).local().format('MM/YYYY')}
          </p>
        </div>
      </div>
      {isProfileLoginUser && (
        <Button
          placeholder={undefined}
          onClick={handleOpenEditDialog}
          className="p-2 rounded-full bg-[#E4E4E7]"
          variant="text">
          <PencilFill className="text-[14px] lg:text-lg" />
        </Button>
      )}

      <DialogEditEducation
        openDialogEdit={openEditDialog}
        handleOpenDialogEdit={handleOpenEditDialog}
        educationData={educationData}
        setEducationData={setEducationData}
      />
    </div>
  )
}
