'use client'

import React, { useState } from 'react'
import { PencilFill, Award, Briefcase, PlusCircle } from 'react-bootstrap-icons'
import {
  Button,
  Dialog,
  DialogFooter,
  DialogBody,
  DialogHeader,
  Input,
} from '@material-tailwind/react'
import { nunito } from '../../../../../ui/fonts'

const user = {
  fullName: 'Trương Samuel',
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
    id: 1,
    name: 'Employment Hero',
    startTime: '2023',
    endTime: 'Hiện tại',
    position: 'Junior FE',
  },
  {
    id: 2,
    name: 'Công ty cổ phần VNG',
    startTime: '2020',
    endTime: '2023',
    position: 'Intern FE',
  },
]

const educations = [
  {
    id: '1',
    name: 'Chương trình đại học',
    skill: 'Đã tốt nghiệp',
  },
]
function DialogAddWorks({ openDialogAddWorks, handleOpenDialogAddWorks }) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const todayString = today.toISOString().split('T')[0]
  const tomorrowString = tomorrow.toISOString().split('T')[0]

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogAddWorks}
      handler={handleOpenDialogAddWorks}>
      <DialogHeader placeholder={undefined}>Thêm công việc</DialogHeader>
      <DialogBody placeholder={undefined}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-black">Tên công ty</label>
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

        <div>
          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="dateBegin">
              Ngày bắt đầu
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="dateBegin"
              type="date"
              defaultValue={tomorrowString}
              onFocus={(e) => e.target.showPicker()}
              //onChange={(e) => onChange({ date: e.target.value })}
              // {...register('date', {})}
            />
          </div>

          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="dateEnd">
              Ngày kết thúc
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="dateEnd"
              type="date"
              defaultValue={tomorrowString}
              onFocus={(e) => e.target.showPicker()}
              //onChange={(e) => onChange({ date: e.target.value })}
              // {...register('date', {})}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-black">Vị trí</label>
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
          onClick={handleOpenDialogAddWorks}>
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

function DialogEditWorks({ openDialogEdit, handleOpenDialogEdit }) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const todayString = today.toISOString().split('T')[0]
  const tomorrowString = tomorrow.toISOString().split('T')[0]

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogEdit}
      handler={handleOpenDialogEdit}>
      <DialogHeader placeholder={undefined}>Chỉnh sửa công việc</DialogHeader>
      <DialogBody placeholder={undefined}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-black">Tên công ty</label>
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

        <div>
          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="dateBegin">
              Ngày bắt đầu
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="dateBegin"
              type="date"
              min={todayString}
              defaultValue={tomorrowString}
              onFocus={(e) => e.target.showPicker()}
              //onChange={(e) => onChange({ date: e.target.value })}
              // {...register('date', {})}
            />
          </div>

          <div>
            <label
              className="text-lg font-bold text-black mr-4"
              htmlFor="dateEnd">
              Ngày kết thúc
            </label>
            <input
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              id="dateEnd"
              type="date"
              min={todayString}
              defaultValue={tomorrowString}
              onFocus={(e) => e.target.showPicker()}
              //onChange={(e) => onChange({ date: e.target.value })}
              // {...register('date', {})}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-black">Vị trí</label>
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
          Cập nhật
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

function WorksListItem({ id, name, position, startTime, endTime }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)

  function handleOpenEditDialog() {
    setOpenEditDialog((e) => !e)
  }

  return (
    <div key={id} className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Briefcase className="text-[20px] lg:text-[24px]" />
        <div>
          <p className="text-base lg:text-[20px] font-semibold">{name}</p>
          <p className="text-[12px] lg:text-base text-black font-semibold">
            {position}
          </p>
          <p className="text-[12px] lg:text-base text-[--secondary] font-semibold">
            {startTime} - {endTime}
          </p>
        </div>
      </div>
      <Button
        placeholder={undefined}
        className="p-2 rounded-full bg-[#E4E4E7]"
        onClick={handleOpenEditDialog}
        variant="text">
        <PencilFill className="text-[14px] lg:text-lg" />
      </Button>

      <DialogEditWorks
        openDialogEdit={openEditDialog}
        handleOpenDialogEdit={handleOpenEditDialog}
      />
    </div>
  )
}

