'use client'
import React from 'react'
import CounselListItem from '../../ui/counsel/counsel-list-item'

const data = [
  {
    id: '1',
    title: 'Tư vấn hỗ trợ giải đáp thắc mắc trong học tập',
    content:
      'Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.Bài viết này sẽ giúp các bạn giải đáp thắc mắc trong quá trình học tập tại trường. Ai có thắc mắc gì thì commnet ở bên dưới để đươc hỗ trợ.',
    tags: [
      { id: '6', name: 'Học tập' },
      { id: '2', name: 'Trường học' },
    ],
    publishedAt: '01-05-2024',
    pictures: [
      { id: '1', pictureUrl: '/authentication.png' },
      { id: '2', pictureUrl: '/logo.png' },
      { id: '3', pictureUrl: '/demo.jpg' },
    ],
    creator: { id: '1', fullName: 'Trương Samuel', avatarUrl: '/demo.jpg' },
  },
]

export default function Page() {
  const [counsel, setCounsel] = React.useState(data)

  return (
    <div className="my-4 max-w-[850px] min-w-[500px] w-[80%] m-auto flex flex-col gap-8 h-fit">
      {counsel.map(
        ({ id, title, content, tags, creator, publishedAt, pictures }) => (
          <CounselListItem
            id={id}
            key={id}
            title={title}
            content={content}
            tags={tags}
            publishedAt={publishedAt}
            creator={creator}
            pictures={pictures}
          />
        )
      )}
    </div>
  )
}
