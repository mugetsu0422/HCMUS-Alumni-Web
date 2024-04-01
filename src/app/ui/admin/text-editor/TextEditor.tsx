'use client'

import React from 'react'
import { modules, formats } from './EditorToolbar'
import 'react-quill/dist/quill.snow.css'
import { Input, Button } from '@material-tailwind/react'
import { nunito } from '../../fonts'
import dynamic from 'next/dynamic'

function TextEditor() {
  const [userInfo, setuserInfo] = React.useState({
    title: '',
    description: '',
    //information: '',
  })
  const onChangeValue = (e) => {
    setuserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    })
  }

  function isBrowser() {
    return typeof window !== 'undefined'
  }

  const onDescription = (value) => {
    setuserInfo({ ...userInfo, description: value })
  }
  // const oninformation = (value) => {
  //   setuserInfo({ ...userInfo, information: value });
  // };
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

  return (
    <>
      <form className="px-8 py-10 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold">Tiêu đề</label>
            <Input
              size="lg"
              crossOrigin={undefined}
              variant="outlined"
              type="text"
              name="title"
              value={userInfo.title}
              onChange={onChangeValue}
              label="Nội dung tiêu đề"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-bold">Bài đăng</label>
            <EditorToolbar toolbarId={'t1'} />
            {
              <ReactQuill
                theme="snow"
                value={userInfo.description}
                onChange={onDescription}
                placeholder={'Hãy nhập nội dung...'}
                modules={modules('t1')}
                formats={formats}
                className="h-96 overflow-y-auto text-base"
              />
            }
          </div>

          <div className="flex justify-end gap-x-4  ">
            <Button
              placeholder={undefined}
              size="lg"
              type="submit"
              className={`${nunito.className} bg-[var(--secondary)] text-black normal-case text-md`}>
              Hủy
            </Button>
            <Button
              placeholder={undefined}
              size="lg"
              type="submit"
              className={`${nunito.className} bg-[var(--blue-05)] normal-case text-md`}>
              Cập nhật
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
export default TextEditor
