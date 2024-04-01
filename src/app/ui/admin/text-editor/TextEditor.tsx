'use client'

import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import { Input, Button } from '@material-tailwind/react'
import { nunito } from '../../fonts'
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
  const [enableEditor, setEnableEditor] = useState(false)
  const [modules, setmodules] = useState({})
  // Formats objects for setting up the Quill editor
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'align',
    'strike',
    'script',
    'blockquote',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'code-block',
  ]
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

  useEffect(() => {
    const loadQuill = async () => {
      return new Promise(async (resolve, reject) => {
        const Quill = await require('react-quill').Quill
        const ImageResize = await require('quill-image-resize-module-react')
          .default
        resolve({ Quill, ImageResize })
      })
        .then(({ Quill, ImageResize}) => {
          // Quill.register('modules/imageResize', ImageResize)
          setmodules({
            toolbar: {
              container: '#t1',
              handlers: {
                undo: undoChange,
                redo: redoChange,
              },
            },
            clipboard: {
              matchVisual: false,
            },
            history: {
              delay: 500,
              maxStack: 10,
              userOnly: true,
            },
            // imageResize: {
            //   parchment: Quill.import('parchment'),
            //   modules: ['Resize', 'DisplaySize', 'Toolbar'],
            // },
          })
          return
        })
        .then((value) => {
          setEnableEditor(true)
        })
    }
    loadQuill()
  }, [])

  const onContentChange = (value) => {
    setContent(value)
  }

  return (
    <>
      <label className="text-xl font-bold">Bài đăng</label>
      <EditorToolbar toolbarId={'t1'} />
      {enableEditor && (
        <ReactQuill
          theme={readOnly ? 'bubble' : 'snow'}
          value={content}
          onChange={onContentChange}
          placeholder={'Hãy nhập nội dung...'}
          modules={modules}
          formats={formats}
          className={clsx({
            '': readOnly,
            'h-96 overflow-y-auto': !readOnly
          })}
          readOnly={readOnly}
        />
      )}
    </>
  )
}
export default TextEditor
