'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@material-tailwind/react'
import { PlusCircle, Star } from 'react-bootstrap-icons'
import AchievementListItem, {
  DialogAddAchievements,
} from '@/app/ui/social-page/profile/ProfileAchievement'
import axios from 'axios'
import { JWT_COOKIE } from '@/app/constant'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'

export default function Page() {
  const [openDialogAdd, setOpenDialogAdd] = useState(false)
  const [achievements, setAchievements] = useState(null)
  const pathname = usePathname()
  const parts = pathname.split('/')
  const userIdParams = parts[2]
  const [isProfileLoginUser, setIsProfileLoginUser] = useState(false)

  function handleOpenDialogAdd() {
    setOpenDialogAdd((e) => !e)
  }

  const onAddAchievements = (
    e: React.FormEvent<HTMLFormElement>,
    achivement: object
  ): Promise<any> => {
    e.preventDefault()
    return axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/profile/achievement`,
      achivement,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }

  const onHandleAddAchievements = async (e, achievement) => {
    try {
      const {
        data: { achievement: newAchievement },
      } = await onAddAchievements(e, achievement)
      toast.success('Thêm thành tựu thành công')
      setAchievements((prev) => [newAchievement, ...prev]) // Ensure correct con catenation
      handleOpenDialogAdd()
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }

  useEffect(() => {
    setIsProfileLoginUser(userIdParams === Cookies.get('userId'))

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/user/${userIdParams}/profile/achievement`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { achievements } }) => {
        setAchievements(achievements)
      })
      .catch((error) => {})
  }, [])

  return (
    <div>
      <div className="w-full flex flex-col gap-4">
        <p className="text-[18px] lg:text-[22px] font-bold">
          Thành tựu nổi bật
        </p>
        <div className="w-full flex flex-col gap-4">
          {isProfileLoginUser && (
            <Button
              placeholder={undefined}
              className="w-fit  normal-case text-[--blue-05] text-[15px] font-light flex items-center gap-4 px-2"
              onClick={handleOpenDialogAdd}
              variant="text">
              <PlusCircle className="text-xl" />
              Thêm nơi thành tựu nổi bật
            </Button>
          )}

          {achievements?.length > 0 ? (
            achievements?.map((achivement) => (
              <AchievementListItem
                key={achivement?.achievementId}
                achivement={achivement}
                isProfileLoginUser={isProfileLoginUser}
              />
            ))
          ) : (
            <div className="flex items-center gap-2">
              <Star className="text-[20px] lg:text-[24px]" /> Không có thành tựu
              nổi bật để hiển thị
            </div>
          )}
        </div>
        <DialogAddAchievements
          openDialogAdd={openDialogAdd}
          handleOpenDialogAdd={handleOpenDialogAdd}
          onAddAchievements={onHandleAddAchievements}
        />
      </div>
    </div>
  )
}
