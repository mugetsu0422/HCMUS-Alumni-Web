import React from 'react'
import { Facebook, Linkedin } from 'react-bootstrap-icons'

function LinkIcon({ link }: { link: string }) {
  const facebookPattern = /(https?:\/)?(www\.)?(?:facebook\.com)\/(?:[^\s\/]+)/
  const linkedinPattern = /(https?:\/)?(www\.)?(?:linkedin\.com)\/(?:[^\s\/]+)/

  return (
    <>
      {facebookPattern.test(link) ? (
        <Facebook className="text-[#1877F2]" />
      ) : linkedinPattern.test(link) ? (
        <Linkedin className="text-[#0077B5]" />
      ) : (
        <p className="decoration-solid text-blue-400">Social media</p>
      )}
      {}
    </>
  )
}

export default LinkIcon
