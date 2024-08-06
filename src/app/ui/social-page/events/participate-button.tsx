import React, { useState } from 'react'
import checkPermission from '../../common/checking-permission'
import { Button, Spinner } from '@material-tailwind/react'
import useAuth from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

export default function ParticipateButton({
  requiredPermission,
  isParticipated,
  isDisabled,
  onParticipate,
  onCancelParticipation,
  eventId,
  participateBtnClassName,
  cancelPartcipateBtnClassName,
  requiredBtnClassName,
}) {
  const { isLoggedIn, userId } = useAuth()
  const router = useRouter()

  if (!isLoggedIn)
    return (
      <Button
        onClick={() => router.push('/signin')}
        placeholder={undefined}
        size="md"
        className={requiredBtnClassName}>
        {'Đăng nhập để tham gia'}
      </Button>
    )
  return (
    <>
      {checkPermission(requiredPermission) ? (
        !isParticipated ? (
          <Button
            onClick={() => {
              onParticipate(eventId)
            }}
            disabled={isDisabled}
            placeholder={undefined}
            size="md"
            className={participateBtnClassName}>
            {isDisabled && <Spinner className="h-6 w-6"></Spinner>}
            Tham gia
          </Button>
        ) : (
          <Button
            onClick={() => onCancelParticipation(eventId)}
            disabled={isDisabled}
            placeholder={undefined}
            size="md"
            className={cancelPartcipateBtnClassName}>
            {isDisabled && <Spinner className="h-6 w-6"></Spinner>}
            Huỷ tham gia
          </Button>
        )
      ) : (
        <Button
          onClick={() => router.push(`/profile/${userId}`)}
          placeholder={undefined}
          size="md"
          className={requiredBtnClassName}>
          {'Xét duyệt để tham gia'}
        </Button>
      )}
    </>
  )
}
