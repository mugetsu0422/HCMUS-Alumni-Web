'use client'

import React from 'react'
import Sidebar from '../../ui/social-page/sidebar'
import { Button } from '@material-tailwind/react'
const userTemp = []

export default function Page() {
  return (
    <div>
      <Sidebar>
        <div>
          <p>Nhắn tin</p>
          <Button placeholder={undefined} variant="text">
            {' '}
            Tất cả{' '}
          </Button>
        </div>
      </Sidebar>
      Page
    </div>
  )
}
