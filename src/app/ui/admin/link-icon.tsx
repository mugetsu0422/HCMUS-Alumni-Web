import React from 'react'
import { Facebook, Linkedin } from 'react-bootstrap-icons'

function LinkIcon({ link }: { link: string }) {
  const facebookPattern = /(https?:\/)?(www\.)?(?:facebook\.com)\/(?:[^\s\/]+)/
  const linkedinPattern = /(https?:\/)?(www\.)?(?:linkedin\.com)\/(?:[^\s\/]+)/

  return (
    <>
      {facebookPattern.test(link) ? (
        <Facebook className="text-[#1877F2] text-[2.5rem]" />
      ) : linkedinPattern.test(link) ? (
        <Linkedin className="text-[#0077B5] text-[2.5rem]" />
      ) : (
        <p className="decoration-solid underline text-blue-700">Social media</p>
      )}
      {}
    </>
  )
}

export default LinkIcon
