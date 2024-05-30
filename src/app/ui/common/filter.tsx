'use client'
import React from 'react'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { Button } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FACULTIES, TAGS } from '../../constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SearchAndFilterFacultyProps {
  onFilterTag: (tagsId: string) => void
  onFilterFaculties: (facultyId: string) => void
  params: { tagsId: string | null; facultyId: string | null }
}

export default function Filter({
  onFilterFaculties,
  onFilterTag,
  params,
}: SearchAndFilterFacultyProps) {
  const { register, reset } = useForm({
    values: {
      tagsId: params.tagsId || 0,
      facultyId: params.facultyId || 0,
    },
  })

  return (
    <div className={`w-fit flex items-end gap-5 flex-wrap`}>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Khoa</p>
        <select
          className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
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

      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Thẻ</p>
        <select
          className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
          {...register('tagsId', {
            onChange: (e) => onFilterTag(e.target.value),
          })}>
          <option value={0}>Tất cả</option>
          {TAGS.map(({ value, label }) => {
            return (
              <option key={value} value={value}>
                {label}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}
