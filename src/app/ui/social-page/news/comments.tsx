'use client'

import React, {
  FormEventHandler,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react'
import { Avatar, Button, Spinner, Textarea } from '@material-tailwind/react'
import { nunito } from '../../fonts'
import { Chat } from 'react-bootstrap-icons'
import moment from 'moment'
import clsx from 'clsx'
import 'moment/locale/vi'
import { CHILDREN_COMMENTS_PAGE_SIZE } from '../../../constant'

const CommentsConxtext = createContext<CommentsContextProps>(null)

interface Comment {
  id: string
  creator: {
    id: string
    avatarUrl: string
    fullName: string
  }
  content: string
  childrenCommentNumber: number
  createAt: string
  updateAt: string
}
type UploadCommentHandler = (
  e: React.FormEvent<HTMLFormElement>,
  parentId: string | null,
  content: string
) => any
type FetchChildrenCommentsHandler = (
  parentId: string,
  page: number,
  pageSize: number
) => any

interface CommentsContextProps {
  onUploadComment: UploadCommentHandler
  onFetchChildrenComments: FetchChildrenCommentsHandler
}

interface ChildrenCommentsProps {
  comment: Comment
}

interface CommentListItemProps {
  comment: Comment
  depth: number
}

interface CommentsProps {
  comments: Comment[]
  onUploadComment: UploadCommentHandler
  onFetchChildrenComments: FetchChildrenCommentsHandler
}

function ChildrenComments({ comment }: ChildrenCommentsProps) {
  const [isOpenInputComments, setIsOpenInputComments] = useState(false)
  const [comments, setComments] = useState('')

  // Function to handle changes in the textarea
  const handleCommentChange = (event) => {
    setComments(event.target.value)
  }

  return (
    <div
      className={`${nunito.className} flex flex-col border-l-2 border-[#e5e5e5] sm:pl-8 lg:pl-10 py-2`}>
      <div className="flex items-center gap-3">
        <Avatar
          size="sm"
          src={comment?.creator.avatarUrl}
          alt="avatar user"
          placeholder={undefined}
        />
        <p>{comment?.creator.fullName}</p>
      </div>
      <p className="sm:pl-8 lg:pl-12 whitespace-pre-line">{comment?.content}</p>
      <Button
        onClick={() => setIsOpenInputComments((e) => !e)}
        placeholder={undefined}
        variant="text"
        className="py-2 px-2 gap-2 w-fit flex items-center normal-case ml-[40px] my-2">
        <Chat className="font-bold text-lg" /> Bình luận
      </Button>

      {isOpenInputComments && (
        <>
          <Textarea
            placeholder="Bình luận"
            resize={true}
            onChange={handleCommentChange}
            className="sm:ml-8 lg:ml-12 h-[30px] w-[93%] bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className:
                'w-[93%] before:content-none after:content-none sm:ml-8 lg:ml-12 w-fit',
            }}
          />
          <div className="flex justify-end gap-x-4 pt-2 mr-2">
            <Button
              placeholder={undefined}
              size="md"
              disabled={!comments.trim()}
              type="submit"
              className={`${nunito.className} py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
              Đăng
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function CommentsListItem({ comment, depth }: CommentListItemProps) {
  const [isOpenComments, setIsOpenComments] = useState(false)
  const [isOpenInputComments, setIsOpenInputComments] = useState(false)
  const [uploadComment, setUploadComment] = useState('')
  const [childrenComments, setChildrenComments] = useState([])
  const childrenCommentPage = useRef(0)
  const [isLoading, setIsLoading] = useState(false)
  const { onUploadComment, onFetchChildrenComments } =
    useContext(CommentsConxtext)

  // Function to handle changes in the textarea
  const handleUploadCommentChange = (event) => {
    setUploadComment(event.target.value)
  }
  const onShowChildrenComments = async (page: number, pageSize: number) => {
    setIsLoading(true)

    const fetchedChildrenComments = await onFetchChildrenComments(
      comment.id,
      page,
      pageSize
    )

    setIsLoading(false)
    setChildrenComments(childrenComments.concat(fetchedChildrenComments))
    setIsOpenComments((e) => !e)
  }
  const onShowMoreChildrenComments = async (page: number, pageSize: number) => {
    setIsLoading(true)

    const fetchedChildrenComments = await onFetchChildrenComments(
      comment.id,
      page,
      pageSize
    )

    setIsLoading(false)
    setChildrenComments(childrenComments.concat(fetchedChildrenComments))
  }

  return (
    <div>
      <div
        className={clsx(
          {
            'flex flex-col': true,
            'border-l-2 border-[#e5e5e5] pl-4 py-2': depth > 0,
          },
          nunito.className
        )}>
        <div className="flex gap-4">
          <Avatar
            src={comment.creator.avatarUrl}
            alt="avatar user"
            placeholder={undefined}
          />
          <div className="w-full">
            <p className="text-lg font-bold text-black">
              {comment.creator.fullName}
            </p>
            <p className="text-[var(--secondary)]">
              {moment(comment.createAt).locale('vi').local().fromNow()}
            </p>
            <p className="text-black font-normal whitespace-pre-line">
              {comment.content}
            </p>
            <Button
              onClick={() => setIsOpenInputComments((e) => !e)}
              placeholder={undefined}
              variant="text"
              className="py-2 px-0 gap-2 w-fit flex items-center normal-case">
              <Chat className="font-bold text-lg" /> Bình luận
            </Button>
            {isOpenInputComments && (
              <form
                onSubmit={(e) => onUploadComment(e, comment.id, uploadComment)}>
                <Textarea
                  placeholder="Bình luận"
                  resize={true}
                  onChange={handleUploadCommentChange}
                  className="mt-2 h-[100px] w-[93%] bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className:
                      'w-[93%] before:content-none after:content-none w-fit',
                  }}
                />
                <div className="flex justify-end gap-x-4 pt-2 mr-2">
                  <Button
                    placeholder={undefined}
                    size="md"
                    type="submit"
                    disabled={!uploadComment.trim()}
                    className={`${nunito.className} py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
                    Đăng
                  </Button>
                </div>
              </form>
            )}
            {comment.childrenCommentNumber > 0 && !isOpenComments && (
              <div
                onClick={() =>
                  onShowChildrenComments(0, CHILDREN_COMMENTS_PAGE_SIZE)
                }
                className="w-fit flex gap-2 text-[--secondary] hover:underline hover:cursor-pointer">
                Xem {comment.childrenCommentNumber} phản hồi
                {isLoading && <Spinner className="w-4" />}
              </div>
            )}
          </div>
        </div>
        <div className="relative flex flex-col pl-16 h-fit overflow-y-auto scrollbar-webkit-main">
          {childrenComments.map((comment) => {
            return (
              <CommentsListItem
                key={comment.id}
                comment={comment}
                depth={depth + 1}
              />
            )
          })}
          {isOpenComments &&
            childrenComments.length != comment.childrenCommentNumber && (
              <div
                onClick={() =>
                  onShowMoreChildrenComments(
                    ++childrenCommentPage.current,
                    CHILDREN_COMMENTS_PAGE_SIZE
                  )
                }
                className="group w-full flex gap-2 text-[--secondary] justify-between">
                <span className="group-hover:underline group-hover:cursor-pointer flex gap-3">
                  Xem thêm phản hồi
                  {isLoading && <Spinner className="w-4" />}
                </span>
                <span>
                  {childrenComments.length}/{comment.childrenCommentNumber}
                </span>
              </div>
            )}
        </div>
      </div>
      {/* {isOpenInputComments && depth >= 2 && (
        <form onSubmit={(e) => onUploadComment(e, comment.id, uploadComment)}>
          <Textarea
            placeholder="Bình luận"
            resize={true}
            onChange={handleUploadCommentChange}
            className="mt-2 h-[100px] w-[93%] bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: 'w-[93%] before:content-none after:content-none w-fit',
            }}
          />

          <div className="flex justify-end gap-x-4 pt-2 mr-2">
            <Button
              placeholder={undefined}
              size="md"
              type="submit"
              disabled={!uploadComment.trim()}
              className={`${nunito.className} py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
              Đăng
            </Button>
          </div>
        </form>
      )} */}
    </div>
  )
}

export default function Comments({
  comments,
  onUploadComment,
  onFetchChildrenComments,
}: CommentsProps) {
  return (
    <div className="flex flex-col lg:py-8 gap-4 h-fit overflow-y-auto scrollbar-webkit-main">
      <CommentsConxtext.Provider
        value={{
          onUploadComment,
          onFetchChildrenComments,
        }}>
        {comments.map((comment) => (
          <CommentsListItem key={comment.id} comment={comment} depth={0} />
        ))}
      </CommentsConxtext.Provider>
    </div>
  )
}
