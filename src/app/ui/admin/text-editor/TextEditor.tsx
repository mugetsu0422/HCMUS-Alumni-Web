'use client'

import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import { modules, formats } from './EditorToolbar'
import dynamic from 'next/dynamic'
import clsx from 'clsx'

// Undo and redo functions for Custom Toolbar
function undoChange() {
  this.quill.history.undo()
}
function redoChange() {
  this.quill.history.redo()
}

function TextEditor({
  readOnly,
  content,
  setContent,
}: {
  readOnly: boolean
  content: string
  setContent: Function
}) {
  // Formats objects for setting up the Quill editor
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
          className={clsx({
            '': readOnly,
            'h-[30rem] overflow-y-auto': !readOnly,
          })}
          readOnly={readOnly}
        />
      }
    </>
  )
}
export default TextEditor
