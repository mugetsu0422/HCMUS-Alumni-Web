'use client'

import React, { useState } from 'react'
import { modules, formats } from './EditorToolbar'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import { Input, Button } from '@material-tailwind/react'
import { nunito } from '../../fonts'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

function TextEditor({
  readOnly,
  content,
  setContent,
}: {
  readOnly: boolean
  content: string,
  setContent: Function
}) {
  const ReactQuill = React.useMemo(
    () =>
      dynamic(() => import('react-quill'), {
        ssr: false,
        loading: () => <p>Loading ...</p>,
      }),

    []
  )
  const EditorToolbar = React.useMemo(
    () =>
      dynamic(() => import('./EditorToolbar'), {
        ssr: false,
        loading: () => <p>Loading ...</p>,
      }),
    []
  )

  const onContentChange = (value) => {
    setContent(value)
  }

  return (
    <>
      <label className="text-xl font-bold">Bài đăng</label>
      <EditorToolbar toolbarId={'t1'} />
      {
        <ReactQuill
          theme={readOnly ? 'bubble' : 'snow'}
          value={content}
          onChange={onContentChange}
          placeholder={'Hãy nhập nội dung...'}
          modules={modules('t1')}
          formats={formats}
          className={'h-96 overflow-y-auto'}
          readOnly={readOnly}
        />
      }
    </>
  )
}
export default TextEditor
