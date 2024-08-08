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

function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function DialogAddWorks({
  openDialogAddWorks,
  handleOpenDialogAddWorks,
  onHandleAddJob,
}) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowString = tomorrow.toISOString().split('T')[0]

  const onSubmit = (data, e) => {
    const convertToDDMMYYYY = (mmYYYY: string): string | null => {
      const [year, month] = mmYYYY.split('-')
      if (!month || !year || month.length !== 2 || year.length !== 4) {
        return null
      }
      return `${year}-${month}-01`
    }

    const job = {
      companyName: data.companyName,
      position: data.position,
      startTime: convertToDDMMYYYY(data.startTime),
      endTime: data.isWorking ? null : convertToDDMMYYYY(data.endTime),
      privacy: 'PUBLIC',
      isWorking: data.isWorking,
    }

    onHandleAddJob(job, e)
    reset()
  }

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogAddWorks}
      handler={handleOpenDialogAddWorks}>
      <DialogHeader placeholder={undefined}>Thêm công việc</DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody placeholder={undefined}>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Tên công ty</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('companyName', {
                required: 'Vui lòng nhập tên công ty',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.companyName?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Vị trí</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('position', {
                required: 'Vui lòng nhập thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.position?.message} />
          </div>

          <div>
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
                defaultValue={tomorrowString}
                onFocus={(e) => e.target.showPicker()}
                max={getTodayDate()}
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
                defaultValue={tomorrowString}
                onFocus={(e) => e.target.showPicker()}
                max={getTodayDate()}
                //disabled
                //onChange={(e) => onChange({ date: e.target.value })}
                {...register('endTime', {})}
              />
            </div>
          </div>

          <Checkbox
            crossOrigin={undefined}
            type="checkbox"
            label="Hiện đang làm"
            className="h-6 w-6"
            color="blue"
            labelProps={{ className: 'text-black font-medium' }}
            {...register('isWorking')}
          />
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
            placeholder={undefined}
            onClick={handleOpenDialogAddWorks}>
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

function DialogEditWorks({
  openDialogEdit,
  handleOpenDialogEdit,
  jobData,
  setJobData,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const convertToMonthInputValue = (dateTimeString) => {
    const date = new Date(dateTimeString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Add 1 because getMonth() returns 0-11
    return `${year}-${month}`
  }

  const onSubmit = (data) => {
    const convertToDDMMYYYY = (mmYYYY: string): string | null => {
      const [year, month] = mmYYYY.split('-')
      if (!month || !year || month.length !== 2 || year.length !== 4) {
        return null
      }
      return `${year}-${month}-01`
    }

    const job = {
      jobId: jobData.jobId,
      userId: jobData.userId,
      companyName: data.companyName,
      position: data.position,
      startTime: convertToDDMMYYYY(data.startTime),
      endTime: data.isWorking ? null : convertToDDMMYYYY(data.endTime),
      privacy: 'PUBLIC',
      isWorking: data.isWorking,
    }
    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/job/${jobData.jobId}`,
        job,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Cập nhật công việc thành công')
        handleOpenDialogEdit()
        setJobData(job)
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message || 'Lỗi không xác định'
        )
      })
  }

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogEdit}
      handler={handleOpenDialogEdit}>
      <DialogHeader placeholder={undefined}>Chỉnh sửa công việc</DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody placeholder={undefined}>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Tên công ty</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              defaultValue={jobData.companyName}
              type="text"
              {...register('companyName', {
                required: 'Vui lòng nhập thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.title?.message} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">Vị trí</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              defaultValue={jobData.position}
              type="text"
              {...register('position', {
                required: 'Vui lòng nhập thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.position?.message} />
          </div>

          <div>
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
                defaultValue={convertToMonthInputValue(jobData.startTime)}
                onFocus={(e) => e.target.showPicker()}
                max={getTodayDate()}
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
                defaultValue={convertToMonthInputValue(jobData.endTime)}
                onFocus={(e) => e.target.showPicker()}
                max={getTodayDate()}
                {...register('endTime', {})}
              />
            </div>
          </div>

          <Checkbox
            crossOrigin={undefined}
            type="checkbox"
            label="Hiện đang làm"
            defaultChecked={jobData.isWorking}
            className="h-6 w-6"
            color="blue"
            labelProps={{ className: 'text-black font-medium' }}
            {...register('isWorking')}
          />
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

export default function WorksListItem({ job, isProfileLoginUser }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [jobData, setJobData] = useState(job)

  function handleOpenEditDialog() {
    setOpenEditDialog((e) => !e)
  }

  return (
    <div key={jobData.jobId} className="flex justify-between items-center">
      <div className="flex items-start gap-4">
        <Briefcase className="text-[20px] lg:text-[24px]" />
        <div>
          <p className="text-base lg:text-[20px] font-semibold">
            {jobData.companyName}
          </p>
          <p className="text-[12px] lg:text-base text-black font-semibold">
            {jobData.position}
          </p>
          <p className="text-[12px] lg:text-base text-[--secondary] font-semibold">
            {moment(jobData.startTime).local().format('MM/YYYY')} -{' '}
            {jobData.isWorking
              ? 'Hiện tại'
              : moment(jobData.endTime).local().format('MM/YYYY')}
          </p>
        </div>
      </div>

      {isProfileLoginUser && (
        <Button
          placeholder={undefined}
          className="p-2 rounded-full bg-[#E4E4E7]"
          onClick={handleOpenEditDialog}
          variant="text">
          <PencilFill className="text-[14px] lg:text-lg" />
        </Button>
      )}

      <DialogEditWorks
        openDialogEdit={openEditDialog}
        handleOpenDialogEdit={handleOpenEditDialog}
        jobData={jobData}
        setJobData={setJobData}
      />
    </div>
  )
}
