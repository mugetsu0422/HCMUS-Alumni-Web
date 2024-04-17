'use client'

import React from 'react'
import { Button, Input } from '@material-tailwind/react'
import { useDebouncedCallback } from 'use-debounce'
import { useForm } from 'react-hook-form'
import { FACULTIES } from '../../../constant'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Filter({ setMyParams }) {
  const handleSearch = useDebouncedCallback((keyword) => {})

  const {
    register,
    getValues,
    reset,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useForm()

  const handleInputs = (e) => {
    // const params = new URLSearchParams(searchParams)
    // params.set(e.target.name, e.target.value)
    // replace(`${pathname}?${params.toString()}`)
    // setMyParams(`?status=${status}&${params.toString()}`)
  }
  const handleResetForm = () => {
    // reset()
    // replace(pathname)
    // setMyParams(`?status=${status}`)
  }

  return (
    <form>
      <div className="flex flex-wrap lg:flex-nowrap gap-5 max-w-[80rem]">
        <Input
          placeholder=""
          crossOrigin={undefined}
          size="md"
          containerProps={{ className: 'col-span-6' }}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20"
          {...register('keyword')}
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
        />
      </div>

      <div className="flex mt-3 gap-2 flex-wrap">
        <Button
          onClick={handleResetForm}
          variant="outlined"
          placeholder={undefined}
          size="sm"
          className="border-blue-gray-200 self-stretch bg-[--blue-05] text-white">
          <FontAwesomeIcon
            icon={faFilterCircleXmark}
            className="text-md mr-1"
          />
          Xóa bộ lọc
        </Button>

        <div className="h-10 flex">
          <select
            className="h-full hover:cursor-pointer rounded-lg border border-blue-gray-200 pl-3 max-w-fit "
            {...register('facultyId')}
            onChange={(e) => handleInputs(e)}>
            <option key={0} value={0}>
              Khoa
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

        <div>
          <Input
            {...register('beginning_year', {
              pattern: {
                value: /[0-9]/,
                message: 'Hãy nhập khóa của bạn',
              },
              maxLength: Number(4),
              minLength: Number(4),
            })}
            label="Khóa"
            crossOrigin={undefined}
          />
        </div>
      </div>
    </form>
  )
}
