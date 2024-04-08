'use client'
import React from 'react'
import NewsListItem from '../../ui/admin/news/news-list-item'
import Header from '../../ui/admin/news/Header'
import { Input, Button } from '@material-tailwind/react'
import { ArrowRight, ArrowLeft } from 'react-bootstrap-icons'

const dataTemp = [
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 1',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 2',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 3',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 4',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 5',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 6',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 7',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 8',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 9',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 10',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 11',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 12',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 13',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 14',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 15',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 16',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 17',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 18',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 19',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 20',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 21',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 22',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 23',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 24',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 25',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 26',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 27',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 28',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 29',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 30',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 31',
    imgSrc: '/authentication.png',
    isShow: false,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 32',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 33',
    imgSrc: '/authentication.png',
    isShow: true,
  },
  {
    name: 'Trường Đại học Khoa học Tự nhiên hướng đến đào tạo thiết kế vi mạch và công nghệ bán dẫn 34',
    imgSrc: '/authentication.png',
    isShow: false,
  },
]

function Pagination({
  pages,
  setActive,
  active,
  setDisplayItemNext,
  setDisplayItemPre,
  itemsPerPage,
}) {
  // const getItemProps = (index) =>
  //   ({
  //     variant: active === index ? 'filled' : 'text',
  //     color: 'gray',
  //     onClick: () => {
  //       setActive(index)
  //       setDisplayItemNext(5 * index)
  //       setDisplayItemPre(5 * (index - 1))
  //     },
  //   }) as any

  const next = () => {
    if (active === pages) return

    setDisplayItemNext((e) => e + itemsPerPage)
    setDisplayItemPre((e) => e + itemsPerPage)
    setActive(active + 1)
  }

  const prev = () => {
    if (active === 1) return

    setDisplayItemPre((e) => e - itemsPerPage)
    setDisplayItemNext((e) => e - itemsPerPage)

    setActive(active - 1)
  }

  return (
    <div className="flex items-center gap-4 justify-center mb-6">
      <Button
        placeholder={undefined}
        variant="text"
        className="flex items-center gap-2 font-bold normal-case text-base"
        onClick={prev}
        disabled={active === 1}>
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <p className="w-20 text-center font-bold">
        {active} / {pages}
      </p>
      <Button
        placeholder={undefined}
        variant="text"
        className="flex items-center gap-2  font-bold normal-case text-base"
        onClick={next}
        disabled={active === pages}>
        <ArrowRight strokeWidth={2} className="h-6 w-6" />
      </Button>
    </div>
  )
}

function Search() {
  return (
    <div className="mb-10 w-[1184px] m-auto">
      <Input
        size="lg"
        crossOrigin={undefined}
        label="Tìm kiếm bài viết..."
        placeholder={undefined}
      />
    </div>
  )
}

function Page() {
  let itemsPerPage = 10
  const dataLength = dataTemp.length
  let pages = Math.ceil(dataLength / itemsPerPage)
  const [active, setActive] = React.useState(1)
  const [displayItemNext, setDisplayItemNext] = React.useState(itemsPerPage)
  const [displayItemPre, setDisplayItemPre] = React.useState(0)

  return (
    <div className="flex flex-col sm:justify-center lg:justify-start m-auto max-w-[90%] mt-[3vw]">
      <Search />
      <Header />
      <div className="relative mb-10">
        {dataTemp
          .slice(displayItemPre, displayItemNext)
          .map(({ name, imgSrc, isShow }) => (
            <div key={name} className=" m-auto">
              <NewsListItem
                name={name}
                imgSrc={imgSrc}
                isShow={isShow}
                key={name}
              />
            </div>
          ))}
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        pages={pages}
        active={active}
        setActive={setActive}
        setDisplayItemNext={setDisplayItemNext}
        setDisplayItemPre={setDisplayItemPre}
      />
    </div>
  )
}

export default Page
