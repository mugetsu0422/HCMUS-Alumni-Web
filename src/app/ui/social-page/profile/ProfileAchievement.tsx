'use client'
import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogFooter,
  DialogBody,
  DialogHeader,
  Input,
} from '@material-tailwind/react'
import { PlusCircle, PencilFill, Star, XLg } from 'react-bootstrap-icons'
import { nunito } from '../../fonts'
import ErrorInput from '../../error-input'
import axios from 'axios'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function DialogAddAchievements({
  openDialogAdd,
  handleOpenDialogAdd,
  onAddAchievements,
}) {
  const {
    reset,
    register,
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

    const achivement = {
      achievementName: data.achievementName,
      achievementType: data.achievementType,
      achievementTime: convertToDDMMYYYY(data.achievementTime),
      privacy: 'PUBLIC',
    }

    onAddAchievements(e, achivement)
    reset()
  }

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogAdd}
      handler={handleOpenDialogAdd}>
      <DialogHeader placeholder={undefined}>
        Thêm thành tựu nổi bật
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody placeholder={undefined}>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">
              Thành tựu nổi bật
            </label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('achievementName', {
                required: 'Vui lòng nhập thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.achievementName?.message} />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-lg font-bold text-black">Lĩnh vực</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              {...register('achievementType', {
                required: 'Vui lòng lĩnh vực thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.achievementType?.message} />
          </div>

          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="startTime">
              Ngày nhận
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="achievementTime"
              type="month"
              //defaultValue={tomorrowString}
              max={getTodayDate()}
              onFocus={(e) => e.target.showPicker()}
              //onChange={(e) => onChange({ date: e.target.value })}
              {...register('achievementTime', {})}
            />
          </div>
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
            placeholder={undefined}
            onClick={handleOpenDialogAdd}>
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

function DialogEditAchievements({
  openEditDialog,
  handleOpenDialogEdit,
  achivementData,
  setAchivementData,
}) {
  const {
    register,
    reset,
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

    const achivement = {
      achievementId: achivementData.achievementId,
      achievementName: data.achievementName,
      achievementType: data.achievementType,
      achievementTime: convertToDDMMYYYY(data.achievementTime),
      privacy: 'PUBLIC',
    }

    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/achievement/${achivementData.achievementId}`,
        achivement,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Cập nhật thành tựu thành công')
        setAchivementData(achivement)
        handleOpenDialogEdit()
        reset()
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
      open={openEditDialog}
      handler={handleOpenDialogEdit}>
      <DialogHeader placeholder={undefined}>
        Chỉnh sửa thành tựu nổi bật
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody placeholder={undefined}>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-bold text-black">
              Thành tựu nổi bật
            </label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              defaultValue={achivementData?.achievementName}
              type="text"
              {...register('achievementName', {
                required: 'Vui lòng nhập thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.achievementName?.message} />
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-lg font-bold text-black">Lĩnh vực</label>
            <Input
              size="md"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              defaultValue={achivementData?.achievementType}
              {...register('achievementType', {
                required: 'Vui lòng nhập loại thành tựu',
              })}
              labelProps={{
                className: 'before:content-none after:content-none',
              }}
              className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            />
            <ErrorInput errors={errors?.achievementType?.message} />
          </div>
          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="startTime">
              Ngày nhận
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="achievementTime"
              type="month"
              defaultValue={convertToMonthInputValue(
                achivementData?.achievementTime
              )}
              max={getTodayDate()}
              onFocus={(e) => e.target.showPicker()}
              //onChange={(e) => onChange({ date: e.target.value })}
              {...register('achievementTime', {})}
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

export default function AchievementListItem({
  achivement,
  isProfileLoginUser,
}) {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [achivementData, setAchivementData] = useState(achivement)
  function handleOpenDialogEdit() {
    setOpenEditDialog((e) => !e)
  }
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-start gap-4">
        <Star className="text-[20px] lg:text-[24px]" />
        <div>
          <p className="text-base lg:text-[20px] font-semibold">
            {achivementData.achievementName}
          </p>
          <p className="text-[12px] lg:text-base text-black font-semibold">
            {achivementData.achievementType}
          </p>
          <p className="text-[12px] lg:text-base text-[--secondary] font-semibold">
            {moment(achivementData.achievementTime).local().format('MM/YYYY')}
          </p>
        </div>
      </div>
      {isProfileLoginUser && (
        <Button
          placeholder={undefined}
          onClick={handleOpenDialogEdit}
          className="p-2 rounded-full bg-[#E4E4E7]"
          variant="text">
          <PencilFill className="text-[14px] lg:text-lg" />
        </Button>
      )}

      <DialogEditAchievements
        openEditDialog={openEditDialog}
        handleOpenDialogEdit={handleOpenDialogEdit}
        achivementData={achivementData}
        setAchivementData={setAchivementData}
      />
    </div>
  )
}
