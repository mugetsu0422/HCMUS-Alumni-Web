import { Checkbox, Input, List, Radio } from '@material-tailwind/react'
import React, { createContext, useContext } from 'react'
import { useForm } from 'react-hook-form'

const PollContext = createContext(null)

function RadioOption({ voteId, name }) {
  const {
    allowMultipleVotes,
    totalVoteCount,
    selectedVoteIds,
    votesCount,
    handleVote,
    postId,
  } = useContext(PollContext)

  return (
    <label
      htmlFor={`${postId}-${voteId}`}
      className="flex justify-between w-full cursor-pointer px-6 py-4 gap-2 rounded-lg shadow relative">
      <div className="flex w-full gap-2">
        <Radio
          color="blue"
          crossOrigin={undefined}
          name={`${postId}-${voteId}`}
          id={`${postId}-${voteId}`}
          ripple={false}
          className="h-6 w-6 hover:before:opacity-0"
          containerProps={{
            className: 'p-0',
          }}
          onClick={() => handleVote(allowMultipleVotes, voteId)}
          onChange={() => {}}
          checked={selectedVoteIds.has(voteId)}
        />
        <span className="text-black">{name}</span>
      </div>
      <span className="text-[var(--blue-02)]">
        {totalVoteCount
          ? Math.trunc((votesCount.get(voteId) / totalVoteCount) * 100)
          : votesCount.get(voteId)}
        %
      </span>
    </label>
  )
}

function CheckBoxOption({ voteId, name }) {
  const {
    allowMultipleVotes,
    totalVoteCount,
    selectedVoteIds,
    votesCount,
    handleVote,
    postId,
  } = useContext(PollContext)

  return (
    <label
      htmlFor={`${postId}-${voteId}`}
      className="flex justify-between w-full cursor-pointer px-6 py-4 gap-2 rounded-lg shadow relative">
      <div className="flex w-full gap-2">
        <Checkbox
          color="blue"
          crossOrigin={undefined}
          name={`${postId}-${voteId}`}
          id={`${postId}-${voteId}`}
          ripple={false}
          className="h-6 w-6 hover:before:opacity-0"
          containerProps={{
            className: 'p-0',
          }}
          onClick={() => handleVote(allowMultipleVotes, voteId)}
          onChange={() => {}}
          checked={selectedVoteIds.has(voteId)}
        />
        <span className="text-black">{name}</span>
      </div>
      <span className="text-[var(--blue-02)]">
        {totalVoteCount
          ? Math.trunc((votesCount.get(voteId) / totalVoteCount) * 100)
          : votesCount.get(voteId)}
        %
      </span>
    </label>
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
            'top-0 before:mt-0 after:mt-0 focus-after:top-0 peer-focus:leading-[0]',
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
}) {
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

            {allowMultipleVotes ? (
              <CheckBoxOption voteId={voteId} name={name} />
            ) : (
              <RadioOption voteId={voteId} name={name} />
            )}
          </div>
        ))}
        {allowAddOptions && votes.length < 10 && <AddNewVoteOptionInput />}
      </List>
    </PollContext.Provider>
  )
}
