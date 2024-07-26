'use client'

import React from 'react'
import { Button } from '@material-tailwind/react'

import { ArrowRight, ArrowLeft } from 'react-bootstrap-icons'

interface PaginationProps {
  totalPages: number
  curPage: number
  onNextPage: () => void
  onPrevPage: () => void
}

export default function Pagination({
  totalPages,
  curPage,
  onNextPage,
  onPrevPage,
}: PaginationProps) {
  return totalPages ? (
    <div className="flex items-center gap-4 justify-center mb-6">
      <Button
        placeholder={undefined}
        variant="text"
        className="flex items-center gap-2 font-bold normal-case text-base"
        onClick={onPrevPage}
        disabled={curPage <= 1}>
        <ArrowLeft className="text-2xl text-[var(--blue-02)]" />
      </Button>
      <p className="w-20 text-center font-bold text-[var(--blue-02)]">
        {curPage} / {totalPages}
      </p>
      <Button
        placeholder={undefined}
        variant="text"
        className="flex items-center gap-2 font-bold normal-case text-base"
        onClick={onNextPage}
        disabled={curPage >= totalPages}>
        <ArrowRight
          strokeWidth={2}
          className="text-2xl text-[var(--blue-02)]"
        />
      </Button>
    </div>
  ) : null
}
