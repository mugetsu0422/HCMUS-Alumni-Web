'use client'

import React, { useEffect, useState } from 'react'
import TrendingNews from '../../ui/social-page/trending-news'
import HallOfFame from '../../ui/social-page/hall-of-fame'
import NewEvents from '../../ui/social-page/new-events'
import { nunito } from '../../ui/fonts'
import axios from 'axios'
import { JWT_COOKIE, POST_STATUS } from '@/app/constant'
import Cookies from 'js-cookie'
import Footer from '@/app/ui/landing-page/footer'

export default function Page() {
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [hof, setHof] = useState([])

  useEffect(() => {
    // Events list
    const eventsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events?statusId=${POST_STATUS['Bình thường']}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    const newsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/hot?statusId=${POST_STATUS['Bình thường']}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    const hofPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/hof/rand`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([eventsPromise, newsPromise, hofPromise])
      .then(([eventsRes, newsRes, hofRes]) => {
        setEvents(eventsRes.data.events)
        setNews(newsRes.data.news)
        setHof(hofRes.data.hof)
      })
      .catch((error) => {})
  }, [])
  return (
    <>
      <div
        className={`${nunito.className} mt-8 flex flex-col place-items-center justify-center max-w-[1200px] w-full relative gap-y-10 m-auto`}>
        <NewEvents events={events} />
        <TrendingNews news={news} />
        <HallOfFame hof={hof} />
      </div>
      <Footer />
    </>
  )
}
