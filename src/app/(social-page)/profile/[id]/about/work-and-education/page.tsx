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
import toast from 'react-hot-toast'

export default function Page() {
  const [openDialogAddWorks, setOpenDialogAddWorks] = useState(false)
  const [openDialogAddEducation, setOpenDialogAddEducation] = useState(false)
  const [works, setWorks] = useState([])
  const [educations, setEducations] = useState([])

  const [coverImage, setCoverImage] = useState('')
  const pathname = usePathname()
  const parts = pathname.split('/')
  const userIdParams = parts[2]
  const [isProfileLoginUser, setIsProfileLoginUser] = useState(false)

  function handleOpenDialogAddWorks() {
    setOpenDialogAddWorks((e) => !e)
  }

  function handleOpenDialogAddEducation() {
    setOpenDialogAddEducation((e) => !e)
  }

  const onAddJob = (
    e: React.FormEvent<HTMLFormElement>,
    job: object
  ): Promise<any> => {
    e.preventDefault()
    return axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/job`,
      job,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }

  const onHandleAddJob = async (job, e) => {
    try {
      const {
        data: { job: newJob },
      } = await onAddJob(e, job)
      toast.success('Thêm thành công việc')
      setWorks((prev) => [newJob, ...prev]) // Ensure correct con catenation
      handleOpenDialogAddWorks()
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }

  const onAddEducation = (
    e: React.FormEvent<HTMLFormElement>,
    education: object
  ): Promise<any> => {
    e.preventDefault()
    return axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/education`,
      education,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }

  const onHandleAddEducation = async (education, e) => {
    try {
      const {
        data: { education: neweducation },
      } = await onAddEducation(e, education)
      toast.success('Thêm học vấn thành công')
      console.log(education)
      setEducations((prev) => [neweducation, ...prev]) // Ensure correct con catenation
      handleOpenDialogAddEducation()
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }

  useEffect(() => {
    setIsProfileLoginUser(userIdParams === Cookies.get('userId'))

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

        {isProfileLoginUser && (
          <Button
            placeholder={undefined}
            className="w-fit  normal-case text-[--blue-05] text-[15px] font-light flex items-center gap-4 px-2"
            onClick={handleOpenDialogAddWorks}
            variant="text">
            <PlusCircle className="text-xl" />
            Thêm nơi làm việc
          </Button>
        )}

        {works?.length > 0 ? (
          works.map((job) => (
            <WorksListItem
              key={job.jobId}
              job={job}
              isProfileLoginUser={isProfileLoginUser}
            />
          ))
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
        onHandleAddJob={onHandleAddJob}
      />

      <div className="w-full flex flex-col gap-4 mt-4">
        <p className="text-[18px] lg:text-[22px] font-bold">Học vấn</p>
        {isProfileLoginUser && (
          <Button
            placeholder={undefined}
            className="w-fit  normal-case text-[--blue-05] text-[15px] font-light flex items-center gap-4 px-2"
            onClick={handleOpenDialogAddEducation}
            variant="text">
            <PlusCircle className="text-xl" />
            Thêm trình độ học vấn
          </Button>
        )}
        <DialogAddEducation
          handleOpenDialogAddEducation={handleOpenDialogAddEducation}
          openDialogAddEducation={openDialogAddEducation}
          onHandleAddEducation={onHandleAddEducation}
        />
        {educations?.map((education) => (
          <EducationListItem
            key={education?.educationId}
            education={education}
            isProfileLoginUser={isProfileLoginUser}
          />
        ))}
      </div>
    </div>
  )
}
