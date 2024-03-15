import React from 'react'
import Image from 'next/image'

const data = [
  {
    special: false,
    name: 'CÔNG NGHỆ THÔNG TIN',
    TK: 'TS.Đinh Bá Tiến',
    imgLink: '/about-school/CNTT.png',
    PK: [
      { name: 'PGS.TS. Nguyễn Văn Vũ' },
      { name: 'TS. Lâm Quang Vũ' },
      { name: 'ThS. Văn Chí Nam' },
    ],
  },
  {
    special: false,
    name: 'VẬT LÝ - VẬT LÝ KỸ THUẬT',
    TK: 'PGS.TS. Huỳnh Văn Tuấn',
    imgLink: '/about-school/VLKT.png',
    PK: [{ name: 'PGS.TS. Trần Thiện Thanh' }],
  },
  {
    special: false,
    name: 'ĐỊA CHẤT',
    TK: 'PGS.TS. Phạm Trung Hiếu',
    imgLink: '/about-school/DC.png',
    PK: [],
  },
  {
    special: false,
    name: 'TOÁN - TIN HỌC',
    TK: 'PGS.TS. Mai Hoàng Biên',
    imgLink: '/about-school/TTH.png',
    PK: [{ name: 'TS. Hoàng Văn Hà' }, { name: 'ThS. Võ Đức Cấm Hải' }],
  },
  {
    special: false,
    name: 'ĐIỆN TỬ - VIỄN THÔNG',
    TK: 'TS. Bùi Trọng Tú',
    imgLink: '/about-school/DTVT.png',
    PK: [{ name: 'TS. Đặng Lê Khoa' }, { name: 'ThS. Cao Trần Bảo Thương' }],
  },
  {
    special: false,
    name: 'KHOA HỌC & CÔNG NGHỆ VẬT LIỆU',
    TK: 'PGS.TS. Trần Thị Thanh Vân',
    imgLink: '/about-school/CNVL.png',
    PK: [{ name: 'PGS. TS. Hà Thúc Chí Nhân' }],
  },
  {
    special: false,
    name: 'HÓA HỌC',
    TK: 'PGS.TS. Nguyễn Trung Nhân',
    imgLink: '/about-school/HH.png',
    PK: [
      { name: 'PGS.TS. Nguyễn Công Tránh' },
      { name: 'ThS. Nguyễn Thu Hương' },
    ],
  },
  {
    special: false,
    name: 'SINH HỌC - CÔNG NGHỆ SINH HỌC',
    TK: 'PGS.TS. Quách Ngô Diễm Phương',
    imgLink: '/about-school/CNSH.png',
    PK: [{ name: 'PGS. TS. Trương Hải Nhung' }],
  },
  {
    special: false,
    name: 'MÔI TRƯỜNG',
    TK: 'PGS. TS. Đào Nguyên Khôi',
    imgLink: '/about-school/MT.png',
    PK: [{ name: 'TS. Lê Hoàng Anh' }],
  },
  {
    special: false,
    name: 'KHOA HỌC LIÊN NGÀNH',
    TK: 'PGS.TS. Nguyễn Tuyết Phương',
    imgLink: '/about-school/KHLN.png',
    PK: [],
  },
  {
    special: true,
    name: 'TẾ BÀO GỐC',
    TK: 'PGS.TS. Phạm Văn Phúc',
    imgLink: '/about-school/TBG.png',
    PK: [],
  },
]

export default function Department() {
  return (
    <div>
      <p className="text-[4vw] font-bold m-auto w-fit my-[4.5vw]"> CÁC KHOA </p>
      <div className="w-fit gap-8 flex flex-wrap justify-center">
        {data.map(({ name, TK, PK, special, imgLink }) => (
          <div key={name} className="w-[350px] h-fit">
            <div className="flex items-center bg-gray-50 rounded-lg justify-between ">
              <div className="w-[130px] bg-[#ffde59] h-[130px] flex items-center rounded-lg">
                <Image
                  src={imgLink}
                  alt="department logo"
                  width={130}
                  height={130}
                />
              </div>
              <div className="flex-col justify-center items-center text-2xl text-center font-black">
                <p className="w-full text-[#38b6ff] mb-1">
                  {special ? 'VIỆN' : 'KHOA'}
                </p>
                <p className="w-48 text-[#004aad] ">{name}</p>
              </div>
            </div>
            <div className="[&>*]:mt-1 mt-4 text-zinc-700 text-base">
              <p className="italic">Trưởng khoa:</p>
              <p className="font-bold">{TK}</p>
              {PK.length > 0 && (
                <>
                  <p className="italic">Phó trưởng khoa:</p>
                  <ol>
                    {PK.map(({ name }, idx) => (
                      <li className="font-bold" key={idx}>
                        {name}
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
