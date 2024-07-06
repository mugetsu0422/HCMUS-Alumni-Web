'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FACULTIES } from '../../../constant'

interface SearchAndFilterFacultyProps {
  onFilterRole: (roleIds: string) => void
  roles: any[]
  params: { roleIds: string | null }
}

export default function FilterAdminUser({
  onFilterRole,
  roles,
  params,
}: SearchAndFilterFacultyProps) {
  const { register, reset } = useForm({
    values: {
      roleIds: params.roleIds || 0,
    },
  })

  return (
    <div className={`w-full flex items-end gap-5 flex-wrap`}>
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Vai trò</p>
        <select
          className="h-[50px] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
          {...register('roleIds', {
            onChange: (e) => onFilterRole(e.target.value),
          })}>
          <option value={0}>Tất cả</option>
          {roles.map(({ id, name }) => {
            return (
              <option key={id} value={id}>
                {name}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}
