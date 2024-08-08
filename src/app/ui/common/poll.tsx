import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
  List,
  Radio,
  Spinner,
} from '@material-tailwind/react'
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { XLg, HandThumbsUpFill } from 'react-bootstrap-icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { nunito } from '../fonts'
import checkPermission from './checking-permission'
import delay from '@/helper/delay'
import toast from 'react-hot-toast'

const PollContext = createContext(null)

function UserVotesDialog({
  users,
  voteOptionName,
  voteCount,
  hasMore,
  openUserVotesDialog,
}) {
  const {
    totalVoteCount,
    handleOpenUserVotesDialog,
    handleFetchMoreUserVotes,
  } = useContext(PollContext)

  return (
    <Dialog
      size="sm"
      placeholder={undefined}
      open={openUserVotesDialog}
      handler={handleOpenUserVotesDialog}>
      <DialogHeader
        placeholder={undefined}
        className={`${nunito.className} sticky top-0 flex items-center`}>
        <p className="m-auto text-xl text-black">{voteOptionName}</p>
        <Button
          onClick={handleOpenUserVotesDialog}
          placeholder={undefined}
          className="rounded-full p-2"
          variant="text">
          <XLg className="text-lg" />
        </Button>
      </DialogHeader>

      <DialogBody
        id="scrollableUserVotes"
        placeholder={undefined}
        className={`${nunito.className} flex flex-col gap-4 h-[50dvh] overflow-y-auto scrollbar-webkit-main`}>
        <div className="text-black font-medium text-xl">
          {totalVoteCount ? Math.trunc((voteCount / totalVoteCount) * 100) : 0}%
          · {voteCount} lượt bình chọn
        </div>
        <InfiniteScroll
          className="flex flex-col gap-2"
          dataLength={users.length}
          next={handleFetchMoreUserVotes}
          hasMore={hasMore}
          loader={
            <div className="h-10 my-5 flex justify-center">
              <Spinner className="h-8 w-8"></Spinner>
            </div>
          }
          scrollableTarget="scrollableUserVotes">
          {users.map(({ user: { id, fullName, avatarUrl } }) => (
            <div key={id} className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <Avatar
                  placeholder={undefined}
                  src={avatarUrl}
                  alt="user-avatar"
                />
                <p className="text-base text-black font-semibold">{fullName}</p>
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </DialogBody>
    </Dialog>
  )
}

function VoteOption({ voteId, name }) {
  const [isDisabled, setIsDisabled] = useState(false) // Prevent multiple click

  const {
    allowMultipleVotes,
    totalVoteCount,
    selectedVoteIds,
    votesCount,
    handleVote,
    postId,
    handleOpenUserVotesDialog,
  } = useContext(PollContext)

  const commonProps = {
    name: `${postId}-${voteId}`,
    id: `${postId}-${voteId}`,
    className: 'h-6 w-6 border hover:before:opacity-0',
    containerProps: {
      className: 'p-0',
    },
    onClick: async () => {
      setIsDisabled(true)
      await handleVote(allowMultipleVotes, voteId)
      setIsDisabled(false)
    },
    onChange: () => {},
    checked: selectedVoteIds.has(voteId),
    disabled: isDisabled,
  }

  return (
    <div className="flex justify-between w-full gap-2 rounded-lg shadow relative">
      <label
        className="flex w-full gap-2 px-6 py-4 cursor-pointer"
        htmlFor={`${postId}-${voteId}`}>
        {checkPermission('Counsel.Vote') &&
          (allowMultipleVotes ? (
            <Checkbox color="blue" crossOrigin={undefined} {...commonProps} />
          ) : (
            <Radio color="blue" crossOrigin={undefined} {...commonProps} />
          ))}
        <span className="text-black">{name}</span>
      </label>
      <div
        onClick={() => {
          handleOpenUserVotesDialog(voteId, name, votesCount.get(voteId) || 0)
        }}
        className="flex justify-center items-center gap-1 pr-6 py-4 cursor-pointer">
        <span className="text-[var(--blue-02)]">
          {totalVoteCount
            ? Math.trunc((votesCount.get(voteId) / totalVoteCount) * 100)
            : votesCount.get(voteId)}
          %
        </span>
        <div>
          <FontAwesomeIcon
            icon={faAngleRight}
            className="text-black font-normal"
          />
        </div>
      </div>
    </div>
  )
}

function AddNewVoteOptionInput() {
  const { handleAddVoteOption } = useContext(PollContext)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data) => {
    handleAddVoteOption(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        size="lg"
        crossOrigin={undefined}
        label="Thêm lựa chọn..."
        type="text"
        disabled={!checkPermission('Counsel.Vote')}
        containerProps={{ className: 'h-[56px]' }}
        labelProps={{
          className:
            'top-0 focus-after:top-0 before:!mt-[0px] after:!mt-[0px] peer-focus:!leading-[0px]',
        }}
        {...register('name')}
      />
    </form>
  )
}

export default function Poll({
  allowMultipleVotes,
  allowAddOptions,
  votes: initialVotes,
  onVote,
  onChangeVote,
  onRemoveVote,
  onAddVoteOption,
  postId,
  onFetchUserVotes,
}) {
  const [votes, setVotes] = useState(initialVotes)
  const [totalVoteCount, setTotalVoteCount] = useState(() => {
    if (!initialVotes) return 0
    return initialVotes.reduce((acc, cur) => acc + cur.voteCount, 0)
  })
  const [votesCount, setVotesCount] = useState(() => {
    const map = new Map()
    if (!initialVotes) return map
    initialVotes.forEach(({ id: { voteId }, voteCount }) => {
      map.set(voteId, voteCount)
    })
    return map
  })
  const [selectedVoteIds, setSelectedVoteIds] = useState<Set<number>>(() => {
    const set = new Set<number>()
    initialVotes.forEach(({ isVoted, id: { voteId } }) => {
      if (isVoted) set.add(voteId)
    })
    return set
  })

  const [openUserVotesDialog, setOpenUserVotesDialog] = useState(false)
  const [currentDialogVoteId, setCurrentDialogVoteId] = useState(0)
  const [userVotes, setUserVotes] = useState([])
  const [currentDialogVoteCount, setCurrentDialogVoteCount] = useState(0)
  const [currentDialogVoteOptionName, setCurrentDialogVoteOptionName] =
    useState('')
  const dialogPage = useRef(0)
  const [dialogHasMore, setDialogHasMore] = useState(true)

  const handleOpenUserVotesDialog = async (
    voteId: number,
    voteOptionName: string,
    voteCount: number
  ) => {
    setOpenUserVotesDialog((prev) => !prev)

    if (!openUserVotesDialog && voteId != currentDialogVoteId) {
      setUserVotes([])
      setDialogHasMore(true)
      dialogPage.current = 0
      setCurrentDialogVoteId(voteId)
      setCurrentDialogVoteOptionName(voteOptionName)
      setCurrentDialogVoteCount(voteCount)

      try {
        const {
          data: { users },
        } = await onFetchUserVotes(postId, voteId)

        setDialogHasMore(users.length > 0)
        setUserVotes(users)
      } catch (error) {}
    }
  }

  const handleFetchMoreUserVotes = async () => {
    if (userVotes.length >= currentDialogVoteCount) {
      setDialogHasMore(false)
      return
    }
    dialogPage.current++
    try {
      const {
        data: { users },
      } = await onFetchUserVotes(
        postId,
        currentDialogVoteId,
        dialogPage.current
      )
      setUserVotes((prev) => prev.concat(users))
    } catch (error) {}
  }

  const handleVote = async (allowMultipleVotes: boolean, voteId: number) => {
    try {
      if (selectedVoteIds.has(voteId)) {
        // Delete
        selectedVoteIds.delete(voteId)
        setSelectedVoteIds(new Set(selectedVoteIds))

        await onRemoveVote(voteId)

        setTotalVoteCount((old) => old - 1)
        const temp = new Map(votesCount.set(voteId, votesCount.get(voteId) - 1))
        setVotesCount(temp)
      } else {
        if (allowMultipleVotes) {
          // Add vote
          selectedVoteIds.add(voteId)
          setSelectedVoteIds(new Set(selectedVoteIds))

          await onVote(voteId)

          setTotalVoteCount((old) => old + 1)
          const temp = new Map(
            votesCount.set(voteId, votesCount.get(voteId) + 1)
          )
          setVotesCount(temp)
        } else {
          if (selectedVoteIds.size) {
            // Update vote
            const oldVoteId = Array.from(selectedVoteIds)[0]
            selectedVoteIds.clear()
            selectedVoteIds.add(voteId)
            setSelectedVoteIds(new Set(selectedVoteIds))

            await onChangeVote(oldVoteId, voteId)

            votesCount.set(oldVoteId, votesCount.get(oldVoteId) - 1)
            votesCount.set(voteId, votesCount.get(voteId) + 1)
            const temp = new Map(votesCount)
            setVotesCount(temp)
          } else {
            // Add vote
            selectedVoteIds.add(voteId)
            setSelectedVoteIds(new Set(selectedVoteIds))

            await onVote(voteId)

            setTotalVoteCount((old) => old + 1)
            const temp = new Map(
              votesCount.set(voteId, votesCount.get(voteId) + 1)
            )
            setVotesCount(temp)
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }
  const handleAddVoteOption = async (data) => {
    try {
      const {
        data: { vote },
      } = await onAddVoteOption({ name: data.name })
      setVotes((old) => [...old, vote])

      votesCount.set(vote.id.voteId, 0)
      setVotesCount(new Map(votesCount))
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Lỗi không xác định')
    }
  }

  return (
    <PollContext.Provider
      value={{
        allowMultipleVotes,
        totalVoteCount,
        selectedVoteIds,
        votesCount,
        handleVote,
        handleAddVoteOption,
        postId,
        handleOpenUserVotesDialog,
        handleFetchMoreUserVotes,
      }}>
      <List
        placeholder={undefined}
        className="w-full flex flex-col bg-[#f8fafc] p-4 my-2 rounded-lg">
        {votes.map(({ name, id: { voteId } }) => (
          <div key={voteId} className="p-0 mb-2 border-2 rounded-lg relative">
            <div
              style={{
                transform: `scaleX(${
                  totalVoteCount ? votesCount.get(voteId) / totalVoteCount : 0
                })`,
              }}
              className={`bg-[var(--highlight-bg)] w-full h-full absolute top-0 bottom-0 left-0 transition-transform duration-300 origin-left`}></div>

            <VoteOption voteId={voteId} name={name} />
          </div>
        ))}
        {checkPermission('Counsel.Vote') &&
          allowAddOptions &&
          votes.length < 10 && <AddNewVoteOptionInput />}
      </List>
      <UserVotesDialog
        users={userVotes}
        voteOptionName={currentDialogVoteOptionName}
        voteCount={currentDialogVoteCount}
        openUserVotesDialog={openUserVotesDialog}
        hasMore={dialogHasMore}
      />
    </PollContext.Provider>
  )
}
