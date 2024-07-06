'use client'

import React, { useState, useEffect } from 'react'
import { Briefcase, PlusCircle } from 'react-bootstrap-icons'
import { Button } from '@material-tailwind/react'
import axios from 'axios'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import WorksListItem, {
  DialogAddWorks,
} from '@/app/ui/social-page/profile/ProfileWorksUI'
import EducationListItem, {
  DialogAddEducation,
} from '@/app/ui/social-page/profile/ProfileEducation'

export default function Page() {
  const [openDialogAddWorks, setOpenDialogAddWorks] = useState(false)
  const [openDialogAddEducation, setOpenDialogAddEducation] = useState(false)
  const [works, setWorks] = useState(null)
  const [educations, setEducations] = useState(null)
  const userId = Cookies.get('userId')

  const [coverImage, setCoverImage] = useState('')
  const pathname = usePathname()
  const parts = pathname.split('/')
  const userIdParams = parts[2]

  function handleOpenDialogAddWorks() {
    setOpenDialogAddWorks((e) => !e)
  }

  function handleOpenDialogAddEducation() {
    setOpenDialogAddEducation((e) => !e)
  }

  useEffect(() => {
    const worksPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userIdParams}/profile/job`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    const educationsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userIdParams}/profile/education`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    Promise.all([worksPromise, educationsPromise])
      .then(([worksRes, educationsRes]) => {
        setWorks(worksRes.data.jobs)
        setEducations(educationsRes.data.education)
      })
      .catch((error) => {})
  }, [userIdParams])

  return (
    <div>
      {/* Thông tin cá nhân */}
      <div className="w-full flex flex-col gap-4">
        <p className="text-[18px] lg:text-[22px] font-bold">Công việc</p>
        <Button
          placeholder={undefined}
          className="w-fit  normal-case text-[--blue-05] text-[15px] font-light flex items-center gap-4 px-2"
          onClick={handleOpenDialogAddWorks}
          variant="text">
          <PlusCircle className="text-xl" />
          Thêm nơi làm việc
        </Button>
        {works?.length > 0 ? (
          works?.map(
            ({
              jobId,
              companyName,
              position,
              startTime,
              endTime,
              isWorking,
            }) => (
              <WorksListItem
                key={jobId}
                id={jobId}
                name={companyName}
                position={position}
                startTime={startTime}
                endTime={endTime}
                isWorking={isWorking}
              />
            )
          )
        ) : (
          <div className="flex items-center gap-2">
            <Briefcase className="text-[20px] lg:text-[24px]" /> Không có công
            việc để hiển thị
          </div>
        )}
      </div>
      <DialogAddWorks
        openDialogAddWorks={openDialogAddWorks}
        handleOpenDialogAddWorks={handleOpenDialogAddWorks}
      />

      <div className="w-full flex flex-col gap-4 mt-4">
        <p className="text-[18px] lg:text-[22px] font-bold">Học vấn</p>
        <Button
          placeholder={undefined}
          className="w-fit  normal-case text-[--blue-05] text-[15px] font-light flex items-center gap-4 px-2"
          onClick={handleOpenDialogAddEducation}
          variant="text">
          <PlusCircle className="text-xl" />
          Thêm trình độ học vấn
        </Button>

        <DialogAddEducation
          handleOpenDialogAddEducation={handleOpenDialogAddEducation}
          openDialogAddEducation={openDialogAddEducation}
        />
        {educations?.map((education) => (
          <EducationListItem
            key={education.educationId}
            education={education}
          />
        ))}
      </div>
    </div>
  )
}
