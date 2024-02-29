import { inter } from '../fonts'
import Image from 'next/image'
import Link from 'next/link'
import vng_icon from '/public/landing-page/vng-icon.png'
import fpt_icon from '/public/landing-page/fpt-icon.png'
import tma_icon from '/public/landing-page/tma-icon.png'
import kms_icon from '/public/landing-page/kms-icon.png'
import hlc_icon from '/public/landing-page/hlc-icon.png'
import bosch_icon from '/public/landing-page/bosch-icon.png'
import elca_icon from '/public/landing-page/elca-icon.png'
import dek_icon from '/public/landing-page/dek-icon.png'
import axon_icon from '/public/landing-page/axon-icon.png'
import brand from '/public/landing-page/brand.png'

function Brands() {
  return (
    <>
      <div
        className={`${inter.className} antialiased w-100 font-semibold text-center py-5`}>
        Hơn một 100+ doanh nghiệp liên kết
      </div>
      <div className="w-100 border-y-2 border-solid border-[#1E151533] flex flex-wrap flex-row justify-center gap-[3rem] py-3">
        {/* <Image
        className="w-50 h-auto"
        src={vng_icon}
        sizes="50vw"
        alt="vng-icon"></Image>
      <Image
        className="w-100 h-auto"
        src={fpt_icon}
        sizes="100vw"
        alt="fpt-icon"></Image>
      <Image
        className="w-100 h-auto"
        src={tma_icon}
        sizes="100vw"
        alt="tma-icon"></Image>
      <Image
        className="w-100 h-auto"
        src={kms_icon}
        sizes="100vw"
        alt="kms-icon"></Image>
      <Image
        className="w-100 h-auto"
        src={hlc_icon}
        sizes="100vw"
        alt="hlc-icon"></Image>
      <Image
        className="w-100 h-auto"
        src={bosch_icon}
        sizes="100vw"
        alt="bosch-icon"></Image>
      <Image
        className="w-100 h-auto"
        src={elca_icon}
        sizes="100vw"
        alt="elca-icon"></Image>
      <Image
        className="w-100 h-auto"
        src={dek_icon}
        sizes="100vw"
        alt="dek-icon"></Image>
      <Image
        className="w-100 h-auto"
        src={axon_icon}
        sizes="100vw"
        alt="axon-icon"></Image> */}
        <Image
          className="w-100 h-auto"
          src={brand}
          sizes="100vw"
          alt="axon-icon"></Image>
      </div>
    </>
  )
}

export default Brands
