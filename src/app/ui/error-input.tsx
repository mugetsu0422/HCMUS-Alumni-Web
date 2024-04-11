'use client'
import React from 'react'

export default function ErrorInput({ errors }) {
  return (
    <>
      {errors && (
        <div className="text-red-600 font-semibold">
          <> {errors}</>
        </div>
      )}
    </>
  )
}
