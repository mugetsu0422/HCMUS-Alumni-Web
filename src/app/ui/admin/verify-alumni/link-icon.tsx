import React from 'react'
import { Facebook, Linkedin } from 'react-bootstrap-icons'

function LinkIcon({ link }: { link: string }) {
  const facebookPattern = /(https?:\/)?(www\.)?(?:facebook\.com)\/(?:[^\s\/]+)/
  const linkedinPattern = /(https?:\/)?(www\.)?(?:linkedin\.com)\/(?:[^\s\/]+)/

  return (
    <>
      {facebookPattern.test(link) ? (
        <Facebook className="text-[#adadad] text-[1.8rem]" />
      ) : linkedinPattern.test(link) ? (
        <Linkedin className="text-[#adadad] text-[1.8rem]" />
      ) : link ? (
        <p className="decoration-solid underline text-blue-700">Social media</p>
      ) : null}
    </>
  )
}

export default LinkIcon
