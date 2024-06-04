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
  tabs,
} from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { nunito } from '../../../ui/fonts'
import NoData from '../../../ui/no-data'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  GlobeAmericas,
  Dot,
  Gear,
  BoxArrowInRight,
  Link,
  PencilSquare,
  Trash,
} from 'react-bootstrap-icons'
import Discuss from '../../../ui/social-page/groups/discuss'
import ListMember from '../../../ui/social-page/groups/list-member'
import MemberRequest from '../../../ui/social-page/groups/member-request'
import { GROUP_PRIVACY, GROUP_TABS, JWT_COOKIE } from '../../../constant'
import axios from 'axios'
import Cookies from 'js-cookie'

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
      <DialogBody placeholder={undefined}>Bạn có muốn xóa nhóm ?</DialogBody>
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

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const [activeTab, setActiveTab] = useState('Thảo luận')

  const [noData, setNoData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [group, setGroup] = useState(null)
  const [openDialogDeleteGroup, setOpenDialogDeleteGroup] = useState(false)

  function hanldeOpenDeleteGroupDialog() {
    setOpenDialogDeleteGroup((e) => !e)
  }

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      })
      .then(({data}) => {
        setGroup(data)
        setIsLoading(false)
      })
      .catch((error) => {
        setNoData(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) return <NoData />

  if (!isLoading)
    return (
      <div
        className={`${nunito.className} max-w-[1350px] min-w-[480px] w-[80%] m-auto mb-10`}>
        <div className="relative">
          <Toaster
            containerStyle={{ zIndex: 99999 }}
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
          <img
            src={group.coverUrl}
            alt="group cover"
            className="w-full h-60 object-cover object-center"
          />
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="flex items-center text-[22px] xl:text-[26px] font-bold ">
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
            </div>

            {group.userRole ? (
              <Button
                placeholder={undefined}
                className="normal-case px-4 py-2 text-[14px] h-fit bg-[#e4e6eb] text-black ">
                Đã tham gia
              </Button>
            ) : (
              <Button
                placeholder={undefined}
                className="normal-case px-4 py-2 text-[14px] bg-[--blue-04] text-[--blue-05]">
                Tham gia
              </Button>
            )}
          </div>
          {/*  */}

          <div className="flex flex-col gap-1 mt-6">
            <div className="border border-[--delete-filter]"></div>
            <div className="flex justify-between items-center">
              <div>
                <Tabs value="Thảo luận" className="bg-white z-0">
                  <TabsHeader
                    placeholder={undefined}
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 z-0"
                    indicatorProps={{
                      className:
                        'bg-transparent border-b-2 border-[--blue-05] shadow-none rounded-none z-0',
                    }}>
                    {GROUP_TABS.map(({ label }) => (
                      <Tab
                        key={label}
                        placeholder={undefined}
                        value={label}
                        onClick={() => setActiveTab(label)}
                        className={
                          activeTab === label
                            ? 'text-gray-900 text-nowrap w-fit px-6 py-4 text-[--blue-05]'
                            : 'text-nowrap w-fit px-6 py-4'
                        }>
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                </Tabs>
              </div>

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
                  <MenuItem
                    placeholder={undefined}
                    className="flex items-center gap-1 text-black py-3">
                    <BoxArrowInRight className="text-lg" />
                    Rời khỏi nhóm
                  </MenuItem>

                  {(group.userRole === 'CREATOR' ||
                    group.userRole === 'ADMIN') && (
                    <>
                      <MenuItem placeholder={undefined}>
                        <Link
                          href={`/groups/${group.id}/edit`}
                          className="flex items-center gap-1 text-black py-1">
                          <PencilSquare className="text-lg" />
                          Chỉnh sửa thông tin nhóm
                        </Link>
                      </MenuItem>

                      <MenuItem
                        placeholder={undefined}
                        onClick={hanldeOpenDeleteGroupDialog}
                        className="flex items-center gap-1 text-black py-1">
                        <Trash className="text-lg" />
                        Xóa nhóm
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </div>
          </div>
        </div>
        {/* <DeleteGroupDialog
          id={params.id}
          openDialogDeleteGroup={openDialogDeleteGroup}
          hanldeOpenDeleteGroupDialog={hanldeOpenDeleteGroupDialog}
          onDelete={onDelete}
        /> */}
        {/* {children} */}
      </div>
    )
}
