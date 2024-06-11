'use client'
import React from 'react'
import { FACULTIES, TAGS } from '../../../constant'
import { Button, Input } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import styles from '@/app/ui/common/react-tag-autocomplete.module.css'
import { ReactTags, Tag, TagSelected } from 'react-tag-autocomplete'

interface SearchAndFilterFacultyProps {
  name: string
  selectedTags: TagSelected[]
  onAddTags: (tag: Tag) => void
  onDeleteTags: (index: number) => void
  onSearch: (keyword: string) => void
  onFilter: (facultyId: string) => void
  onResetFilter: () => void
  params: {
    title: string | null
    facultyId: string | null
  }
}

export default function SearchAndFilterFaculty({
  name,
  onSearch,
  onFilter,
  onResetFilter,
  selectedTags,
  onAddTags,
  onDeleteTags,
  params,
}: SearchAndFilterFacultyProps) {
  const { register, reset } = useForm({
    defaultValues: {
      title: params.title,
      facultyId: params.facultyId || 0,
    },
  })

  return (
    <div className="w-full flex flex-wrap items-end gap-4">
      <div className="w-full flex gap-5 justify-start flex-wrap">
        <div className="h-full w-full mr-auto flex flex-col gap-2">
          <p className="font-semibold text-md">Tìm kiếm {name}</p>
          <Input
            size="lg"
            crossOrigin={undefined}
            placeholder={undefined}
            {...register('title', {
              onChange: (e) => onSearch(e.target.value),
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            containerProps={{
              className: 'h-[50px]',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
        </div>

        <div className="w-full flex items-end gap-4 flex-wrap">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-md">Khoa</p>
            <select
              className="h-[50px] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
              {...register('facultyId', {
                onChange: (e) => onFilter(e.target.value),
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

          <div className="w-full flex flex-col gap-2 md:flex-1">
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
          <Button
            onClick={() => {
              onResetFilter()
              reset({ facultyId: 0 })
            }}
            placeholder={undefined}
            className="bg-[--blue-02] w-fit h-[50px] normal-case text-sm flex items-center gap-1">
            Xóa bộ lọc
            <FontAwesomeIcon icon={faFilterCircleXmark} className="text-lg" />
          </Button>
        </div>
      </div>
    </div>
  )
}
