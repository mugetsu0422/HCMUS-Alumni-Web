/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { Carousel, Button } from '@material-tailwind/react'
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons'
import Link from 'next/link'

export default function NewEvents({ events }) {
  return (
    <Carousel
      placeholder={undefined}
      className="relative  rounded-xl w-full h-[500px] z-10"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill('').map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
      prevArrow={({ handlePrev }) => (
        <Button
          placeholder={undefined}
          variant="text"
          color="blue"
          size="lg"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4 px-4">
          <ArrowLeft className="text-2xl text-black" />
        </Button>
      )}
      nextArrow={({ handleNext }) => (
        <Button
          placeholder={undefined}
          variant="text"
          color="blue"
          size="lg"
          onClick={handleNext}
          className="!absolute top-2/4 !right-4 -translate-y-2/4 px-4">
          <ArrowRight className="text-2xl text-black" />
        </Button>
      )}
      transition={{ duration: 1 }}
      autoplay={true}
      autoplayDelay={10000}
      loop={true}>
      {events.slice(0, 10).map(({ id, thumbnail, faculty, title }) => (
        <Link key={id} href={`/events/${id}`}>
          <figure className="relative w-full h-full z-10">
            <img
              src={thumbnail}
              alt="thumbnail"
              className="w-full h-full object-cover object-center rounded-xl"
            />
            {faculty && (
              <figcaption className="absolute p-2 top-4 left-6 font-medium text-white justify-between rounded-lg bg-[--blue-05] saturate-200">
                {faculty?.name}
              </figcaption>
            )}
          </figure>
        </Link>
      ))}
    </Carousel>
  )
}
