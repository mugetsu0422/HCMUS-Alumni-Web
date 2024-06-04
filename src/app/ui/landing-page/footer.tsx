import React from 'react'
import Image from 'next/image'
import { nunito } from '../fonts'
import { Facebook, Youtube } from 'react-bootstrap-icons'
import Link from 'next/link'

function Footer() {
  return (
    <footer className={`${nunito.className}w-full py-6`}>
      <div className="w-full grid grid-cols-1 lg:grid-cols-[5fr_3fr_2fr] gap-5">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-10">
            <Image
              className='w-auto h-[100px]'
              src={'/hcmus-logo.png'}
              width={100}
              height={100}
              alt="hcmus-logo"
            />
            <Image
              src={'/logo-square.png'}
              width={100}
              height={100}
              alt="hcmus-logo"
            />
          </div>
          <p className={`text-[var(--secondary)] text-center`}>
            © Hệ thống kết nối cựu sinh viên Trường ĐH KHTN, ĐHQG-HCM
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <p className="font-bold text-lg">Thông tin liên hệ</p>
          <p className="text-[var(--secondary)]">
            Văn phòng Khoa CNTT: <br />
            Phòng I53, Tòa nhà I, 227 Nguyễn Văn Cừ, P4, Q5
            <br />
            Email: info@fit.hcmus.edu.vn
            <br />
            SĐT: (028) 6288 4499 <br />
            Tuyển sinh: 093 773 4004
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <p className="font-bold text-lg">Theo dõi</p>
          <div className="flex gap-4 text-[var(--secondary)] text-2xl">
            <Link
              className="hover:text-[#0866ff]"
              href={'https://www.facebook.com/'}
              rel="noopener noreferrer"
              target="_blank">
              <Facebook />
            </Link>
            <Link
              className="hover:text-[#ff0000]"
              href={'https://www.youtube.com/'}
              rel="noopener noreferrer"
              target="_blank">
              <Youtube />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
