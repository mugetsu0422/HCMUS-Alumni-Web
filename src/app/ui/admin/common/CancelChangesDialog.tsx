import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react'
import { useRouter } from 'next/navigation'
import { nunito } from '../../fonts'

export default function CancelChangesDialog({ open, handleOpen, backUrl }) {
  const router = useRouter()

  return (
    <Dialog placeholder={undefined} size="xs" open={open} handler={handleOpen}>
      <DialogHeader placeholder={undefined}>Huỷ</DialogHeader>
      <DialogBody placeholder={undefined}>
        Bạn có muốn huỷ các thay đổi?
      </DialogBody>
      <DialogFooter placeholder={undefined}>
        <Button
          className={`${nunito.className} mr-4 bg-[--delete-filter] text-black normal-case text-md`}
          placeholder={undefined}
          onClick={handleOpen}>
          <span>Không</span>
        </Button>
        <Button
          className={`${nunito.className} bg-[--delete] text-white normal-case text-md`}
          placeholder={undefined}
          onClick={() => {
            router.push(backUrl)
          }}>
          <span>Hủy</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
