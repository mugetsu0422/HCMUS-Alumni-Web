import { handler } from '@material-tailwind/react/types/components/dialog'
import {
  Input,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react'
import { nunito } from '../fonts'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function DateTimeLocalPickerDialog({
  open,
  handleOpen,
  onChange,
  onSubmit,
}: {
  open: boolean
  handleOpen: handler
  onChange: (props: object) => void
  onSubmit
}) {
  const hours = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ]
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const todayString = today.toISOString().split('T')[0]
  const tomorrowString = tomorrow.toISOString().split('T')[0]
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: tomorrowString,
      time: hours[0],
    },
  })

  useEffect(() => {
    onChange({
      date: tomorrowString,
      time: hours[0],
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog
      placeholder={undefined}
      open={open}
      handler={handleOpen}
      size={'sm'}>
      <DialogHeader
        tabIndex={0}
        className="border-b-2 border-gray-300 justify-center"
        placeholder={undefined}>
        Lên lịch đăng bài
      </DialogHeader>
      <DialogBody placeholder={undefined} className="flex flex-col">
        <label className="text-xl font-bold text-black" htmlFor="date">
          Ngày
        </label>
        <input
          className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
          id="date"
          type="date"
          min={todayString}
          defaultValue={tomorrowString}
          onFocus={(e) => e.target.showPicker()}
          onChange={(e) => onChange({date: e.target.value})}
          // {...register('date', {})}
        />
        <label className="text-xl font-bold text-black" htmlFor="time">
          Giờ
        </label>
        <select
          name="time"
          id="time"
          className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
          onChange={(e) => onChange({ time: e.target.value })}
          // {...register('time', {})}
        >
          {hours.map((val) => {
            return (
              <option key={val} value={val}>
                {val}
              </option>
            )
          })}
        </select>
      </DialogBody>
      <DialogFooter
        className="border-t-2 border-gray-300"
        placeholder={undefined}>
        <div className="font-semibold flex gap-4">
          <Button
            onClick={handleOpen}
            placeholder={undefined}
            size="lg"
            className={`${nunito.className} bg-[var(--secondary)] text-black normal-case text-md`}>
            Hủy
          </Button>
          <Button
            onClick={onSubmit}
            placeholder={undefined}
            size="lg"
            className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
            Lên lịch
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  )
}
