/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useForm } from 'react-hook-form'
import { roboto } from '../../ui/fonts'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FACULTIES } from '../../constant'
import Pagination from '../../ui/common/pagination'
import Thumbnail from '../../ui/social-page/thumbnail-image'
import SearchAndFilterFaculty from '../../ui/social-page/common/filter-and-search'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { JWT_COOKIE, POST_STATUS } from '../../constant'
import Cookies from 'js-cookie'

function HofListItem({ id, thumbnail, faculty_id, title, beginningYear }) {
  return (
    <div className="max-w-[400px] flex flex-col gap-1">
      <Link
        href={`/hof/${id}`}
        className="w-full h-64 object-cover object-center rounded-xl hover:cursor-pointer">
        <img
          src={thumbnail}
          alt="Hall of fame image"
          className="w-full h-full"
        />
      </Link>
      <p className="w-full text-center text-xl text-black font-bold">{title}</p>
      <p>
        Khóa {beginningYear} - Khoa {faculty_id}
      </p>
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
  const [myParams, setMyParams] = useState(`?${params.toString()}`)
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
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }, 500)

  const onFilter = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onFilterTag = (tag: string) => {
    if (tag != '0') {
      params.set('tagsId', tag)
    } else {
      params.delete('tagsId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onResetFilter = () => {
    params.delete('facultyId')
    params.delete('tagsId')
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
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
        <SearchAndFilterFaculty
          onSearch={onSearch}
          onFilter={onFilter}
          onResetFilter={onResetFilter}
          onFilterTag={onFilterTag}
          params={{
            title: params.get('title'),
            facultyId: params.get('facultyId'),
            tagsId: params.get('tagsId'),
          }}
        />
        <div className="mt-4 max-w-[80rem] flex flex-wrap justify-center gap-x-10 gap-y-6">
          {hof.map(({ id, thumbnail, faculty_id, title, beginningYear }) => (
            <HofListItem
              key={id}
              id={id}
              thumbnail={thumbnail}
              faculty_id={faculty_id}
              title={title}
              beginningYear={beginningYear}
            />
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
