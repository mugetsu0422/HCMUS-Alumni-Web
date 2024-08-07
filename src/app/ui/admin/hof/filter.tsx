'use client'
import React, { useEffect } from 'react'
import { Input } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FACULTIES } from '../../../constant'
import isAdminLogin from '../../common/Is-admin-login'

interface SearchAndFilterFacultyProps {
  onFilterFaculties: (facultyId: string) => void
  onFilterBeginningYear: (beginningYear: string) => void
  params: { facultyId: string | null; beginningYear: string | null }
}

export default function FilterAdmin({
  onFilterFaculties,
  onFilterBeginningYear,
  params,
}: SearchAndFilterFacultyProps) {
  const { register, reset } = useForm({
    values: {
      facultyId: params.facultyId || 0,
      beginningYear: params.beginningYear || null,
    },
  })
  const [isAdmin, setIsAdmin] = React.useState(false)

  useEffect(() => {
    setIsAdmin(isAdminLogin())
  }, [])

  return (
    <div className={`w-fit flex items-end gap-5 flex-wrap`}>
      {isAdmin && (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-md">Khoa</p>
          <select
            className="h-[50px] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
            {...register('facultyId', {
              onChange: (e) => onFilterFaculties(e.target.value),
            })}>
            <option value={0}>Tất cả</option>
            {FACULTIES.map(({ id, name }) => {
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Khóa</p>
        <Input
          size="lg"
          crossOrigin={undefined}
          variant="outlined"
          type="text"
          maxLength={4}
          {...register('beginningYear', {
            onChange: (e) => {
              const newVal = e.target.value.replace(/[^0-9]/g, '')
              onFilterBeginningYear(newVal)
            },
          })}
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
          containerProps={{
            className: 'h-[50px] !min-w-[100px] !w-[100px]',
          }}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
        />
      </div>
    </div>
  )
}
