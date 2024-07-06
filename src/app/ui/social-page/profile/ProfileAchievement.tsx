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

export function DialogAddAchievements({ openDialogAdd, handleOpenDialogAdd }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    const achivement = {
      achievementName: data.achievementName,
      achievementType: data.achievementType,
      achievementTime: data.achievementTime,
      privacy: 'PUBLIC',
    }

    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/achievement`,
        achivement,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => toast.success('Thêm thành tựu thành công'))
      .catch((error) => {
        console.log(error)
      })
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
              type="date"
              //defaultValue={tomorrowString}
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
  achievementId,
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
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userIdParams}/profile/achievement/${achievementId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { achievement } }) => {
        setValue('achievementName', achievement.achievementName)
        setValue('achievementType', achievement.achievementType)
        setValue('achievementTime', achievement.achievementTime)
      })
      .catch((error) => {})
  }, [])

  const onSubmit = (data) => {
    const achivement = {
      achievementName: data.achievementName,
      achievementType: data.achievementType,
      achievementTime: data.achievementTime,
      privacy: 'PUBLIC',
    }

    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/achievement/${achievementId}`,
        achivement,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => toast.success('Cập nhật thành tựu thành công'))
      .catch((error) => {
        console.log(error)
      })
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
                required: 'Vui lòng nhập thành tựu',
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
              type="date"
              //defaultValue={tomorrowString}
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

export default function AchievementListItem({ achivement }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  function handleOpenDialogEdit() {
    setOpenEditDialog((e) => !e)
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-start gap-4">
        <Star className="text-[20px] lg:text-[24px]" />
        <div>
          <p className="text-base lg:text-[20px] font-semibold">
            {achivement?.achievementName}
          </p>
          <p className="text-[12px] lg:text-base text-black font-semibold">
            {achivement?.achievementType}
          </p>
          <p className="text-[12px] lg:text-base text-[--secondary] font-semibold">
            {moment(achivement?.achievementTime)
              .local()
              .format('MM/YYYY')}
          </p>
        </div>
      </div>
      <Button
        placeholder={undefined}
        onClick={handleOpenDialogEdit}
        className="p-2 rounded-full bg-[#E4E4E7]"
        variant="text">
        <PencilFill className="text-[14px] lg:text-lg" />
      </Button>

      <DialogEditAchievements
        openEditDialog={openEditDialog}
        handleOpenDialogEdit={handleOpenDialogEdit}
        achievementId={achivement.achievementId}
      />
    </div>
  )
}
