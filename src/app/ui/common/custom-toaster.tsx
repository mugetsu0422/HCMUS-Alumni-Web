import React from 'react'
import { Toaster } from 'react-hot-toast'

export default function CustomToaster() {
  return (
    <Toaster
      containerStyle={{ zIndex: 99999 }}
      toastOptions={{
        success: {
          style: {
            background: 'var(--toast-success)',
            color: 'white',
          },
        },
        error: {
          style: {
            background: 'var(--toast-error)',
            color: 'white',
          },
        },
      }}
    />
  )
}
