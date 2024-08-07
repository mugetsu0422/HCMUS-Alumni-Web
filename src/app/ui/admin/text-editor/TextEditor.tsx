'use client'

import React, { useEffect, useState } from 'react'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import { modules as basicModules, formats } from './EditorToolbar'
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
  const [modules, setmodules] = useState(basicModules)
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

  useEffect(() => {
    const loadQuill = async () => {
      return new Promise(async (resolve, reject) => {
        const Quill = await require('react-quill').Quill
        const BlotFormatter = await require('quill-blot-formatter').default
        const { ResizeAction, DeleteAction, ImageSpec } =
          await require('quill-blot-formatter')
        const ImageResize = await require('quill-image-resize-module-react')
          .default
        const ImageCompress = await require('quill-image-compress').default
        resolve({
          Quill,
          BlotFormatter,
          ImageResize,
          ResizeAction,
          DeleteAction,
          ImageSpec,
          ImageCompress,
        })
      })
        .then(
          ({
            Quill,
            BlotFormatter,
            ImageResize,
            ResizeAction,
            DeleteAction,
            ImageSpec,
            ImageCompress,
          }) => {
            class CustomImageSpec extends ImageSpec {
              getActions() {
                return [ResizeAction, DeleteAction]
              }
            }

            Quill.register('modules/blotFormatter', BlotFormatter)
            Quill.register('modules/imageResize', ImageResize)
            Quill.register('modules/imageCompress', ImageCompress)
            setmodules((modules) => ({
              ...modules,
              blotFormatter: {
                specs: [CustomImageSpec],
              },
              imageCompress: {
                quality: 0.85,
                maxWidth: 2000,
                maxHeight: 2000,
                imageType: 'image/jpeg',
                keepImageTypes: ['image/jpeg'],
                debug: false,
                suppressErrorLogging: false,
                insertIntoEditor: undefined,
              },
            }))
            return
          }
        )
        .then((value) => {
          setEnableEditor(true)
        })
    }
    loadQuill()
  }, [])

  return (
    <>
      <label className="text-xl font-bold">Nội dung</label>
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
            'h-[30rem] overflow-y-auto bg-white': !readOnly,
          })}
          readOnly={readOnly}
        />
      )}
    </>
  )
}
export default TextEditor
