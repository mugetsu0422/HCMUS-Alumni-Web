import Image from 'next/image'
import { useEffect, useState } from 'react'
import { inter, koho, nunito } from './ui/fonts'
import Banner from './ui/landing-page/banner'
import Brands from './ui/landing-page/brands'
import NewsList from './ui/landing-page/news-list'

export default function Home() {
  return (
    <main className="">
      <section>
        <Banner />
      </section>
      <section>
        <Brands />
      </section>
      <section>
        <NewsList />
      </section>
    </main>
  )
}
