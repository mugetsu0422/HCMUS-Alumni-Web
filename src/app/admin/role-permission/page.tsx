'use client'

import React, { useState } from 'react'
import { CaretDownFill, XLg, CheckLg } from 'react-bootstrap-icons'
import { nunito } from '../../ui/fonts'
import { Input } from '@material-tailwind/react'

export default function Page() {
  const roles = [
    'Admin',
    'Cựu sinh viên',
    'Khách vãng lai',
    'Quản lý Khoa',
    'Giảng viên',
  ]
  const mainCategories = [
    {
      name: 'Quản lý người dùng',
      subCategories: ['Sub 1', 'Sub 2'],
    },
    {
      name: 'Quản lý tin tức',
      subCategories: ['Sub 3', 'Sub 4'],
    },
    {
      name: 'Quản lý sự kiện',
      subCategories: ['Sub 5', 'Sub 6'],
    },
    {
      name: 'Quản lý Gương thành công',
      subCategories: ['Sub 7', 'Sub 8'],
    },
    {
      name: 'Quản lý Tư vấn/Cố vấn',
      subCategories: ['Sub 9', 'Sub 10'],
    },
    {
      name: 'Quản lý Nhóm',
      subCategories: ['Sub 11', 'Sub 12'],
    },
  ]

  const [data, setData] = useState(
    mainCategories.reduce((acc, mainCategory, mainIndex) => {
      acc[mainIndex] = {
        visible: false,
        subCategories: mainCategory.subCategories.map(() =>
          Array(roles.length).fill(false)
        ),
      }
      return acc
    }, {})
  )

  const toggleCheckbox = (mainIndex, subIndex, colIndex) => {
    const newData = { ...data }
    newData[mainIndex].subCategories[subIndex][colIndex] =
      !newData[mainIndex].subCategories[subIndex][colIndex]
    setData(newData)
  }

  const toggleVisibility = (mainIndex) => {
    const newData = { ...data }
    newData[mainIndex].visible = !newData[mainIndex].visible
    setData(newData)
  }

  const getSelectedValues = () => {
    const selectedValues = []
    mainCategories.forEach((mainCategory, mainIndex) => {
      mainCategory.subCategories.forEach((subCategory, subIndex) => {
        roles.forEach((role, colIndex) => {
          if (data[mainIndex].subCategories[subIndex][colIndex]) {
            selectedValues.push({
              mainCategory: mainCategory.name,
              subCategory,
              role,
            })
          }
        })
      })
    })
    console.log(selectedValues)
    // Do whatever you want with the selected values here
  }

  return (
    <div className={`${nunito.className} container mx-auto p-4`}>
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2 w-40 bg-[--blue-02] text-white">
              Quyền
            </th>
            {roles.map((role, index) => (
              <th
                key={index}
                className="border border-gray-400 p-2 w-40 bg-[--blue-02] text-white">
                {role}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mainCategories.map((mainCategory, mainIndex) => (
            <React.Fragment key={mainIndex}>
              <tr
                onClick={() => toggleVisibility(mainIndex)}
                className="cursor-pointer w-full">
                <td
                  className="border border-gray-400 p-2 relative bg-[--blue-04] font-bold"
                  colSpan={roles.length + 1}>
                  <p className="flex items-center gap-1">
                    {mainCategory.name}
                    <CaretDownFill
                      className={data[mainIndex].visible ? '' : ' rotate-180'}
                    />
                  </p>
                </td>
              </tr>
              {data[mainIndex].visible &&
                mainCategory.subCategories.map((subCategory, subIndex) => (
                  <tr key={subIndex} className="text-base">
                    <td className="border font-semibold border-gray-400 p-2 pl-6 w-40 ">
                      {subCategory}
                    </td>
                    {roles.map((_, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-gray-400 p-2 text-center w-40  ">
                        <label
                          onChange={() =>
                            toggleCheckbox(mainIndex, subIndex, colIndex)
                          }
                          className="flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              data[mainIndex].subCategories[subIndex][colIndex]
                            }
                            // onChange={() =>
                            //   toggleCheckbox(mainIndex, subIndex, colIndex)
                            // }
                            className="hidden"
                          />
                          <div
                            className={`w-6 h-6 border-2 rounded bg-white border-gray-400 flex items-center justify-center`}
                            // onClick={() =>
                            //   toggleCheckbox(mainIndex, subIndex, colIndex)
                            // }
                          >
                            {!data[mainIndex].subCategories[subIndex][
                              colIndex
                            ] ? (
                              <XLg className="text-[#ee1b24] text-xl" />
                            ) : (
                              <CheckLg className="text-[#03a751] text-xl" />
                            )}
                          </div>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <button
        onClick={getSelectedValues}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Get Selected Values
      </button>
    </div>
  )
}
