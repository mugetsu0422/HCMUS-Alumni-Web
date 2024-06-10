'use client'
import React from 'react'
import { Button, Input } from '@material-tailwind/react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'
import styles from '@/app/ui/common/react-tag-autocomplete.module.css'
import { ReactTags, Tag, TagSelected } from 'react-tag-autocomplete'

interface SearchAndFilterProps {
  selectedTags: TagSelected[]
  onAddTags: (tag: Tag) => void
  onDeleteTags: (index: number) => void
  onSearch: (keyword: string) => void
  onResetFilter: () => void
  params: {
    title: string | null
  }
}

export default function SearchAndFilter({
  selectedTags,
  onAddTags,
  onDeleteTags,
  onSearch,
  onResetFilter,
  params,
}: SearchAndFilterProps) {
  const { register, reset } = useForm({
    defaultValues: {
      title: params.title,
    },
  })

  return (
    <div className="w-full flex flex-col gap-4 flex-wrap">
      <div className="flex flex-col gap-2">
        <p className="font-semibold text-md">Tìm kiếm</p>
        <Input
          size="lg"
          crossOrigin={undefined}
          placeholder={undefined}
          containerProps={{ className: 'h-[50px] w-full' }}
          {...register('title', {
            onChange: (e) => onSearch(e.target.value),
          })}
          className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          labelProps={{
            className: 'before:content-none after:content-none',
          }}
        />
      </div>

      <div className="flex items-end gap-4 flex-wrap">
        <div className="w-full flex flex-col gap-2 sm:flex-1">
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
          }}
          placeholder={undefined}
          className="flex bg-[--blue-02] w-fit h-[50px] normal-case text-sm items-center gap-1">
          Xóa bộ lọc
          <FontAwesomeIcon icon={faFilterCircleXmark} className="text-lg" />
        </Button>
      </div>
    </div>
  )
}
