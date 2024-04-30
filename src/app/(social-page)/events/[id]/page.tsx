'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react'
import {
  ClockFill,
  GeoAltFill,
  BarChartFill,
  TagFill,
} from 'react-bootstrap-icons'
import { nunito } from '../../../ui/fonts'
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  Avatar,
  Spinner,
} from '@material-tailwind/react'
import axios from 'axios'
import { JWT_COOKIE } from '../../../constant'
import Cookies from 'js-cookie'
import NoData from '../../../ui/no-data'
import moment from 'moment'
import { XLg } from 'react-bootstrap-icons'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'

// let listUser = [
//   {
//     id: '1',
//     avatarUrl: '/demo.jpg',
//     fullName: 'John Smith',
//   },
// ]

// // Duplicate elements to n
// const n = 50
// listUser = Array(n)
//   .fill(null)
//   .flatMap(() => listUser)
// const fetchMore = () => {
//   listUser.concat(listUser)
// }

const PARTICIPANT_FETCH_LIMIT = 50

function ParticipantsDialog({
  openDialog,
  handleOpenParticipantsDialog,
  participants,
  participantCount,
  onLoadParticipants,
}) {
  const participantPage = useRef(0)
  const [hasMore, setHasMore] = useState(true)

  const onFetchMore = () => {
    if (participants.length >= participantCount) {
      setHasMore(false)
      return
    }
    participantPage.current++
    onLoadParticipants(participantPage.current)
  }

  return (
    <Dialog
      size="xs"
      placeholder={undefined}
      open={openDialog}
      handler={handleOpenParticipantsDialog}
      className="p-4 w-[350px]">
      <DialogHeader className="flex" placeholder={undefined}>
        <p className={`${nunito.className} m-auto font-semibold`}>
          Danh sách tham gia
        </p>
        <Button
          className="p-2"
          placeholder={undefined}
          variant="text"
          onClick={handleOpenParticipantsDialog}>
          <XLg className="text-lg" />
        </Button>
      </DialogHeader>
      <DialogBody
        id="scrollableParticipants"
        placeholder={undefined}
        className="flex flex-col h-[400px] overflow-y-auto scrollbar-webkit-main">
        <InfiniteScroll
          className="flex flex-col gap-2"
          dataLength={participants.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={
            <div className="h-10 flex justify-center ">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }
          scrollableTarget="scrollableParticipants">
          {participants.map(({ id, fullName, avatarUrl }) => (
            <Link
              href={`#`}
              key={id}
              className="flex items-center gap-3 hover:bg-gray-100 rounded-sm">
              <Avatar placeholder={undefined} src={avatarUrl} alt="avatar" />
              <p>{fullName}</p>
            </Link>
          ))}
        </InfiniteScroll>
      </DialogBody>
    </Dialog>
  )
}

export default function Page({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState(null)
  const [noData, setNoData] = useState(false)
  const [openParticipantsDialog, setOpenParticipantsDialog] = useState(false)
  const [isParticipated, setIsParticipated] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [participants, setParticipants] = useState([])

  const onParticipate = async (eventId) => {
    setIsDisabled(true)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${eventId}/participants`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      setIsParticipated((isParticipated) => !isParticipated)
      setIsDisabled(false)
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra!')
    }
  }
  const onCancelParticipation = async (eventId) => {
    setIsDisabled(true)
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${eventId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      setIsParticipated((isParticipated) => !isParticipated)
      setIsDisabled(false)
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra!')
    }
  }
  // Fetch event participants
  const onInitialLoadParticipants = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}/participants?limit=${PARTICIPANT_FETCH_LIMIT}&page=0`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data }) => {
        setParticipants(participants.concat(data.participants))
      })
      .catch((e) => {
        console.log(e)
      })
  }
  const onLoadMoreParticipants = async (page: number) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}/participants?limit=${PARTICIPANT_FETCH_LIMIT}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    const { data } = res
    setParticipants(participants.concat(data.participants))
  }

  const handleOpenParticipantsDialog = () => {
    setOpenParticipantsDialog((e) => !e)
  }

  // Fetch event details
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/events/${params.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data: event }) => {
        // Get list of events that users whether have participated in
        axios
          .get(
            `${process.env.NEXT_PUBLIC_SERVER_HOST}/events/is-participated?eventIds=${params.id}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
              },
            }
          )
          .then(({ data }) => {
            event.isParticipated = data[0].isParticipated
            setIsParticipated(data[0].isParticipated)
            setEvent(event)
            setIsLoading(false)
          })
      })
      .catch((e) => {
        setNoData(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) {
    return <NoData />
  }

  if (!isLoading)
    return (
      <div
        className={`${nunito.className} flex flex-col gap-6 w-[75%] max-w-[1366px] bg-[--blue-04] rounded-lg m-auto lg:px-10 lg:py-10 mt-16 mb-16`}>
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: '#00a700',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#ea7b7b',
                color: 'white',
              },
            },
          }}
        />
        <div className="flex flex-col xl:flex-row items-center justify-center m-auto gap-x-10">
          <img
            src={event?.thumbnail}
            alt="image event"
            className="sm:w-[410px] sm:h-[250px] md:w-[500px] md:h-[350px]  xl:w-[550px] xl:h-[350px]  2xl:w-[40vw] 2xl:h-[400px] max-w-[1000px] object-cover object-center rounded-lg"
          />
          <div className="flex flex-col gap-4 w-full">
            <div>
              <p className="text-left sm:text-[1.5rem] 2xl:text-[1.9rem] font-extrabold ">
                {event?.title}
              </p>
              {event?.faculty && (
                <p className="text-left sm:text-[1.1rem] 2xl:text-[1.5rem] font-semibold">
                  Khoa {event.faculty.name}
                </p>
              )}
            </div>

            <div className="w-full flex flex-col xl:gap-y-6 2xl:gap-y-10 items-start">
              <div>
                <p className="flex text-nowrap items-start gap-2 sm:text-[16px] 2xl:text-[20px]">
                  <GeoAltFill className="text-[--blue-02]" />{' '}
                  <span>Địa điểm:</span>
                  <span className="text-wrap w-[60%]">
                    {event?.organizationLocation}
                  </span>
                </p>
                <p className="flex items-center gap-2 sm:text-[16px] 2xl:text-[20px]">
                  <ClockFill className="text-[--blue-02]" />
                  <span className="w-fit">Thời gian:</span>
                  <span className="text-wrap w-[60%]">
                    {event &&
                      moment(event?.organizationTime).format(
                        'DD-MM-YYYY HH:mm:ss'
                      )}
                  </span>
                </p>

                {event?.tags && (
                  <p className="flex items-center gap-2 sm:text-[16px] 2xl:text-[20px]">
                    <TagFill className="text-[--blue-02]" />
                    <span className="text-wrap w-[85%]">
                      {event.tags.map((tag) => tag.name + ' ')}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col justify-center items-center lg:items-start gap-6 ">
              <div
                className="flex gap-3 hover:cursor-pointer"
                onClick={() => {
                  if (participants.length === 0) {
                    onInitialLoadParticipants()
                  }
                  handleOpenParticipantsDialog()
                }}>
                <BarChartFill className="text-[--blue-02] text-[4.1rem]" />
                <div className="flex flex-col">
                  <p className="text-[20px] 2xl:text-[30px] font-extrabold">
                    {event?.participants}
                  </p>
                  <p className="text-lg">người tham gia</p>
                </div>
              </div>
              <ParticipantsDialog
                openDialog={openParticipantsDialog}
                handleOpenParticipantsDialog={handleOpenParticipantsDialog}
                participants={participants}
                participantCount={event?.participants}
                onLoadParticipants={onLoadMoreParticipants}
              />
              {!isParticipated ? (
                <Button
                  onClick={() => onParticipate(params.id)}
                  disabled={isDisabled}
                  placeholder={undefined}
                  size="md"
                  className="bg-[--blue-02] font-medium w-full text-[16px]">
                  Tham gia
                </Button>
              ) : (
                <Button
                  onClick={() => onCancelParticipation(params.id)}
                  disabled={isDisabled}
                  placeholder={undefined}
                  size="md"
                  className="bg-[--blue-02] font-medium w-full text-[16px]">
                  Huỷ tham gia
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="lg:text-[26px] sm:text-lg font-extrabold">
            Thông tin chi tiết
          </p>
          <p className="text-pretty text-base">{event?.content}</p>
        </div>
      </div>
    )
}
