import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { nunito } from '../../fonts'

export default function DeletePostDialog({
  postId,
  openDeletePostDialog,
  handleOpenDeletePostDialog,
  onDelete,
}) {
  return (
    <Dialog
      placeholder={undefined}
      size="xs"
      open={openDeletePostDialog}
      handler={handleOpenDeletePostDialog}>
      <DialogHeader placeholder={undefined}>Xóa bài viết</DialogHeader>
      <DialogBody placeholder={undefined}>Bạn có muốn xóa bài viết này?</DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
          placeholder={undefined}
          onClick={handleOpenDeletePostDialog}>
          <span>Không</span>
        </Button>
        <Button
          className={`${nunito.className} bg-[--delete] text-white normal-case text-md`}
          placeholder={undefined}
          onClick={() => {
            onDelete(postId)
            handleOpenDeletePostDialog()
          }}>
          <span>Xóa</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
