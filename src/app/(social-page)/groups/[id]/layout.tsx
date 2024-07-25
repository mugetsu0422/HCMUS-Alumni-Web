/* eslint-disable @next/next/no-img-element */
'use client'

import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tab,
  Tabs,
  TabsHeader,
  Spinner,
} from '@material-tailwind/react'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  GlobeAmericas,
  Dot,
  Gear,
  BoxArrowInRight,
  PencilSquare,
  Trash,
  TagsFill,
} from 'react-bootstrap-icons'
import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import clsx from 'clsx'
import Link from 'next/link'

import { JWT_COOKIE, GROUP_PRIVACY, GROUP_TABS } from '@/app/constant'
import { nunito } from '@/app/ui/fonts'
import NotFound404 from '@/app/ui/common/not-found-404'
import checkPermission from '@/app/ui/common/checking-permission'

const GroupContext = createContext(null)
export const useGroupContext = () => {
  return useContext(GroupContext)
}

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string; group: any }
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(() => {
    const parts = pathname.split('/')
    if (parts[3] === undefined || parts[3] === 'posts') return ''
    return parts[3]
  })

  const [notFound, setNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [group, setGroup] = useState(null)
  const [openDialogDeleteGroup, setOpenDialogDeleteGroup] = useState(false)
  const [openDialogLeaveGroup, setOpenDialogLeaveGroup] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [isRequestPending, setIsRequestPending] = useState(false)

  function hanldeOpenDeleteGroupDialog() {
    setOpenDialogDeleteGroup((e) => !e)
  }
  function handleOpenLeaveGroupDialog() {
    setOpenDialogLeaveGroup((e) => !e)
  }
  const handleClickTab = (url) => {
    setActiveTab(url)
    router.push(`/groups/${params.id}/${url}`)
  }
  const onDeleteGroup = (id) => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then((res) => {
        toast.success('Xoá thành công')
      })
      .catch((e) => {
        toast.success('Xoá thất bại')
      })
  }
  const onLeaveGroup = (id) => {
    const userId = Cookies.get('userId')
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${id}/members/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {})
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message.error?.message ||
            'Lỗi không xác định'
        )
      })
  }
  const onJoinGroup = (groupId: string): Promise<AxiosResponse<any, any>> => {
    return axios.post(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${groupId}/requests`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
  }
  const onClickJoinButton = () => {
    setIsJoining(true)
    onJoinGroup(group.id)
      .then((data) => {})
      .catch((error) => {
        toast.error(
          error.response?.data?.error?.message.error?.message ||
            'Lỗi không xác định'
        )
      })
      .finally(() => {
        setIsJoining(false)
        if (group.privacy === 'PUBLIC') {
          setIsJoined(true)
        } else if (group.privacy === 'PRIVATE') {
          setIsRequestPending(true)
        }
      })
  }
  const hasAtLeastOnePermission = (userRole) => {
    if (!userRole) return false
    const permissionsMap = {
      edit: ['CREATOR', 'ADMIN'],
      delete: ['CREATOR'],
    }
    // Iterate over the permissionsMap to check if the userRole has any of the permissions
    for (const permission in permissionsMap) {
      if (permissionsMap[permission].includes(userRole)) {
        return true // User has at least one permission
      }
    }
    return false // User doesn't have any of the required permissions
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({ data }) => {
        setIsJoined(data.userRole ? true : false)
        setIsRequestPending(data.isRequestPending)
        setGroup(data)
        setIsLoading(false)
      })
      .catch((error) => {
        return setNotFound(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (notFound) return <NotFound404 />

  if (!isLoading)
    return (
      <div
        className={`${nunito.className} max-w-[1350px] min-w-[480px] w-[80%] m-auto mb-10`}>
        <div className="relative">
          <img
            src={group.coverUrl}
            alt="group cover"
            className="w-full h-60 object-cover object-center"
          />
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="flex items-center text-[22px] xl:text-[28px] font-bold ">
                {group.name}
              </p>

              <p className="flex items-center">
                {group.privacy != 'PUBLIC' ? (
                  <FontAwesomeIcon icon={faLock} className="mr-2" />
                ) : (
                  <GlobeAmericas className="mr-2" />
                )}
                {GROUP_PRIVACY[group.privacy]} <Dot /> {group.participantCount}{' '}
                thành viên tham gia
              </p>

              {group.tags.length > 0 && (
                <div className="flex items-center gap-1 text-[--secondary]">
                  <TagsFill className="text-[--blue-05] mr-2" />
                  {group.tags.map(({ id, name }) => (
                    <span key={id}>{name}</span>
                  ))}
                </div>
              )}
            </div>

            {checkPermission('Group.Join') &&
              (isRequestPending ? (
                <Button
                  disabled={true}
                  onClick={onClickJoinButton}
                  size="sm"
                  placeholder={undefined}
                  className="h-fit text-white bg-[--blue-02] normal-case text-[14px] w-36 flex justify-center items-center gap-2">
                  {isJoining && <Spinner className="h-[14px] w-[14px]" />}
                  Đang chờ duyệt
                </Button>
              ) : isJoined ? (
                <Menu placement="bottom-end">
                  <MenuHandler>
                    <Button
                      placeholder={undefined}
                      className="normal-case px-4 py-2 text-[14px] h-fit bg-[--blue-04] text-[--blue-05] ">
                      Đã tham gia
                    </Button>
                  </MenuHandler>
                  <MenuList placeholder={undefined}>
                    <MenuItem
                      placeholder={undefined}
                      onClick={handleOpenLeaveGroupDialog}
                      className="flex items-center gap-1 text-black py-3">
                      <BoxArrowInRight className="text-lg" />
                      Rời khỏi nhóm
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Button
                  disabled={isJoining}
                  onClick={onClickJoinButton}
                  size="sm"
                  placeholder={undefined}
                  className="h-fit text-white bg-[--blue-02] normal-case text-[14px] w-36 flex justify-center items-center gap-2">
                  {isJoining && <Spinner className="h-[14px] w-[14px]" />}
                  Tham gia
                </Button>
              ))}
          </div>
          {/*  */}

          <div className="flex flex-col gap-1 mt-6">
            <div className="border border-[--delete-filter]"></div>
            <div className="flex justify-between items-center">
              <div>
                <Tabs value={activeTab || ''} className="bg-white z-0">
                  <TabsHeader
                    placeholder={undefined}
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 z-0"
                    indicatorProps={{
                      className: 'bg-[#e6f0fb] shadow-none rounded-none z-0',
                    }}>
                    {GROUP_TABS.map(({ label, url, rolesRequired }) => {
                      if (rolesRequired.includes(group.userRole))
                        return (
                          <Tab
                            key={label}
                            placeholder={undefined}
                            value={url}
                            onClick={() => handleClickTab(url)}
                            className={clsx({
                              'sm:text-wrap xl:text-nowrap sm:w-[190px] lg:w-fit font-bold px-4 py-2 xl:px-6 xl:py-4 flex justify-start text-[14px] lg:text-base':
                                true,
                              'sm:text-wrap xl:text-nowrap text-[--blue-05] sm:w-[190px] lg:w-full  border-b-2 border-[--blue-05] flex justify-start bg-[#e6f0fb] text-[14px] lg:text-base':
                                activeTab === url,
                            })}
                            activeClassName="text-[--blue-05] bg-[#e6f0fb]">
                            {label}
                          </Tab>
                        )
                      else return null
                    })}
                  </TabsHeader>
                </Tabs>
              </div>

              {hasAtLeastOnePermission(group?.userRole) && (
                <Menu placement="bottom-end">
                  <MenuHandler>
                    <Button
                      placeholder={undefined}
                      variant="text"
                      className="py-2 px-4 flex gap-1 items-center text-black">
                      <Gear className="text-xl" />
                    </Button>
                  </MenuHandler>
                  <MenuList placeholder={undefined}>
                    {(group.userRole === 'CREATOR' ||
                      group.userRole === 'ADMIN') && (
                      <Link href={`/groups/${group.id}/edit`}>
                        <MenuItem
                          placeholder={undefined}
                          className="flex items-center gap-1 text-black py-3">
                          <PencilSquare className="text-lg" />
                          Chỉnh sửa thông tin nhóm
                        </MenuItem>
                      </Link>
                    )}

                    {group.userRole === 'CREATOR' && (
                      <MenuItem
                        placeholder={undefined}
                        onClick={hanldeOpenDeleteGroupDialog}
                        className="flex items-center gap-1 text-black py-3">
                        <Trash className="text-lg" />
                        Xóa nhóm
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </div>
          </div>
        </div>
        <DeleteGroupDialog
          id={params.id}
          openDialogDeleteGroup={openDialogDeleteGroup}
          hanldeOpenDeleteGroupDialog={hanldeOpenDeleteGroupDialog}
          onDelete={onDeleteGroup}
        />
        <LeaveGroupDialog
          id={params.id}
          openDialogLeaveGroup={openDialogLeaveGroup}
          hanldeOpenLeaveGroupDialog={handleOpenLeaveGroupDialog}
          onLeave={onLeaveGroup}
        />
        <GroupContext.Provider value={group}>{children}</GroupContext.Provider>
      </div>
    )
}

function DeleteGroupDialog({
  id,
  openDialogDeleteGroup,
  hanldeOpenDeleteGroupDialog,
  onDelete,
}) {
  const router = useRouter()

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogDeleteGroup}
      handler={hanldeOpenDeleteGroupDialog}>
      <DialogHeader placeholder={undefined}>Xóa nhóm</DialogHeader>
      <DialogBody placeholder={undefined}>Bạn có muốn xóa nhóm?</DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
          placeholder={undefined}
          onClick={hanldeOpenDeleteGroupDialog}>
          <span>Không</span>
        </Button>
        <Button
          className={`${nunito.className} bg-[--delete] text-white normal-case text-md`}
          placeholder={undefined}
          onClick={() => {
            onDelete(id)
            hanldeOpenDeleteGroupDialog()
            router.push('/groups')
          }}>
          <span>Xóa</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

function LeaveGroupDialog({
  id,
  openDialogLeaveGroup,
  hanldeOpenLeaveGroupDialog,
  onLeave,
}) {
  const router = useRouter()

  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDialogLeaveGroup}
      handler={hanldeOpenLeaveGroupDialog}>
      <DialogHeader placeholder={undefined}>Rời nhóm</DialogHeader>
      <DialogBody placeholder={undefined}>Bạn có muốn rời nhóm?</DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
          placeholder={undefined}
          onClick={hanldeOpenLeaveGroupDialog}>
          <span>Không</span>
        </Button>
        <Button
          className={`${nunito.className} bg-[--delete] text-white normal-case text-md`}
          placeholder={undefined}
          onClick={() => {
            onLeave(id)
            hanldeOpenLeaveGroupDialog()
            router.push('/groups')
          }}>
          <span>Rời nhóm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}