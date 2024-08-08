'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FACULTIES } from '../../constant'
import styles from '@/app/ui/common/react-tag-autocomplete.module.css'
import { ReactTags, Tag, TagSelected } from 'react-tag-autocomplete'
import isAdminLogin from './Is-admin-login'
interface SearchAndFilterFacultyProps {
  onFilterFaculties: (facultyId: string) => void
  selectedTags: TagSelected[]
  onAddTags: (tag: Tag) => void
  onDeleteTags: (index: number) => void
  params: { facultyId: string | null }
}

export default function Filter({
  onFilterFaculties,
  selectedTags,
  onAddTags,
  onDeleteTags,
  params,
}: SearchAndFilterFacultyProps) {
  const { register, reset } = useForm({
    values: {
      facultyId: params.facultyId || 0,
    },
  })
  const [isAdmin, setIsAdmin] = React.useState(false)

  useEffect(() => {
    setIsAdmin(isAdminLogin())
  }, [])

  return (
    <div className={`w-full flex items-end gap-5 flex-wrap`}>
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

      <div className="w-full md:w-[500px] flex flex-col gap-2 flex-shrink">
        <p className="font-semibold text-md">Thẻ</p>
        <ReactTags
          suggestions={[]}
          selected={selectedTags}
          onAdd={onAddTags}
          onDelete={onDeleteTags}
          allowNew={true}
          activateFirstOption={true}
          placeholderText="Nhập thẻ"
          newOptionText="Thêm thẻ %value%"
          noOptionsText="Không tim thấy the %value%"
          classNames={{
            root: `${styles['react-tags']}`,
            rootIsActive: `${styles['is-active']}`,
            rootIsDisabled: `${styles['is-disabled']}`,
            rootIsInvalid: `${styles['is-invalid']}`,
            label: `${styles['react-tags__label']}`,
            tagList: `${styles['react-tags__list']}`,
            tagListItem: `${styles['react-tags__list-item']}`,
            tag: `${styles['react-tags__tag']}`,
            tagName: `${styles['react-tags__tag-name']}`,
            comboBox: `${styles['react-tags__combobox']}`,
            input: `${styles['react-tags__combobox-input']}`,
            listBox: `${styles['react-tags__listbox']}`,
            option: `${styles['react-tags__listbox-option']}`,
            optionIsActive: `${styles['is-active']}`,
            highlight: `${styles['react-tags__listbox-option-highlight']}`,
          }}
        />
      </div>
    </div>
  )
}
