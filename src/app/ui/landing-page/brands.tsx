/* eslint-disable @next/next/no-img-element */
import { inter } from '../fonts'

function Brands() {
  return (
    <>
      <div
        className={`${inter.className} antialiased w-100 font-semibold text-center py-5`}>
        Hơn một 100+ doanh nghiệp liên kết
      </div>
      <div className="w-100 border-y-2 border-solid border-[var(--cocoa-brown-20)] flex flex-wrap flex-row justify-center gap-[3rem] py-3">
        <img
          className="w-full h-full"
          src="/landing-page/brand.png"
          alt="brands"
        />
      </div>
    </>
  )
}

export default Brands
