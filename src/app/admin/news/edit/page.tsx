'use client'

import React from 'react'
import { useAppSelector } from './../../../../lib/hook'

function Page() {
  const getNewsName = (state) => {
    const newsSlice = state.news
    if (newsSlice) {
      return newsSlice.name
    } else {
      return null // Or any default value you prefer
    }
  }

  const name = useAppSelector(getNewsName)

  return <div key={name}>{name}</div>
}

export default Page
