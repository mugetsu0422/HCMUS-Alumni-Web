/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useForm } from 'react-hook-form'
import { roboto } from '../../ui/fonts'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FACULTIES, TAGS } from '../../constant'
import Pagination from '../../ui/common/pagination'
import Thumbnail from '../../ui/social-page/thumbnail-image'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { JWT_COOKIE, POST_STATUS } from '../../constant'
import Cookies from 'js-cookie'
import { Button, Input } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons'

const PAGE_SIZE = 9

interface SearchAndFilterProps {
  onSearch: (keyword: string) => void
  onFilter: (facultyId: string) => void
  onFilterBeginningYear: (beginningYear: string) => void
  onResetFilter: () => void
  params: {
    title: string | null
    facultyId: string | null
    beginningYear: string | null
  }
}

function SearchAndFilter({
  onSearch,
  onFilter,
  onFilterBeginningYear,
  onResetFilter,
  params,
}: SearchAndFilterProps) {
  const { register, reset, setValue } = useForm({
    defaultValues: {
      title: params.title,
      facultyId: params.facultyId || 0,
      beginningYear: params.beginningYear || null,
    },
  })

  return (
    <div className="flex items-end gap-2 w-fit ml-5 lg:ml-0">
      <Input
        size="lg"
        crossOrigin={undefined}
        label="Tìm kiếm ..."
        placeholder={undefined}
        containerProps={{ className: 'w-full sm:!w-[500px]' }}
        {...register('title', {
          onChange: (e) => onSearch(e.target.value),
        })}
      />

      <div className="flex items-end gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-md">Khoa</p>
          <select
            className="h-[2.8rem] hover:cursor-pointer pl-3 w-fit text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 rounded-md border-blue-gray-200 focus:border-gray-900"
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
              className: '!min-w-[100px] !w-[100px]',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
        </div>

        <Button
          onClick={() => {
            onResetFilter()
            reset({ facultyId: 0, beginningYear: null })
          }}
          placeholder={undefined}
          className="bg-[--blue-02] w-fit normal-case text-sm flex items-center gap-1">
          Xóa bộ lọc
          <FontAwesomeIcon icon={faFilterCircleXmark} className="text-lg" />
        </Button>
      </div>
    </div>
  )
}

function HofListItem({ hof }) {
  return (
    <div className="w-full h-full flex flex-col gap-2 m-auto">
      <Link
        href={`/hof/${hof.id}`}
        className="w-full h-64 hover:cursor-pointer">
        <img
          src={hof.thumbnail}
          alt="thumbnail"
          className="w-full h-full object-cover object-center rounded-xl"
        />
      </Link>
      <p className="w-full text-center text-xl text-black font-bold">
        {hof.title}
      </p>
      <p className="font-semibold text-center">
        {hof.beginningYear && <span>Khóa {hof.beginningYear} </span>}
        {hof.faculty && <span>- Khoa {hof.faculty.name}</span>}
      </p>
      <p>{hof.summary}</p>
    </div>
  )
}

export default function Page() {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { replace } = useRouter()
  const pathname = usePathname()
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [myParams, setMyParams] = useState(
    `?pageSize=${PAGE_SIZE}&${params.toString()}`
  )
  const [hof, setHof] = useState([])

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }
  const onChangeMyParams = () => {
    setMyParams(`?pageSize=${PAGE_SIZE}&${params.toString()}`)
  }
  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    onChangeMyParams()
  }, 500)
  const onFilter = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    onChangeMyParams()
  }
  const onFilterBeginningYear = useDebouncedCallback((beginningYear) => {
    if (beginningYear) {
      params.set('beginningYear', beginningYear)
    } else {
      params.delete('beginningYear')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    onChangeMyParams()
  }, 500)
  const onResetFilter = () => {
    params.delete('facultyId')
    params.delete('beginningYear')
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    onChangeMyParams()
  }
  const onNextPage = () => {
    if (curPage == totalPages) return
    params.set('page', curPage.toString())
    replace(`${pathname}?${params.toString()}`)
    onChangeMyParams()
    setCurPage((curPage) => {
      return curPage + 1
    })
  }
  const onPrevPage = () => {
    if (curPage == 1) return
    params.set('page', (curPage - 2).toString())
    replace(`${pathname}?${params.toString()}`)
    onChangeMyParams()
    setCurPage((curPage) => {
      return curPage - 1
    })
  }

  useEffect(() => {
    // Hof list
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/hof${myParams}&statusId=${POST_STATUS['Bình thường']}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, hof } }) => {
        setTotalPages(totalPages)
        setHof(hof)
      })
      .catch()
  }, [myParams])

  return (
    <>
      <Thumbnail />

      <div className="flex flex-col w-[80%] gap-6 max-w-[80rem] m-auto mt-10">
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: '#00a700',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#ea7b7b',
                color: 'white',
              },
            },
          }}
        />
        <p
          className={`${roboto.className} ml-5 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
          GƯƠNG THÀNH CÔNG
        </p>
        <SearchAndFilter
          onSearch={onSearch}
          onFilter={onFilter}
          onFilterBeginningYear={onFilterBeginningYear}
          onResetFilter={onResetFilter}
          params={{
            title: params.get('title'),
            facultyId: params.get('facultyId'),
            beginningYear: params.get('beginningYear'),
          }}
        />
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-x-10 gap-y-6">
          {hof.map((hof) => (
            <HofListItem key={hof.id} hof={hof} />
          ))}
        </div>
        <Pagination
          totalPages={totalPages}
          curPage={curPage}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
        />
      </div>
    </>
  )
}