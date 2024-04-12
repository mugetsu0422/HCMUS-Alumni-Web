'use client'

/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Clock, GeoAltFill, BarChartFill, Tag } from 'react-bootstrap-icons'
import { nunito } from '../../../ui/fonts'
import { Button } from '@material-tailwind/react'

const dataTemp = {
  id: '1',
  title: 'Khai mạc Trường hè Khoa học Dữ liệu 2024',
  thumbnail: '/authentication.png',
  views: 100,
  organizationLocation: '227 Nguyễn Văn Cừ, P4, Q5',
  organizationTime: 'DD-MM-YYYY HH:mm:ss',
  content:
    'Sed lectus amet, eu lacus viverra magna ullamcorper ultricies. Laoreet est molestie tellus, volutpat, vitae. Viverra vitae nunc molestie nec. Id orci tincidunt amet ullamcorper morbi mauris augue. Faucibus ornare tincidunt malesuada phasellus. Volutpat, est id tincidunt dolor eu. Enim dictum aenean ultrices pharetra lorem leo cursus. Mollis dui turpis sed suscipit. Mauris vestibulum in phasellus velit morbi lobortis varius egestas posuere. Commodo purus non adipiscing porttitor lectus nunc, nisi. Urna amet, nisl, lectus vel. Aliquam, porttitor quis at vel sed ut montes, egestas. Nisl, vestibulum tempor natoque lacinia posuere. Risus id tempor turpis faucibus ante volutpat nunc. Viverra iaculis iaculis at convallis tellus. Condimentum massa faucibus at porttitor vestibulum in.',
  faculty_id: 'CNTT',
}

export default function Page() {
  return (
    <div
      className={`${nunito.className} w-[75%] bg-[--blue-04] rounded-lg m-auto py-20 mt-16`}>
      <div className="flex flex-col w-[90%] items-center justify-center m-auto gap-y-10">
        <div className="flex justify-between w-full">
          <img
            src={dataTemp.thumbnail}
            alt="image event"
            className="w-[750px] h-[430px] object-cover object-center rounded-lg"
          />
          <div className="flex flex-col w-[500px] gap-y-10">
            <p className="text-[1.9rem] font-extrabold">{dataTemp.title}</p>

            <div>
              <p className="flex items-center gap-2 text-[20px]">
                <GeoAltFill className="text-[--blue-02]" /> Địa điểm:
                <text>{dataTemp.organizationLocation}</text>
              </p>
              <p className="flex items-center gap-2 text-[20px]">
                <Clock className="text-[--blue-02]" /> Thời gian:
                <text>{dataTemp.organizationTime}</text>
              </p>
              <p className="flex items-center gap-2 text-[20px]">
                <Tag className="text-[--blue-02]" /> Khoa:
                <text>{dataTemp.faculty_id}</text>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <BarChartFill className="text-[--blue-02] text-[4.1rem]" />
              <div className="flex flex-col gap-y-2">
                <p className="text-[30px] font-extrabold">{dataTemp.views}</p>
                <p className="text-lg">Số người tham gia</p>
              </div>
            </div>
            <Button
              placeholder={undefined}
              className="w-52 bg-[--blue-02]"
              size="lg">
              Tham gia ngay
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[26px] font-extrabold">Thông tin chi tiết</p>
          <p className="text-pretty text-base">{dataTemp.content}</p>
        </div>
      </div>
    </div>
  )
}
