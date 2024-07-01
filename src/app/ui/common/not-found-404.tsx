import React from 'react'
import { inter } from '@/app/ui/fonts'

export default function NotFound404() {
  return (
    <section className={`${inter.className} bg-white dark:bg-gray-900`}>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-[var(--blue-05)]">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-[var(--blue-05)] md:text-4xl">
            Không tìm thấy tài nguyên
          </p>
          {/* <p className="mb-4 text-lg font-light text-gray-700">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.
          </p> */}
          {/* <a
            href="home-page"
            className="inline-flex text-black bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4">
            Quay về trang chủ
          </a> */}
        </div>
      </div>
    </section>
  )
}
