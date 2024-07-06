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
import { usePathname, useSearchParams, useRouter } from 'next/navigation'

export function DialogAddEducation({
  openDialogAddEducation,
  handleOpenDialogAddEducation,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    const eudcation = {
      schoolName: data.schoolName,
      degree: data.degree,
      startTime: data.startTime,
      endTime: data.endTime,
      privacy: 'PUBLIC',
      isLearning: false,
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/education`,
        eudcation,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => toast.success('Thêm học vấn thành công'))
      .catch((error) => {
        console.log(error)
      })
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
              type="date"
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
              type="date"
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
  educationId,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const pathname = usePathname()
  const parts = pathname.split('/')
  const userIdParams = parts[2]

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userIdParams}/profile/job/${educationId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { edu } }) => {
        setValue('schoolName', edu.schoolName)
        setValue('startTime', edu.startTime)
        setValue('endTime', edu.endTime)
        setValue('degree', edu.degree)
      })
      .catch((error) => {})
  }, [])

  const onSubmit = (data) => {
    const education = {
      schoolName: data.schoolName,
      degree: data.degree,
      startTime: data.startTime,
      endTime: data.endTime,
      privacy: 'PUBLIC',
      isLearning: data.isLearning,
    }
    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/education/${educationId}`,
        education,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => toast.success('Cập nhật học vấn thành công'))
      .catch((error) => {
        console.log(error)
      })
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
                type="date"
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
                type="date"
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

export default function EducationListItem({ education }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)

  function handleOpenEditDialog() {
    setOpenEditDialog((e) => !e)
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-start gap-4">
        <Award className="text-[20px] lg:text-[24px]" />
        <div>
          <p className="text-base lg:text-[20px] font-semibold">
            {education.schoolName}
          </p>
          <p className="text-[12px] lg:text-base text-black font-semibold">
            {education.degree}
          </p>
          <p className="text-[12px] lg:text-base text-[--secondary] font-semibold">
            {moment(education.startTime).local().format('MM/YYYY')} -{' '}
            {education.endTime === null
              ? 'Hiện tại'
              : moment(education.endTime).local().format('MM/YYYY')}
          </p>
        </div>
      </div>
      <Button
        placeholder={undefined}
        onClick={handleOpenEditDialog}
        className="p-2 rounded-full bg-[#E4E4E7]"
        variant="text">
        <PencilFill className="text-[14px] lg:text-lg" />
      </Button>

      <DialogEditEducation
        openDialogEdit={openEditDialog}
        handleOpenDialogEdit={handleOpenEditDialog}
        educationId={education.educationId}
      />
    </div>
  )
}
