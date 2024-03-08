import React from 'react'
import Heading from '../../ui/about-school/heading'
import History from '../../ui/about-school/history'

export default function page() {
  return (
    <main>
      <section className="sm:mb-[25vw] md:mb-[27vw] lg:mb-[28vw] xl:mb-[23vw] ">
        <Heading />
      </section>
      <section className="w-[80vw] m-auto pt-[1vw] md:pt-[6vw] lg:pt-[10vw] 2xl:pt-[1vw]">
        <History />
      </section>
    </main>
  )
}
