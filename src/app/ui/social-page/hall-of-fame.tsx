'use client'
import React, { useState } from 'react'
import { Card, CardBody, CardFooter, Button } from '@material-tailwind/react'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function HallOfFame({ hof }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleNext = () => {
    if (currentIndex + 4 < hof.length) {
      setCurrentIndex(currentIndex + 4)
    }
  }

  const handlePrevious = () => {
    if (currentIndex - 4 >= 0) {
      setCurrentIndex(currentIndex - 4)
    }
  }

  const currentHof = hof.slice(currentIndex, currentIndex + 4)

  return (
    <div className=" flex flex-col sm:justify-center sm:items-center xl:items-start m-auto sm:w-[500px] xl:w-full h-fit mb-10 gap-y-6 ">
      <p className="text-3xl font-extrabold">Gương thành công</p>
      <div className="w-full">
        <div className="flex justify-between w-full mt-4 h-fit">
          <Button
            variant="text"
            placeholder={undefined}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-2 text-white rounded">
            <ChevronLeft className="text-2xl text-black disabled:text-gray-300 float-left w-fit" />
          </Button>
          <div className="flex flex-col xl:flex-row sm:items-center xl:items-stretch xl:justify-start w-full gap-4 h-full flex-1">
            {currentHof.map(
              ({ title, thumbnail, id, beginningYear, faculty }) => (
                <Card
                  placeholder={undefined}
                  className="flex flex-col max-w-[265px] bg-[#f5f5f5] flex-1 w-full"
                  key={id}>
                  <Link href={`/hof/${id}`}>
                    <img
                      src={thumbnail}
                      alt="avatar"
                      className="object-cover object-center rounded-md w-[270px] h-[200px]"
                    />

                    <CardBody placeholder={undefined}>
                      <p className="group-hover:text-[var(--blue-05)] font-bold text-lg text-[var(--text)] line-clamp-2 h-[60px]">
                        {title}
                      </p>
                      <div className="pt-0 text-[var(--text)] ">
                        {beginningYear ? <p>Khóa {beginningYear}</p> : null}
                        {faculty ? <p>Khoa {faculty.name}</p> : null}
                      </div>
                    </CardBody>
                  </Link>
                </Card>
              )
            )}
          </div>

          <Button
            variant="text"
            placeholder={undefined}
            onClick={handleNext}
            disabled={currentIndex + 4 >= hof.length}
            className="px-2 text-white rounded">
            <ChevronRight className="text-2xl text-black disabled:text-gray-300 float-right w-fit" />
          </Button>
        </div>
      </div>
    </div>
  )
}
