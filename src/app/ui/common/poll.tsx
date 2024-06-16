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
import React, { createContext, useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { XLg, HandThumbsUpFill } from 'react-bootstrap-icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import { nunito } from '../fonts'

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
          {Math.trunc((voteCount / totalVoteCount) * 100)}% · {voteCount} lượt
          bình chọn
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
    className: 'h-6 w-6 hover:before:opacity-0',
    containerProps: {
      className: 'p-0',
    },
    onClick: () => handleVote(allowMultipleVotes, voteId),
    onChange: () => {},
    checked: selectedVoteIds.has(voteId),
  }

  return (
    <div className="flex justify-between w-full gap-2 rounded-lg shadow relative">
      <label
        className="flex w-full gap-2 px-6 py-4 cursor-pointer"
        htmlFor={`${postId}-${voteId}`}>
        {allowMultipleVotes ? (
          <Checkbox color="blue" crossOrigin={undefined} {...commonProps} />
        ) : (
          <Radio color="blue" crossOrigin={undefined} {...commonProps} />
        )}
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
  const { onAddVoteOption } = useContext(PollContext)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data) => {
    onAddVoteOption(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        size="lg"
        crossOrigin={undefined}
        label="Thêm lựa chọn..."
        type="text"
        containerProps={{ className: 'h-[56px]' }}
        labelProps={{
          className:
            'top-0 before:mt-[0px] after:mt-[0px] focus-after:top-0 peer-focus:leading-[0px]',
        }}
        {...register('name')}
      />
    </form>
  )
}

export default function Poll({
  allowMultipleVotes,
  allowAddOptions,
  votes,
  totalVoteCount,
  selectedVoteIds,
  votesCount,
  handleVote,
  onAddVoteOption,
  postId,
  onFetchUserVotes,
}) {
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
    if (!openUserVotesDialog && voteId != currentDialogVoteId) {
      try {
        const {
          data: { users },
        } = await onFetchUserVotes(postId, voteId)
        setDialogHasMore(users.length > 0)
        setUserVotes(users)
      } catch (error) {}

      dialogPage.current = 0
      setCurrentDialogVoteId(voteId)
      setCurrentDialogVoteOptionName(voteOptionName)
      setCurrentDialogVoteCount(voteCount)
    }

    setOpenUserVotesDialog((prev) => !prev)
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

  return (
    <PollContext.Provider
      value={{
        allowMultipleVotes,
        totalVoteCount,
        selectedVoteIds,
        votesCount,
        handleVote,
        onAddVoteOption,
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
        {allowAddOptions && votes.length < 10 && <AddNewVoteOptionInput />}
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
