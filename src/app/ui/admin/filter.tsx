'use client'

import React from 'react'
import { Input, Button, Radio, Select, Option } from '@material-tailwind/react'
import { CaretDownFill } from 'react-bootstrap-icons'
import { useFieldArray, useForm } from 'react-hook-form'
import { classNames } from 'react-easy-crop/helpers'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

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

const IconAtoZ = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-sort-alpha-down"
      viewBox="0 0 16 16">
      <path
        fillRule="evenodd"
        d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"
      />
      <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
    </svg>
  )
}

const IconZtoA = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-sort-alpha-up-alt"
      viewBox="0 0 16 16">
      <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z" />
      <path
        fillRule="evenodd"
        d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z"
      />
      <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z" />
    </svg>
  )
}

export default function Filter({setMyParams, status}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const {
    register,
    getValues,
    reset,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm({
    values: {
      keyword: searchParams.get('keyword')?.toString() || '',
      criteria: searchParams.get('criteria')?.toString() || 'email',
      createAtOrder: searchParams.get('createAt')?.toString() || 'desc',
      studentIdOrder: searchParams.get('studentId')?.toString() || null,
      fullNameOrder: searchParams.get('fullName')?.toString() || null,
      beginningYearOrder: searchParams.get('beginningYear')?.toString() || null,
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
    setMyParams(`?status=${status}&${params.toString()}`)
  }, 500)

  const handleResetForm = () => {
    reset()
    replace(pathname)
    setMyParams(`?status=${status}`)
  }

  const handleInputs = (e) => {
    const params = new URLSearchParams(searchParams)
    params.set(e.target.name, e.target.value)
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?status=${status}&${params.toString()}`)
  }

  return (
    <form>
      <div className="grid sm:grid-cols-4 gap-5 max-w-[50rem]">
        <Input
          placeholder=""
          crossOrigin={undefined}
          size="md"
          containerProps={{ className: 'col-span-3' }}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
          {...register('keyword')}
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
        />
        <select
          className="h-10 col-span-1 hover:cursor-pointer rounded-lg border border-blue-gray-200 pl-3"
          {...register('criteria')}
          onChange={(e) => handleInputs(e)}
          >
          <option value="email">Email</option>
          <option value="fullName">Họ và tên</option>
          <option className="cursor-pointer" value="studentId">
            MSSV
          </option>
          <option className="cursor-pointer" value="beginningYear">
            Năm nhập học
          </option>
        </select>
      </div>
      <div className="flex mt-3 gap-2 flex-wrap">
        <Button
          onClick={handleResetForm}
          variant="outlined"
          placeholder={undefined}
          size="sm"
          className="h-fit">
          Đặt lại
        </Button>
        {filerBtn.map(({ type, title, filter }) => (
          <div key={title} className="flex-col group">
            <Button
              variant="outlined"
              placeholder={undefined}
              size="sm"
              className="flex gap-2 -mb-1">
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
                    <IconAtoZ />
                  ) : (
                    <IconZtoA />
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
