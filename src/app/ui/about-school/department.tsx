import React from 'react'

const data = [
  {
    special: false,
    name: 'CÔNG NGHỆ THÔNG TIN',
    TK: 'TS.Đinh Bá Tiến',
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
    PK: [{ name: 'PGS.TS. Trần Thiện Thanh' }],
  },
  {
    special: false,
    name: 'ĐỊA CHẤT',
    TK: 'PGS.TS. Phạm Trung Hiếu',
    PK: [],
  },
  {
    special: false,
    name: 'TOÁN - TIN HỌC',
    TK: 'PGS.TS. Mai Hoàng Biên',
    PK: [{ name: 'TS. Hoàng Văn Hà' }, { name: 'ThS. Võ Đức Cấm Hải' }],
  },
  {
    special: false,
    name: 'ĐIỆN TỬ - VIỄN THÔNG',
    TK: 'TS. Bùi Trọng Tú',
    PK: [{ name: 'TS. Đặng Lê Khoa' }, { name: 'ThS. Cao Trần Bảo Thương' }],
  },
  {
    special: false,
    name: 'KHOA HỌC & CÔNG NGHỆ VẬT LIỆU',
    TK: 'PGS.TS. Trần Thị Thanh Vân',
    PK: [{ name: 'PGS. TS. Hà Thúc Chí Nhân' }],
  },
  {
    special: false,
    name: 'HÓA HỌC',
    TK: 'PGS.TS. Nguyễn Trung Nhân',
    PK: [
      { name: 'PGS.TS. Nguyễn Công Tránh' },
      { name: 'ThS. Nguyễn Thu Hương' },
    ],
  },
  {
    special: false,
    name: 'SINH HỌC - CÔNG NGHỆ SINH HỌC',
    TK: 'PGS.TS. Quách Ngô Diễm Phương',
    PK: [{ name: 'PGS. TS. Trương Hải Nhung' }],
  },
  {
    special: false,
    name: 'MÔI TRƯỜNG',
    TK: 'PGS. TS. Đào Nguyên Khôi',
    PK: [{ name: 'TS. Lê Hoàng Anh' }],
  },
  {
    special: false,
    name: 'KHOA HỌC LIÊN NGÀNH',
    TK: 'PGS.TS. Nguyễn Tuyết Phương',
    PK: [],
  },
  {
    special: true,
    name: 'TẾ BÀO GỐC',
    TK: 'PGS.TS. Phạm Văn Phúc',
    PK: [],
  },
]

export default function Department() {
  return (
    <div className="bg-cyan-400">
      <p className="text-[4vw] font-bold m-auto w-fit my-[4.5vw]"> CÁC KHOA </p>
      <div className="w-fit flex flex-wrap gap-8 ">
        {data.map(({ name, TK, PK, special }) => (
          <div key={name} className="w-[360px] bg-red-400 h-fit ">
            <div>hi</div>
          </div>
        ))}
      </div>
    </div>
  )
}