function DialogAddEducation({
  openDialogAddEducation,
  handleOpenDialogAddEducation,
}) {
  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogAddEducation}
      handler={handleOpenDialogAddEducation}>
      <DialogHeader placeholder={undefined}>Thêm học vấn</DialogHeader>
      <DialogBody placeholder={undefined}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-black">
            Trình độ học vấn
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

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-black">Tình trạng</label>
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
          onClick={handleOpenDialogAddEducation}>
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

function DialogEditEducation({ openDialogEdit, handleOpenDialogEdit }) {
  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogEdit}
      handler={handleOpenDialogEdit}>
      <DialogHeader placeholder={undefined}>Chỉnh sửa học vấn</DialogHeader>
      <DialogBody placeholder={undefined}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-black">
            Trình độ học vấn
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

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-black">Tình trạng</label>
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
          Cập nhật
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

function EducationListItem({ id, name, skill }) {
  const [openEditDialog, setOpenEditDialog] = useState(false)

  function handleOpenEditDialog() {
    setOpenEditDialog((e) => !e)
  }

  return (
    <div key={id} className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Award className="text-[20px] lg:text-[24px]" />
        <div>
          <p className="text-base lg:text-[20px] font-semibold">{name}</p>
          <p className="text-[12px] lg:text-base text-[--secondary]">{skill}</p>
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
      />
    </div>
  )
}

export default function Page() {
  const [openDialogAddWorks, setOpenDialogAddWorks] = useState(false)
  const [openDialogAddEducation, setOpenDialogAddEducation] = useState(false)

  function handleOpenDialogAddWorks() {
    setOpenDialogAddWorks((e) => !e)
  }

  function handleOpenDialogAddEducation() {
    setOpenDialogAddEducation((e) => !e)
  }

  return (
    <div>
      {/* Thông tin cá nhân */}
      <div className="w-full flex flex-col gap-4">
        <p className="text-[18px] lg:text-[22px] font-bold">Công việc</p>
        <Button
          placeholder={undefined}
          className="w-fit  normal-case text-[--blue-05] text-[15px] font-light flex items-center gap-4 px-2"
          onClick={handleOpenDialogAddWorks}
          variant="text">
          <PlusCircle className="text-xl" />
          Thêm nơi làm việc
        </Button>
        {works.length > 0 ? (
          works.map(({ id, name, position, startTime, endTime }) => (
            <WorksListItem
              key={id}
              id={id}
              name={name}
              position={position}
              startTime={startTime}
              endTime={endTime}
            />
          ))
        ) : (
          <div className="flex items-center gap-2">
            <Briefcase className="text-[20px] lg:text-[24px]" /> Không có thành
            tựu nổi bật để hiển thị
          </div>
        )}
      </div>
      <DialogAddWorks
        openDialogAddWorks={openDialogAddWorks}
        handleOpenDialogAddWorks={handleOpenDialogAddWorks}
      />
      {/* Thông tin liên hệ */}
      <div className="w-full flex flex-col gap-4 mt-4">
        <p className="text-[18px] lg:text-[22px] font-bold">Học vấn</p>
        <Button
          placeholder={undefined}
          className="w-fit  normal-case text-[--blue-05] text-[15px] font-light flex items-center gap-4 px-2"
          onClick={handleOpenDialogAddEducation}
          variant="text">
          <PlusCircle className="text-xl" />
          Thêm trình độ học vấn
        </Button>

        <DialogAddEducation
          handleOpenDialogAddEducation={handleOpenDialogAddEducation}
          openDialogAddEducation={openDialogAddEducation}
        />
        {educations.map(({ id, name, skill }) => (
          <EducationListItem key={id} id={id} name={name} skill={skill} />
        ))}
      </div>
    </div>
  )
}
