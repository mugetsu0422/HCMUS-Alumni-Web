'use client'

import React, { useState } from 'react'
import { Avatar, Button, Textarea } from '@material-tailwind/react'
import { nunito } from '../../fonts'
import { Chat } from 'react-bootstrap-icons'

const dataTemp = [
  {
    avatarUrl: '/demo.jpg',
    name: 'Trương Samuel',
    comment:
      'Although I am not good at English, these songs are really good. I like "Give me your love" the most. The song really helps people relieve stress. Hope there will be more good songs coming out.',
    subcomment: [
      {
        avatarUrl: '/demo.jpg',
        name: 'Trương Samuel',
        comment:
          'Although I am not good at English, these songs are really good. I like "Give me your love" the most. The song really helps people relieve stress. Hope there will be more good songs coming out.',
      },
      {
        avatarUrl: '/demo.jpg',
        name: 'Trương Samuel',
        comment:
          'Although I am not good at English, these songs are really good. I like "Give me your love" the most. The song really helps people relieve stress. Hope there will be more good songs coming out.',
      },
      {
        avatarUrl: '/demo.jpg',
        name: 'Trương Samuel',
        comment:
          'Although I am not good at English, these songs are really good. I like "Give me your love" the most. The song really helps people relieve stress. Hope there will be more good songs coming out.',
      },
      {
        avatarUrl: '/demo.jpg',
        name: 'Trương Samuel',
        comment:
          'Although I am not good at English, these songs are really good. I like "Give me your love" the most. The song really helps people relieve stress. Hope there will be more good songs coming out.',
      },
      {
        avatarUrl: '/demo.jpg',
        name: 'Trương Samuel',
        comment:
          'Although I am not good at English, these songs are really good. I like "Give me your love" the most. The song really helps people relieve stress. Hope there will be more good songs coming out.',
      },
      {
        avatarUrl: '/demo.jpg',
        name: 'Trương Samuel',
        comment:
          'Although I am not good at English, these songs are really good. I like "Give me your love" the most. The song really helps people relieve stress. Hope there will be more good songs coming out.',
      },
    ],
  },
  {
    avatarUrl: '/demo.jpg',
    name: 'Trương Samuel',
    comment:
      'Although I am not good at English, these songs are really good. I like "Give me your love" the most. The song really helps people relieve stress. Hope there will be more good songs coming out.',
    subcomment: [],
  },
]

function SubComments({ avatarUrl, name, comment }) {
  const [isOpenInputComments, setIsOpenInputComments] = useState(false)
  const [comments, setComments] = useState('')

  // Function to handle changes in the textarea
  const handleCommentChange = (event) => {
    setComments(event.target.value)
  }

  return (
    <div
      className={`${nunito.className} flex flex-col border-l-2 border-[#e5e5e5] sm:pl-8 lg:pl-10 py-2`}>
      <div className="flex items-center gap-3">
        <Avatar
          size="sm"
          src={avatarUrl}
          alt="avatar user"
          placeholder={undefined}
        />
        <p>{name}</p>
      </div>
      <p className="sm:pl-8 lg:pl-12">{comment}</p>
      <Button
        onClick={() => setIsOpenInputComments((e) => !e)}
        placeholder={undefined}
        variant="text"
        className="py-2 px-2 gap-2 w-fit flex items-center normal-case ml-[40px] my-2">
        <Chat className="font-bold text-lg" /> Bình luận
      </Button>

      {isOpenInputComments && (
        <>
          <Textarea
            placeholder="Bình luận"
            resize={true}
            onChange={handleCommentChange}
            className="sm:ml-8 lg:ml-12 h-[30px] w-[93%] bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className:
                'w-[93%] before:content-none after:content-none sm:ml-8 lg:ml-12 w-fit',
            }}
          />
          <div className="flex justify-end gap-x-4 pt-2 mr-2">
            <Button
              placeholder={undefined}
              size="md"
              disabled={!comments.trim()}
              type="submit"
              className={`${nunito.className} py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
              Đăng
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function CommentsListItem({ avatarUrl, name, comment, subcomment }) {
  const [isOpenComments, setIsOpenComments] = useState(false)
  const [isOpenInputComments, setIsOpenInputComments] = useState(false)
  const [comments, setComments] = useState('')

  // Function to handle changes in the textarea
  const handleCommentChange = (event) => {
    setComments(event.target.value)
  }

  return (
    <div className={`${nunito.className} flex flex-col`}>
      <div className="flex items-center gap-4">
        <Avatar src={avatarUrl} alt="avatar user" placeholder={undefined} />
        <p className="text-lg">{name}</p>
      </div>
      <p className="pl-16">{comment}</p>

      <Button
        onClick={() => setIsOpenInputComments((e) => !e)}
        placeholder={undefined}
        variant="text"
        className="py-2 px-2 gap-2 w-fit flex items-center normal-case ml-[56px] my-2">
        <Chat className="font-bold text-lg" /> Bình luận
      </Button>

      {isOpenInputComments && (
        <>
          <Textarea
            placeholder="Bình luận"
            resize={true}
            onChange={handleCommentChange}
            className="sm:ml-8 lg:ml-[60px] h-[30px] w-[93%] bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className:
                'w-[93%] before:content-none after:content-none sm:ml-8 lg:ml-12 w-fit',
            }}
          />

          <div className="flex justify-end gap-x-4 pt-2 mr-2">
            <Button
              placeholder={undefined}
              size="md"
              type="submit"
              disabled={!comments.trim()}
              className={`${nunito.className} py-2 px-4 bg-[var(--blue-05)] normal-case text-md`}>
              Đăng
            </Button>
          </div>
        </>
      )}

      {subcomment.length > 0 && !isOpenComments && (
        <p
          onClick={() => setIsOpenComments((e) => !e)}
          className="pl-16 text-[--secondary] hover:underline hover:cursor-pointer">
          Xem {subcomment.length} phản hồi
        </p>
      )}

      {isOpenComments && (
        <div className="relative flex flex-col pl-16 py-4  h-fit overflow-y-auto scrollbar-webkit-main">
          {subcomment.map(({ avatarUrl, name, comment }, idx) => (
            <SubComments
              key={idx}
              avatarUrl={avatarUrl}
              name={name}
              comment={comment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

//*  Cái name thay vô cái API để biết là lấy cho bên news hoặc event
//* name = news || name = events
export default function Comments({ name }) {
  return (
    <div className="flex flex-col lg:p-8 gap-4 h-fit overflow-y-auto scrollbar-webkit-main">
      {dataTemp.map(({ avatarUrl, name, comment, subcomment }, idx) => (
        <CommentsListItem
          key={idx}
          avatarUrl={avatarUrl}
          name={name}
          comment={comment}
          subcomment={subcomment}
        />
      ))}
    </div>
  )
}
