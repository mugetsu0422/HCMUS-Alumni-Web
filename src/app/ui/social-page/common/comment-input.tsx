import React from 'react'
import checkPermission from '../../common/checking-permission'
import { Button, Textarea } from '@material-tailwind/react'
import { nunito } from '../../fonts'
import useAuth from '@/hooks/use-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Use for news, events
export default function CommentInput({
  requiredPermission,
  uploadComment,
  handleUploadCommentChange,
  onHandleUploadComment,
}) {
  const { isLoggedIn, userId } = useAuth()
  const router = useRouter()

  if (!isLoggedIn)
    return (
      <div className="flex justify-center items-center">
        <Button
          onClick={() => router.push('/signin')}
          placeholder={undefined}
          size="md"
          className={`py-2 px-6 bg-[#e6e6e6] text-[#4b4f56] normal-case text-md`}>
          {'Đăng nhập để bình luận'}
        </Button>
      </div>
    )
  return (
    <>
      {checkPermission(requiredPermission) ? (
        <form onSubmit={(e) => onHandleUploadComment(e, null, uploadComment)}>
          <Textarea
            value={uploadComment}
            onChange={handleUploadCommentChange}
            placeholder={undefined}
            label="Chia sẻ ý kiến của bạn"
          />
          <div className="flex justify-end gap-x-4 pt-2 mr-2">
            <Button
              placeholder={undefined}
              size="md"
              disabled={!uploadComment.trim()}
              type="submit"
              className={`${nunito.className} py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
              Đăng
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex justify-center items-center">
          <Button
            onClick={() => router.push(`/profile/${userId}`)}
            placeholder={undefined}
            size="md"
            className={`py-2 px-6 bg-[#e4e6eb] text-[#4b4f56] normal-case text-md`}>
            {'Xét duyệt để bình luận'}
          </Button>
        </div>
      )}
    </>
  )
}
