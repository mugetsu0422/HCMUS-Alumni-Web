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
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
  ]
  const mins = ['00', '15', '30', '45']

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
      hour: hours[0],
      minute: mins[0],
    },
  })

  useEffect(() => {
    onChange({
      date: tomorrowString,
      hour: hours[0],
      minute: mins[0],
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
      <DialogBody placeholder={undefined} className="flex flex-col gap-4">
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
          onChange={(e) => onChange({ date: e.target.value })}
          // {...register('date', {})}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xl font-bold text-black"> Thời gian</label>
          <div className="flex gap-1 items-center">
            <select
              name="hour"
              id="hour"
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              onChange={(e) => onChange({ hour: e.target.value })}
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
            <p className="text-xl font-bold">:</p>
            <select
              name="minute"
              id="minute"
              className="w-fit my-3 text-blue-gray-700 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border focus:border-2 px-3 py-3 rounded-md border-blue-gray-200 focus:border-gray-900"
              onChange={(e) => onChange({ minute: e.target.value })}
              // {...register('time', {})}
            >
              {mins.map((val) => {
                return (
                  <option key={val} value={val}>
                    {val}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
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
