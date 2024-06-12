'use client'
import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogFooter,
  DialogBody,
  DialogHeader,
  Input,
} from '@material-tailwind/react'
import { PlusCircle, PencilFill, Star, XLg } from 'react-bootstrap-icons'
import { nunito } from '../../../../../ui/fonts'
import ErrorInput from '../../../../../ui/error-input'

const user = {
  fullName: 'Trương Samuel',
  numberOfFriends: 500,
  numberBegin: 2020,
  faculties: 'Công nghệ thông tin',
  MSSV: 20127610,
  DOB: '01/01/2002',
  gender: 'Nam',
  phoneNumber: '0123456789',
  email: 'tsamuel20@clc.fitus.edu.vn',
}

const works = [
  {
    id: '1',
    name: 'Tốt nghiệp trường đại học Khoa Học Tự Nhiên',
    tag: 'Học vấn',
  },
]

function DialogAddAchievements({ openDialogAdd, handleOpenDialogAdd }) {
  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogAdd}
      handler={handleOpenDialogAdd}>
      <DialogHeader placeholder={undefined}>
        Thêm thành tựu nổi bật
      </DialogHeader>
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
            // {...register('title', {
            //   required: 'Vui lòng nhập thành tựu',
            // })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
          {/* <ErrorInput errors={errors?.title?.message} /> */}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="text-lg font-bold text-black">Lĩnh vực</label>
          <Input
            size="md"
            crossOrigin={undefined}
            variant="outlined"
            type="text"
            // {...register('title', {
            //   required: 'Vui lòng nhập thành tựu',
            // })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
          {/* <ErrorInput errors={errors?.title?.message} /> */}
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
          className={`${nunito.className} bg-[--blue-05] text-white normal-case text-md`}
          placeholder={undefined}>
          Thêm
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

function DialogEditAchievements({ openEditDialog, handleOpenDialogEdit }) {
  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openEditDialog}
      handler={handleOpenDialogEdit}>
      <DialogHeader placeholder={undefined}>
        Thêm thành tựu nổi bật
      </DialogHeader>
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
            // {...register('title', {
            //   required: 'Vui lòng nhập thành tựu',
            // })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
          {/* <ErrorInput errors={errors?.title?.message} /> */}
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="text-lg font-bold text-black">Lĩnh vực</label>
          <Input
            size="md"
            crossOrigin={undefined}
            variant="outlined"
            type="text"
            // {...register('title', {
            //   required: 'Vui lòng nhập thành tựu',
            // })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
          {/* <ErrorInput errors={errors?.title?.message} /> */}
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
          className={`${nunito.className} bg-[--blue-05] text-white normal-case text-md`}
          placeholder={undefined}>
          Thêm
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

function AchievementListItem({ id, name, tag }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)
  function handleOpenDialogEdit() {
    setOpenEditDialog((e) => !e)
  }

  return (
    <div key={id} className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Star className="text-[20px] lg:text-[24px]" />
        <div>
          <p className="text-base lg:text-[20px] font-semibold">{name}</p>
          <p className="text-[12px] lg:text-base text-[--secondary]">{tag}</p>
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
      />
    </div>
  )
}

export default function Page() {
  const [openDialogAdd, setOpenDialogAdd] = useState(false)

  function handleOpenDialogAdd() {
    setOpenDialogAdd((e) => !e)
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-4">
        <p className="text-[18px] lg:text-[22px] font-bold">
          Thành tựu nổi bật
        </p>
        <div className="w-full flex flex-col gap-4">
          <Button
            placeholder={undefined}
            className="w-fit  normal-case text-[--blue-05] text-[15px] font-light flex items-center gap-4 px-2"
            onClick={handleOpenDialogAdd}
            variant="text">
            <PlusCircle className="text-xl" />
            Thêm nơi thành tựu nổi bật
          </Button>

          {works.length > 0 ? (
            works.map(({ id, name, tag }) => (
              <AchievementListItem key={id} id={id} name={name} tag={tag} />
            ))
          ) : (
            <div className="flex items-center gap-2">
              <Star className="text-[20px] lg:text-[24px]" /> Không có thành tựu
              nổi bật để hiển thị
            </div>
          )}
        </div>
        <DialogAddAchievements
          openDialogAdd={openDialogAdd}
          handleOpenDialogAdd={handleOpenDialogAdd}
        />
      </div>
    </div>
  )
}
