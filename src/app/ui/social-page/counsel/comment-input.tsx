import { Button } from '@material-tailwind/react'
import React from 'react'
import { SendFill } from 'react-bootstrap-icons'
import ReactTextareaAutosize from 'react-textarea-autosize'
import AvatarUser from '../../common/avatar-user'
import checkPermission from '../../common/checking-permission'
import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/use-auth'

export default function CommentInput({
  requiredPermission,
  uploadComment,
  handleUploadCommentChange,
  onHandleUploadComment,
}) {
  const { userId } = useAuth()
  const router = useRouter()

  return (
    <>
      {checkPermission(requiredPermission) ? (
        <form
          className="h-full flex flex-start items-start w-full gap-2"
          onSubmit={(e) => onHandleUploadComment(e, null, uploadComment)}>
          <AvatarUser />
          <ReactTextareaAutosize
            spellCheck="false"
            minRows={1}
            maxRows={8}
            placeholder="Bình luận của bạn"
            className="focus:border-transparent w-full bg-[var(--comment-input)] scrollbar-webkit-main resize-none p-2 px-3 rounded-xl outline-none text-black"
            value={uploadComment}
            onChange={handleUploadCommentChange}
          />
          <Button
            disabled={!uploadComment.trim()}
            type="submit"
            placeholder={undefined}
            variant="text"
            className="p-2">
            <SendFill className="text-xl" />
          </Button>
        </form>
      ) : (
        <div className="flex justify-center items-center">
          <Button
            onClick={() => router.push(`/profile/${userId}`)}
            placeholder={undefined}
            size="md"
            className={`py-2 px-6 bg-[#e4e6eb] text-[#4b4f56] normal-case text-md`}>
            {'Xét duyệt để thích và bình luận'}
          </Button>
        </div>
      )}
    </>
  )
}
