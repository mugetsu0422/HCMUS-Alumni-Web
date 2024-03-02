import React from 'react'
import { nunito } from '../fonts'
import Image from 'next/image'

function Card({
  imgSrc,
  title,
  text,
}: {
  imgSrc: string
  title: string
  text: string
}) {
  return (
    <div className="w-[18rem] h-[18rem] border-2 border-[var(--cocoa-brown-20)] flex flex-col justify-center items-center gap-4">
      <Image src={imgSrc} width={100} height={100} alt="icon" />
      <p className="font-bold">{title}</p>
      <p className="text-center font-medium w-4/5">{text}</p>
    </div>
  )
}

function Explore() {
  return (
    <div
      className={`${nunito.className} antialiased py-5 sm:py-10 flex flex-col justify-center items-center border-b-2 border-solid border-[var(--cocoa-brown-20)]`}>
      <div
        className={`font-bold text-[1.5rem] sm:text-[2.25rem] text-[var(--blue-02)]`}>
        KHÁM PHÁ
      </div>
      <div className="flex flex-row flex-wrap justify-center pt-3 pb-8 gap-6">
        <Card
          imgSrc="/landing-page/headphone.png"
          title="Hỗ trợ & Tư vấn"
          text="Giải đáp nhanh chóng và tư vấn cùng đội ngũ cựu sinh viên."
        />
        <Card
          imgSrc="/landing-page/puzzle.png"
          title="Kết nối cựu sinh viên"
          text="Kết nối cộng đồng cựu sinh viên, chia sẻ kiến thức và kinh nghiệm."
        />
        <Card
          imgSrc="/landing-page/phone.png"
          title="Tìm Kiếm Cựu Sinh Viên"
          text="Dễ dàng tìm kiếm và kết nối với cựu sinh viên."
        />
        <Card
          imgSrc="/landing-page/pinwheel.png"
          title="Sự kiện và Hội thảo"
          text="Tham gia sự kiện mở rộng mối quan hệ và cơ hội nghề nghiệp."
        />
      </div>
    </div>
  )
}

export default Explore
