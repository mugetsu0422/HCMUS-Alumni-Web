import { koho, nunito } from '../fonts'
import Image from 'next/image'
import Link from 'next/link'

function Banner() {
  return (
    <div className="md:px-10 py-16 flex flex-wrap justify-center items-center bg-gradient-to-r from-[var(--blue-05-10)] to-[#00000000]">
      <div className="basis-5/12 flex flex-col gap-y-3 md:gap-y-6 pl-6 md:pl-0">
        <div
          className={`${koho.className} antialiased text-[var(--text)] w-fit font-bold text-[1.5rem] md:text-[2.5rem]`}>
          ALUMVERSE HCMUS
        </div>
        <div
          className={`${nunito.className} antialiased hidden md:block text-[#3F3F46] w-4/5 text-lg`}>
          Hệ thống kết nối cựu sinh viên từ đa ngành, mang đến cơ hội chia sẻ
          kinh nghiệm và hỗ trợ nghề nghiệp.
        </div>
        <div
          className={`${nunito.className} antialiased text-[#3F3F46] block md:hidden w-4/5 text-sm`}>
          Hệ thống kết nối cựu sinh viên.
        </div>
        <Link
          href={'#'}
          className={`${nunito.className} antialiased bg-[var(--blue-05)] hover:opacity-90 w-fit text-white md:py-4 md:px-5 py-2.5 px-3.5 font-bold rounded-xl md:rounded-2xl text-xs md:text-base`}>
          ĐĂNG KÝ NGAY
        </Link>
      </div>
      <Image
        className="basis-7/12 rounded-2xl max-w-[700px] min-w-[200px]"
        src="/landing-page/banner.jpg"
        width={700}
        height={500}
        alt="banner"></Image>
    </div>
  )
}

export default Banner