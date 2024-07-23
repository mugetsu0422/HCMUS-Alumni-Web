/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { JWT_COOKIE, POST_STATUS } from '../../constant'
import Cookies from 'js-cookie'
import axios from 'axios'
import Pagination from '../../ui/common/pagination'
import { roboto } from '../../ui/fonts'
import SearchAndFilterFaculty from '../../ui/social-page/common/filter-and-search'
import NewsListItem from '../../ui/social-page/news/news-litst-item'

export default function Page() {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)

  const [myParams, setMyParams] = useState(`?${params.toString()}`)
  const [curPage, setCurPage] = useState(Number(params.get('page')) + 1 || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [news, setNews] = useState([])
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagNames = params.get('tagNames')
    if (!tagNames) return []
    return tagNames.split(',').map((tag) => ({ value: tag, label: tag }))
  })

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

  const onAddTags = useCallback(
    (newTag) => {
      const newTags = [...selectedTags, newTag]
      setSelectedTags(newTags)
      params.set('tagNames', newTags.map(({ value }) => value).join(','))
      resetCurPage()
      replace(`${pathname}?${params.toString()}`, { scroll: false })
      setMyParams(`?${params.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTags]
  )
  const onDeleteTags = useCallback(
    (tagIndex) => {
      const newTags = selectedTags.filter((_, i) => i !== tagIndex)
      setSelectedTags(newTags)
      if (newTags.length == 0) {
        params.delete('tagNames')
      } else {
        params.set('tagNames', newTags.map(({ value }) => value).join(','))
      }
      resetCurPage()
      replace(`${pathname}?${params.toString()}`, { scroll: false })
      setMyParams(`?${params.toString()}`)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTags]
  )

  const onFilterFaculties = (facultyId: string) => {
    if (facultyId != '0') {
      params.set('facultyId', facultyId)
    } else {
      params.delete('facultyId')
    }
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onResetFilter = () => {
    params.delete('facultyId')
    params.delete('tagNames')
    setSelectedTags([])
    resetCurPage()
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
  }

  const onNextPage = () => {
    if (curPage == totalPages) return
    params.set('page', curPage.toString())
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage + 1
    })
  }
  const onPrevPage = () => {
    if (curPage == 1) return
    params.set('page', (curPage - 2).toString())
    replace(`${pathname}?${params.toString()}`, { scroll: false })
    setMyParams(`?${params.toString()}`)
    setCurPage((curPage) => {
      return curPage - 1
    })
  }

  useEffect(() => {
    // News list
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/news${myParams}&statusId=${POST_STATUS['Bình thường']}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, news } }) => {
        setTotalPages(totalPages)
        setNews(news)
      })
      .catch((error) => {})
  }, [myParams])

  return (
    <>
      <div className="max-w-[1200px] flex flex-row justify-center gap-x-8 m-auto mb-8 px-10">
        <div className="w-full flex flex-col gap-y-6 mt-10">
          <p
            className={`${roboto.className} ml-8 lg:ml-0 text-3xl font-bold text-[var(--blue-02)]`}>
            TIN TỨC
          </p>

          <SearchAndFilterFaculty
            name="tin tức"
            onSearch={onSearch}
            onFilter={onFilterFaculties}
            onResetFilter={onResetFilter}
            selectedTags={selectedTags}
            onAddTags={onAddTags}
            onDeleteTags={onDeleteTags}
            params={{
              title: params.get('title'),
              facultyId: params.get('facultyId'),
            }}
          />

          {news.map(
            ({ id, title, summary, publishedAt, faculty, tags, thumbnail }) => (
              <NewsListItem
                id={id}
                key={id}
                title={title}
                summary={summary}
                publishedAt={publishedAt}
                faculty={faculty}
                tags={tags}
                thumbnail={thumbnail}
              />
            )
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          curPage={curPage}
          onNextPage={onNextPage}
          onPrevPage={onPrevPage}
        />
      )}
    </>
  )
}
