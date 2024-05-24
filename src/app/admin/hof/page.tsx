/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { Input, Button } from '@material-tailwind/react'
import { roboto } from '../../ui/fonts'
import { useForm } from 'react-hook-form'
import { JWT_COOKIE } from '../../constant'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowCounterclockwise, Search } from 'react-bootstrap-icons'
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'
import Cookies from 'js-cookie'
import Pagination from '../../ui/common/pagination'
import SortHeader from '../../ui/admin/hof/sort-header'
import HofListItem from '../../ui/admin/hof/hof-list-item'
import FilterAdmin from '../../ui/admin/hof/filter'
import Link from 'next/link'

function FuntionSection({
  onSearch,
  onResetSearchAndFilter,
  onFilterFaculties,
  onFilterBeginningYear,
}) {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const { register, reset } = useForm({
    defaultValues: {
      title: params.get('title'),
    },
  })

  return (
    <div className="my-5 w-full max-w-[1400px] m-auto justify-between flex items-end gap-5 flex-wrap">
      <div className="w-[500px] flex gap-5 justify-start flex-wrap">
        <div className="h-full w-full mr-auto flex flex-col gap-2">
          <p className="font-semibold text-md">Tìm kiếm bài viết</p>
          <Input
            size="lg"
            crossOrigin={undefined}
            placeholder={undefined}
            icon={<Search />}
            defaultValue={params.get('title')}
            {...register('title', {
              onChange: (e) => onSearch(e.target.value),
            })}
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
          />
        </div>

        <FilterAdmin
          onFilterFaculties={onFilterFaculties}
          onFilterBeginningYear={onFilterBeginningYear}
          params={{
            facultyId: params.get('facultyId'),
            beginningYear: params.get('beginningYear'),
          }}
        />
      </div>

      <div className="flex gap-5">
        <Link href={'/admin/hof/create'}>
          <Button
            placeholder={undefined}
            className="h-full font-bold normal-case text-base min-w-fit bg-[var(--blue-02)] text-white ">
            Tạo mới
          </Button>
        </Link>
        <Button
          onClick={() => {
            onResetSearchAndFilter()
            reset()
          }}
          placeholder={undefined}
          className="rounded-full p-3 h-full font-bold normal-case text-base min-w-fit bg-[#E4E4E7] text-white ">
          <ArrowCounterclockwise className="text-2xl font-bold text-[#3F3F46]" />
        </Button>{' '}
      </div>
    </div>
  )
}

export default function Page() {
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [hof, setHof] = useState([])

  const resetCurPage = () => {
    params.delete('page')
    setCurPage(1)
  }
  const onSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }, 500)

  const onResetAll = () => {
    resetCurPage()
    replace(pathname)
    setMyParams(``)
  }

  const onNextPage = () => {
    if (curPage == totalPages) return
    params.set('page', curPage.toString())
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage + 1
    })
  }
  const onPrevPage = () => {
    if (curPage == 1) return
    params.set('page', (curPage - 2).toString())
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage - 1
    })
  }
  const onOrder = (name: string, order: string) => {
    params.delete('page')
    setCurPage(1)
    params.set('orderBy', name)
    params.set('order', order)
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }
  const onFilterFaculties = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`)
    setMyParams(`?${params.toString()}`)
  }
  const onFilterBeginningYear = useDebouncedCallback((beginningYear) => {
    if (beginningYear) {
      params.set('beginningYear', beginningYear)
    } else {
      params.delete('beginningYear')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/hof${myParams}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: { totalPages, hof } }) => {
        setTotalPages(totalPages)
        setHof(hof)
      })
      .catch()
  }, [myParams])

  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw] overflow-x-auto">
      <p
        className={`${roboto.className} mx-auto w-full max-w-[1400px] text-3xl font-bold text-[var(--blue-01)]`}>
        Quản lý gương thành công
      </p>

      <FuntionSection
        onSearch={onSearch}
        onResetSearchAndFilter={onResetAll}
        onFilterFaculties={onFilterFaculties}
        onFilterBeginningYear={onFilterBeginningYear}
      />

      <div className="overflow-x-auto">
        <SortHeader onOrder={onOrder} />
        <div className="relative mb-10">
          {hof.map((hof) => (
            <HofListItem key={hof.id} hof={hof} />
          ))}
        </div>
      </div>

      <Pagination
        totalPages={totalPages}
        curPage={curPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </div>
  )
}
