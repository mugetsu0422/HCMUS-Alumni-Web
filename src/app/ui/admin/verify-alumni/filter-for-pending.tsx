'use client'

import React from 'react'
import { Input, Button, Radio } from '@material-tailwind/react'
import {
  CaretDownFill,
  SortAlphaUp,
  SortAlphaDown,
} from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { FACULTIES } from '../../../constant'

const filerBtn = [
  {
    type: 'createAtOrder',
    title: 'Ngày tạo',
    filter: [
      { sub: 'Mới nhất', order: 'desc' },
      { sub: 'Cũ nhất', order: 'asc' },
    ],
  },
  {
    type: 'studentIdOrder',
    title: 'MSSV',
    filter: [
      { sub: 'A tới Z', order: 'desc' },
      { sub: 'Z tới A', order: 'asc' },
    ],
  },
  {
    type: 'fullNameOrder',
    title: 'Họ tên',
    filter: [
      { sub: 'A tới Z', order: 'desc' },
      { sub: 'Z tới A', order: 'asc' },
    ],
  },
  {
    type: 'beginningYearOrder',
    title: 'Năm nhập học',
    filter: [
      { sub: 'A tới Z', order: 'desc' },
      { sub: 'Z tới A', order: 'asc' },
    ],
  },
]

export default function Filter({ setMyParams, status }) {
  const [currentStatus, setCurrentStatus] = React.useState(status)
  const [currentParam, setCurrentParam] = React.useState('')
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { register, getValues, reset } = useForm({
    values: {
      keyword: searchParams.get('keyword')?.toString() || '',
      criteria: searchParams.get('criteria')?.toString() || 'email',
      createAtOrder: searchParams.get('createAt')?.toString() || 'desc',
      studentIdOrder: searchParams.get('studentId')?.toString() || null,
      fullNameOrder: searchParams.get('fullName')?.toString() || null,
      beginningYearOrder: searchParams.get('beginningYear')?.toString() || null,
      facultyId: searchParams.get('facultyId')?.toString() || '0',
    },
  })

  const handleSearch = useDebouncedCallback((keyword) => {
    const params = new URLSearchParams(searchParams)
    if (keyword) {
      params.set('keyword', keyword)
    } else {
      params.delete('keyword')
    }
    params.set('criteria', getValues('criteria'))
    params.set('createAtOrder', getValues('createAtOrder'))
    if (getValues('studentIdOrder')) {
      params.set('studentIdOrder', getValues('studentIdOrder'))
    }
    if (getValues('fullNameOrder')) {
      params.set('fullNameOrder', getValues('fullNameOrder'))
    }
    if (getValues('beginningYearOrder')) {
      params.set('beginningYearOrder', getValues('beginningYearOrder'))
    }

    replace(`${pathname}?${params.toString()}`)
    setCurrentParam(params.toString())
  }, 500)

  const handleResetForm = () => {
    reset()
    replace(pathname)
    setCurrentParam('')
    setCurrentStatus(status)
    setMyParams(`?status=${status}`)
  }

  const handleInputs = (e) => {
    const params = new URLSearchParams(searchParams)
    params.set(e.target.name, e.target.value)
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?status=${currentStatus}&${params.toString()}`)
  }

  const handleStatusChange = (e) => {
    setCurrentStatus(e.target.value)
    const params = new URLSearchParams(searchParams)
    setMyParams(`?status=${e.target.value}&${params.toString()}`)
  }

  return (
    <form>
      <div className="flex flex-wrap lg:flex-nowrap gap-5 max-w-[65rem]">
        <div className="h-10 flex w-full gap-4">
          <label htmlFor="criteria" className="font-semibold self-center pr-3">
            Theo
          </label>
          <select
            className="h-full hover:cursor-pointer rounded-lg border border-blue-gray-200 pl-3"
            {...register('criteria')}
            onChange={(e) => handleInputs(e)}>
            <option value="email">Email</option>
            <option value="fullName">Họ và tên</option>
            <option className="cursor-pointer" value="studentId">
              MSSV
            </option>
            <option className="cursor-pointer" value="beginningYear">
              Năm nhập học
            </option>
          </select>
          <Input
            placeholder=""
            crossOrigin={undefined}
            size="md"
            containerProps={{ className: 'col-span-6' }}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20 bg-white"
            {...register('keyword')}
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
          />

          <div className="h-10 flex ">
            <label
              htmlFor="facultyId"
              className="font-semibold self-center pr-3">
              Khoa
            </label>
            <select
              className="h-full hover:cursor-pointer rounded-lg border border-blue-gray-200 pl-3 max-w-fit"
              {...register('facultyId')}
              onChange={(e) => handleInputs(e)}>
              <option key={0} value={0}>
                Toàn bộ
              </option>
              {FACULTIES.map(({ id, name }) => {
                return (
                  <option key={id} value={id}>
                    {name}
                  </option>
                )
              })}
            </select>
          </div>
          <Button
            onClick={() =>
              setMyParams(`?status=${currentStatus}&${currentParam}`)
            }
            placeholder={undefined}
            size="md"
            className="h-fit bg-[--blue-02] flex-1 normal-case">
            <p className="text-nowrap text-white">Tìm kiếm</p>
          </Button>
        </div>
      </div>

      <div className="flex mt-3 gap-2 flex-wrap">
        <Button
          onClick={handleResetForm}
          variant="outlined"
          placeholder={undefined}
          size="md"
          className="h-fit bg-white">
          Đặt lại
        </Button>
        {filerBtn.map(({ type, title, filter }) => (
          <div key={title} className="flex-col group">
            <Button
              variant="outlined"
              placeholder={undefined}
              size="md"
              className="flex gap-2 -mb-1 bg-white">
              {title}
              <CaretDownFill className="group-hover:rotate-180 " />
            </Button>
            <div className="w-[fit] p-5 hidden group-hover:flex gap-2 flex-col bg-white rounded-xl font-medium translate-y-1 border-2 border-[var(--secondary)] absolute z-10">
              {filter.map(({ sub, order }, idx) => (
                <div key={idx} className="flex items-center">
                  <Radio
                    {...register(`${type}` as any)}
                    value={order}
                    onClick={(e) => handleInputs(e)}
                    color="blue"
                    crossOrigin={undefined}
                    key={idx}
                    label={sub}
                    containerProps={{
                      className: 'p-0 m-3 ml-0',
                    }}
                    id={type + idx}
                  />
                  {sub === 'Mới nhất' || sub === 'A tới Z' ? (
                    <SortAlphaDown />
                  ) : (
                    <SortAlphaUp />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </form>
  )
}
