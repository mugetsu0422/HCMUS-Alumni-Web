'use client'

import React from 'react'
import { useAppSelector } from './../../../../lib/hook'

function Page() {
  const name = useAppSelector((store) => store.news.name)

  return <div key={name}>{name}</div>
}

export default Page
