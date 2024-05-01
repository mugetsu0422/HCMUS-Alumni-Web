'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import { nunito } from '../../../ui/fonts'
import NoData from '../../../ui/no-data'
import axios from 'axios'
import Cookies from 'js-cookie'
import { JWT_COOKIE } from '../../../constant'
import toast, { Toaster } from 'react-hot-toast'

export default function Page({ params }: { params: { id: string } }) {
  const [hof, setHof] = useState()
  const [noData, setNoData] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detailsPromise = axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_HOST}/hof/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get(JWT_COOKIE)}`,
        },
      }
    )
    Promise.all([detailsPromise])
      .then(([detailsRes]) => {
        const { data: hof } = detailsRes
        setHof(hof)
        setIsLoading(false)
      })
      .catch((error) => {
        setNoData(true)
      })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (noData) {
    return <NoData />
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center m-auto my-10 max-w-[1000px] w-[80%] gap-6">
        <Toaster
          toastOptions={{
            success: {
              style: {
                background: '#00a700',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#ea7b7b',
                color: 'white',
              },
            },
          }}
        />
        <img
          //src={hof?.thumbnail}
          alt="Hall of fame image"
          className=" w-[650px] lg:h-[450px] sm:h-[350px] object-cover object-center rounded-xl"
        />
        <p
          className={`${nunito.className} 2xl:text-[28px] sm:text-lg lg:text-2xl font-bold`}>
          {/* {hof?.name} */}
        </p>
        <div className="flex flex-col gap-4 ql-editor sm:text:md lg:text-base text-justify">
          <p>
            Từng có cơ hội làm việc cho Google nhưng Lê Yên Thanh từ chối để ở
            lại Việt Nam đầu quân cho một số startup, sau đó khởi nghiệp với
            BusMap. CEO sinh năm 1994 là một trong 6 đại diện của Việt Nam vừa
            được vinh danh trong Forbes 30 under 30 châu Á năm 2022.
          </p>
          <p>
            Sở hữu bảng thành tích “khủng”, được truyền thông ưu ái gọi là
            “chàng trai vàng tin học” của Việt Nam nhưng Lê Yên Thanh thú nhận
            “vì tham gia quá nhiều cuộc thi nên tôi cũng không nhớ chính xác
            mình đã đạt tất cả bao nhiêu giải thưởng”.
          </p>
          <p>
            Bắt đầu làm quen và yêu thích tin học từ những năm cấp 2, chàng trai
            quê An Giang này từng đoạt giải nhất kỳ thi học sinh giỏi tin học
            quốc gia và được tuyển thẳng vào đại học. Năm 2015, anh giành giải
            nhì cuộc thi Nhân tài Đất Việt. Cùng năm đó, Lê Yên Thanh được vinh
            danh là Gương mặt trẻ tiêu biểu của Việt Nam khi mới 21 tuổi.
          </p>
          <p>
            Với vai trò là nhà sáng lập và CEO Phenikaa Mass – công ty cung cấp
            các giải pháp công nghệ giao thông, Lê Yên Thanh vừa lọt Top 30
            under 30 châu Á của tạp chí Forbes. Startup của Thanh trước đây mang
            tên BusMap nhưng đã đổi thành Phenikaa Mass sau khi nhận đầu tư 1,5
            triệu USD từ Phenikaa, tập đoàn do doanh nhân Hồ Xuân Năng sáng lập.
          </p>
        </div>
      </div>
    </>
  )
}
