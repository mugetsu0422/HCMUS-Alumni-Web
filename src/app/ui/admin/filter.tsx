'use client'

import React from 'react'
import { Input, Button, Radio } from '@material-tailwind/react'
import { CaretDownFill } from 'react-bootstrap-icons'

// const initialState = {
//   Time: {
//     option1: false,
//     option2: false,
//   },
//   MSSV: {
//     option1: false,
//     option2: false,
//   },
//   Fullname: {
//     option1: false,
//     option2: false,
//   },
//   YearBegin: {
//     option1: false,
//     option2: false,
//   },
// }

const filerBtn = [
  {
    criteria: 'time',
    name: 'Mới nhất',
    filter: [{ sub: 'Mới nhất' }, { sub: 'Cũ nhất' }],
  },
  {
    criteria: 'student-id',
    name: 'MSSV',
    filter: [{ sub: 'A tới Z' }, { sub: 'Z tới A' }],
  },
  {
    criteria: 'full-name',
    name: 'Họ tên',
    filter: [{ sub: 'A tới Z' }, { sub: 'Z tới A' }],
  },
  {
    criteria: 'beginning-year',
    name: 'Năm nhập học',
    filter: [{ sub: 'A tới Z' }, { sub: 'Z tới A' }],
  },
]

const IconAtoZ = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-sort-alpha-down"
      viewBox="0 0 16 16">
      <path
        fill-rule="evenodd"
        d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"
      />
      <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z" />
    </svg>
  )
}

const IconZtoA = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-sort-alpha-up-alt"
      viewBox="0 0 16 16">
      <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z" />
      <path
        fill-rule="evenodd"
        d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z"
      />
      <path d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707z" />
    </svg>
  )
}

export default function Filter() {
  const [message, setMessage] = React.useState('')
  // const [{ Time, MSSV, Fullname, YearBegin }, setIsChecked] =
  //   React.useState(initialState)

  //delete all selected radio options
  function handleClick() {
    {
      filerBtn.map(({ name }) => {
        let allRadioButtons = document.getElementsByName(`${name} type`)
        allRadioButtons.forEach((radioButton) => {
          if (radioButton instanceof HTMLInputElement) {
            radioButton.checked = false
          }
        })
      })
    }
  }

  // function handleFilter() {}

  return (
    <>
      <Input
        placeholder="Tìm kiếm theo email ..."
        crossOrigin={undefined}
        size="md"
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900 pr-20 w-full"
        labelProps={{
          className: 'before:content-none after:content-none',
        }}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            alert(message)
          }
        }}
        type="text"
      />
      <div className="flex mt-3 gap-2 flex-wrap">
        <Button
          onClick={handleClick}
          variant="outlined"
          placeholder={undefined}
          size="sm"
          className="h-fit">
          Xóa bộ lọc
        </Button>
        {filerBtn.map(({ criteria, name, filter }) => (
          <div key={name} className="flex-col group">
            <Button
              variant="outlined"
              placeholder={undefined}
              size="sm"
              className="flex gap-2 -mb-1"
              key={name}>
              {name}
              <CaretDownFill className="group-hover:rotate-180 " />
            </Button>
            <div className="w-[fit] p-5  group-hover:flex gap-2 flex-col bg-white rounded-xl font-medium translate-y-1 border-2 border-[var(--secondary)] absolute z-10">
              {filter.map(({ sub }, idx) => (
                <div key={idx} className="flex items-center">
                  <Radio
                    name={`${name} type`}
                    color="blue"
                    crossOrigin={undefined}
                    key={idx}
                    label={sub}
                    containerProps={{
                      className: 'p-0 m-3 ml-0',
                    }}
                    id={criteria + idx}
                  />
                  {sub === 'Mới nhất' || sub === 'A tới Z' ? (
                    <IconAtoZ />
                  ) : (
                    <IconZtoA />
                  )}
                </div>
              ))}
              {name === 'Mới nhất' ? (
                ''
              ) : (
                <Input
                  crossOrigin={undefined}
                  className=""
                  placeholder={name}
                />
              )}
              <Button placeholder={undefined}>Lọc</Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
