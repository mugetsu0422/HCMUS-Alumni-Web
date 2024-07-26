'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  Input,
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
} from '@material-tailwind/react'
import { Search, Dot, ThreeDots, Pencil, Trash } from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { JWT_COOKIE } from '../../../../constant'
import Cookies from 'js-cookie'
import { useGroupContext } from '../layout'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDebouncedCallback } from 'use-debounce'
import toast from 'react-hot-toast'

const curUserId = Cookies.get('userId')
const MembersContext = createContext(null)

export default function Page({ params }: { params: { id: string } }) {
  const group = useGroupContext()
  const [isLoading, setIsLoading] = useState(true)
  const normalMemberCurPage = useRef(0)
  const [normalMemberTotalPages, setNormalMemberTotalPages] = useState(1)
  const [normalMembers, setNormalMembers] = useState([])
  const [normalMembersHaveMore, setNormalMembersHaveMore] = useState(true)

  const [adminMembers, setAdminMembers] = useState([])

  // Search
  const [searching, setSearching] = useState(false)
  const [searchingParams, setSearchingParams] = useState('')
  const searchingMemberCurPage = useRef(0)
  const [searchingMemberTotalPages, setSearchingMemberTotalPages] = useState(1)
  const [searchingMembers, setSearchingMembers] = useState([])
  const [searchingMembersHaveMore, setSearchingMembersHaveMore] = useState(true)

  const onSearchMembers = useDebouncedCallback((query) => {
    if (query) {
      setSearchingParams(`name=${query}`)
    } else {
      setSearchingParams('')
    }
  }, 500)
  const onFetchMore = () => {
    normalMemberCurPage.current++
    if (normalMemberCurPage.current >= normalMemberTotalPages) {
      setNormalMembersHaveMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/members?role=MEMBER&page=${normalMemberCurPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { members } }) => {
        setNormalMembers(normalMembers.concat(members))
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const onFetchMoreSearching = () => {
    searchingMemberCurPage.current++
    if (searchingMemberCurPage.current >= searchingMemberTotalPages) {
      setSearchingMembersHaveMore(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/members?${searchingParams}&page=${searchingMemberCurPage.current}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { members } }) => {
        setSearchingMembers(searchingMembers.concat(members))
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const onUpdateMemberRole = (userId: string, role: 'ADMIN' | 'MEMBER') => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/members/${userId}`,
        { role: role },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Cập nhật vai trò thành công')
      })
      .catch((error) => {
        toast.error(error.response?.data?.error?.message.error?.message || 'Lỗi không xác định')
      })
  }
  const onRemoveMember = (userId: string) => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/members/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(() => {
        toast.success('Xóa thành viên thành công')
      })
      .catch((error) => {
        toast.error(error.response?.data?.error?.message.error?.message || 'Lỗi không xác định')
      })
  }

  // Initial fetch
  useEffect(() => {
    // Admin members
    const groupCreator = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/members?role=CREATOR`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    // Admin members
    const membersAdminGroup = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/members?role=ADMIN`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    // Normal members
    const membersGroup = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/members?role=MEMBER`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )

    Promise.all([groupCreator, membersAdminGroup, membersGroup])
      .then(([groupCreatorRes, membersAdminGroupRes, membersGroupRes]) => {
        const {
          data: { members: creatorMembers },
        } = groupCreatorRes
        const {
          data: { members: adminMembers },
        } = membersAdminGroupRes
        const {
          data: { totalPages, members },
        } = membersGroupRes

        setAdminMembers(creatorMembers.concat(adminMembers))
        setNormalMemberTotalPages(totalPages)
        setNormalMembers(members)
        setIsLoading(false)
      })
      .catch((error) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Searching fetch
  useEffect(() => {
    if (!searchingParams) {
      searchingMemberCurPage.current = 0
      setSearchingMemberTotalPages(1)
      setSearchingMembers([])
      setSearchingMembersHaveMore(true)
      setSearching(false)
      return
    }

    axios
      .get(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/groups/${params.id}/members?${searchingParams}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
          },
        }
      )
      .then(({ data: { totalPages, members } }) => {
        setSearchingMemberTotalPages(totalPages)
        setSearchingMembers(members)
        setSearching(true)
      })
      .catch((error) => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchingParams])

  if (!isLoading)
    return (
      <MembersContext.Provider value={{ onUpdateMemberRole, onRemoveMember }}>
        <div className="mt-8 w-full xl:w-[60%] m-auto">
          <p className="font-bold text-[20px] mb-4 flex items-center">
            Thành viên <Dot /> {group.participantCount}
          </p>
          <Input
            size="lg"
            crossOrigin={undefined}
            variant="outlined"
            label="Tìm thành viên"
            type="text"
            icon={<Search />}
            onChange={(e) => onSearchMembers(e.target.value)}
            className="bg-white w-full rounded-full"
          />
          {searching ? (
            <SearchingUI
              currentUserRole={group.userRole}
              members={searchingMembers}
              onFetchMore={onFetchMoreSearching}
              hasMore={searchingMembersHaveMore}
            />
          ) : (
            <InitialUI
              currentUserRole={group.userRole}
              adminMembers={adminMembers}
              normalMembers={normalMembers}
              onFetchMore={onFetchMore}
              hasMore={normalMembersHaveMore}
            />
          )}
        </div>
      </MembersContext.Provider>
    )
}

function ManageMemberMenuList({
  role,
  onClickUpdateRole,
  onClickRemoveMember,
}) {
  if (role === 'CREATOR') return null
  return (
    <>
      <Menu placement="bottom-end">
        <MenuHandler>
          <Button
            placeholder={undefined}
            variant="text"
            className="rounded-full h-fit p-2">
            <ThreeDots className="text-lg text-black" />
          </Button>
        </MenuHandler>
        <MenuList placeholder={undefined}>
          <MenuItem
            onClick={onClickUpdateRole}
            placeholder={undefined}
            className={`text-black text-base flex items-center gap-2`}>
            <Pencil />
            <p>
              {role === 'MEMBER'
                ? 'Đặt làm quản trị viên'
                : role === 'ADMIN'
                  ? 'Gỡ vai trò quản trị viên'
                  : null}
            </p>
          </MenuItem>
          <MenuItem
            onClick={onClickRemoveMember}
            placeholder={undefined}
            className={`text-black text-base flex items-center gap-2`}>
            <Trash />
            <p>Xóa thành viên</p>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

function Member({ currentUserRole, user, role }) {
  const { onUpdateMemberRole, onRemoveMember } = useContext(MembersContext)
  const [isDeleted, setIsDeleted] = useState(false)

  const onClickUpdateRole = () => {
    if (role === 'MEMBER') {
      onUpdateMemberRole(user.id, 'ADMIN')
    } else if (role === 'ADMIN') {
      onUpdateMemberRole(user.id, 'MEMBER')
    }
  }
  const onClickRemoveMember = () => {
    onRemoveMember(user.id)
    setIsDeleted(true)
  }

  if (isDeleted) return null
  return (
    <>
      <div key={user.id} className="flex justify-between mb-2">
        <div className="flex gap-2 items-center">
          <Avatar
            placeholder={undefined}
            src={user.avatarUrl}
            alt="user avatar"
          />
          <div>
            <p>{user.fullName}</p>
            {(role === 'CREATOR' || role === 'ADMIN') && (
              <p className="text-xs p-1 text-[--blue-05] bg-[--blue-03] font-semibold w-fit">
                Quản trị viên
              </p>
            )}
          </div>
        </div>

        {(currentUserRole === 'CREATOR' || currentUserRole === 'ADMIN') &&
          user.id !== curUserId && (
            <ManageMemberMenuList
              role={role}
              onClickUpdateRole={onClickUpdateRole}
              onClickRemoveMember={onClickRemoveMember}
            />
          )}
      </div>
    </>
  )
}

function InitialUI({
  currentUserRole,
  adminMembers,
  normalMembers,
  onFetchMore,
  hasMore,
}) {
  return (
    <>
      <div className="flex flex-col gap-4 mt-4">
        <p className="font-bold">Quản trị viên</p>
        {adminMembers.map(({ user, role }) => (
          <Member
            key={user.id}
            currentUserRole={currentUserRole}
            user={user}
            role={role}
          />
        ))}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <p className="font-bold">Thành viên trong nhóm</p>
        <InfiniteScroll
          dataLength={normalMembers.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={
            <div className="h-10 my-5 flex justify-center">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }>
          {normalMembers.map(({ user, role }) => (
            <Member
              key={user.id}
              currentUserRole={currentUserRole}
              user={user}
              role={role}
            />
          ))}
        </InfiniteScroll>
      </div>
    </>
  )
}

function SearchingUI({ currentUserRole, members, onFetchMore, hasMore }) {
  return (
    <>
      <div className="flex flex-col gap-4 mt-4">
        <p className="font-bold">Kết quả tìm kiếm</p>
        <InfiniteScroll
          dataLength={members.length}
          next={onFetchMore}
          hasMore={hasMore}
          loader={
            <div className="h-10 my-5 flex justify-center">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }>
          {members.map(({ user, role }) => (
            <Member
              key={user.id}
              currentUserRole={currentUserRole}
              user={user}
              role={role}
            />
          ))}
        </InfiniteScroll>
      </div>
    </>
  )
}
