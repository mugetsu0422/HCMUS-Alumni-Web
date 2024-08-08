import React from 'react'
import { inter } from '@/app/ui/fonts'

export default function NoResult({ message }) {
  return (
    <section className={`${inter.className} bg-white dark:bg-gray-900`}>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto text-center">
          <p className="mb-4 text-3xl tracking-tight font-bold text-[var(--blue-05)] md:text-4xl">
            {message}
          </p>
        </div>
      </div>
    </section>
  )
}
