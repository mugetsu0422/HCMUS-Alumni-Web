'use client'
import React, { useEffect, useState, useRef } from 'react'
import NewsListItem from '../../ui/admin/news/news-list-item'
import Header from '../../ui/admin/news/Header'
import { Input, Button } from '@material-tailwind/react'
import { ArrowRight, ArrowLeft } from 'react-bootstrap-icons'
import { ADMIN_VERIFY_ALUMNI_PAGE_LIMIT, JWT_COOKIE } from '../../constant'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useDebouncedCallback } from 'use-debounce'

function Pagination({ pages, setActive, active, setNews, itemsPerPage }) {
  const next = () => {
    if (active === pages || pages === 0) return

    setNews((e) => e + itemsPerPage)
    setActive(active + 1)
  }

  const prev = () => {
    if (active === 1) return

    setNews((e) => e - itemsPerPage)
    setActive(active - 1)
  }

  return (
    <div className="flex items-center gap-4 justify-center mb-6">
      <Button
        placeholder={undefined}
        variant="text"
        className="flex items-center gap-2 font-bold normal-case text-base"
        onClick={prev}
        disabled={active === 1 || active === 0}>
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <p className="w-20 text-center font-bold">
        {active} / {pages}
      </p>
      <Button
        placeholder={undefined}
        variant="text"
        className="flex items-center gap-2  font-bold normal-case text-base"
        onClick={next}
        disabled={active === pages || pages === 0}>
        <ArrowRight strokeWidth={2} className="h-6 w-6" />
      </Button>
    </div>
  )
}

function Search({ setParams }) {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const handleSearch = useDebouncedCallback((keyword) => {
    if (keyword) {
      params.set('title', keyword)
    } else {
      params.delete('title')
    }
    replace(`${pathname}?${params.toString()}`)
    setParams(`?${params.toString()}`)
  }, 500)

  return (
    <div className="mb-10 w-[1184px] m-auto">
      <Input
        size="lg"
        crossOrigin={undefined}
        label="Tìm kiếm bài viết..."
        placeholder={undefined}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}

export default function Page() {
  let itemsPerPage = ADMIN_VERIFY_ALUMNI_PAGE_LIMIT
  const [pages, setPages] = useState(0)
  const [active, setActive] = useState(0)
  const [news, setNews] = useState(0)
  const [params, setParams] = useState('')

  const [items, setItems] = useState([])

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news?offset=${news}&limit=${itemsPerPage}${params}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then((res) => {
        setPages(res.data.totalPages)
        setItems(res.data.news)
      })
      .catch()
  }, [news, itemsPerPage, params])

  if (pages > 0) {
    setPages(1)
  }

  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw]">
      <Search setParams={setParams} />
      <Header setParams={setParams} />
      <div className="relative mb-10">
        {items.map(({ id, title, thumbnail, views, status, publishedAt }) => (
          <div key={title} className=" m-auto">
            <NewsListItem
              name={title}
              imgSrc={thumbnail}
              status={status}
              views={views}
              id={id}
              publishedAt={publishedAt}
            />
          </div>
        ))}
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        pages={pages}
        active={active}
        setActive={setActive}
        setNews={setNews}
      />
    </div>
  )
}
