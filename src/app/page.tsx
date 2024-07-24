'use client'

import Banner from './ui/landing-page/banner'
import Brands from './ui/landing-page/brands'
import NewsList from './ui/landing-page/news-list'
import MirrorOfSuccessList from './ui/landing-page/mos-list'
import Explore from './ui/landing-page/explore'
import Navbar from './ui/landing-page/navbar'
import Footer from './ui/landing-page/footer'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [news, setNews] = useState([])
  const [hof, setHof] = useState([])

  useEffect(() => {
    const newsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/news/hot?limit=3`
    )
    const hofPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/hof/rand?number=3`
    )

    Promise.all([newsPromise, hofPromise])
      .then(
        ([
          {
            data: { news },
          },
          {
            data: { hof },
          },
        ]) => {
          setNews(news)
          setHof(hof)
        }
      )
      .catch((error) => {})
  }, [])

  return (
    <>
      <Navbar />
      <main className="">
        <section>
          <Banner />
        </section>
        <section>
          <NewsList news={news} />
        </section>
        <section>
          <MirrorOfSuccessList hof={hof} />
        </section>
        <section>
          <Explore />
        </section>
      </main>
      <Footer />
    </>
  )
}
