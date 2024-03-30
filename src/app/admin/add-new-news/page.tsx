'use client'

import React from 'react'
import TextEditor from '../../ui/admin/text-editor/TextEditor'
import { nunito } from '../../ui/fonts'

export default function Page() {
  return (
    <div
      className={`${nunito.className} max-w-[81.25%] max-h-[755px] m-auto bg-[#f7fafd] mt-8 rounded-lg`}>
      <header className="font-extrabold text-2xl h-16 py-3 px-8 bg-[var(--blue-02)] flex items-center text-white rounded-tl-lg rounded-tr-lg">
        Thông tin chi tiết
      </header>
      <TextEditor />
    </div>
  )
}
