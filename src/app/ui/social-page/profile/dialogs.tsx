'use client'
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react'

export function ConfirmChangeAvatarDialog({
  openConfirmDialog,
  handleOpenConfirmDialog,
  handleCrop,
}) {
  return (
    <Dialog
      placeholder={undefined}
      open={openConfirmDialog}
      handler={handleOpenConfirmDialog}
      size="xs">
      <DialogHeader
        tabIndex={0}
        className="border-b-2 border-gray-300 justify-center"
        placeholder={undefined}>
        Xác nhận thay đổi ảnh
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        <p>Bạn có chắc chắn thay đổi ảnh đại diện</p>
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          placeholder={undefined}
          onClick={handleOpenConfirmDialog}
          className="mr-1 bg-[--delete-filter] text-black">
          Hủy
        </Button>
        <Button
          placeholder={undefined}
          color="red"
          className="mr-1 bg-[--blue-05] "
          onClick={() => {
            handleOpenConfirmDialog()
            handleCrop()
          }}>
          Xác nhận
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export function ConfirmChangeCoverDialog({
  openConfirmDialog,
  handleOpenConfirmDialog,
  handleCrop,
}) {
  return (
    <Dialog
      placeholder={undefined}
      open={openConfirmDialog}
      handler={handleOpenConfirmDialog}
      size="xs">
      <DialogHeader
        tabIndex={0}
        className="border-b-2 border-gray-300 justify-center"
        placeholder={undefined}>
        Xác nhận thay đổi ảnh
      </DialogHeader>
      <DialogBody placeholder={undefined}>
        <p>Bạn có chắc chắn thay đổi ảnh bìa</p>
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          placeholder={undefined}
          onClick={handleOpenConfirmDialog}
          className="mr-1 bg-[--delete-filter] text-black">
          Hủy
        </Button>
        <Button
          placeholder={undefined}
          color="red"
          className="mr-1 bg-[--blue-05] "
          onClick={() => {
            handleOpenConfirmDialog()
            handleCrop()
          }}>
          Xác nhận
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
