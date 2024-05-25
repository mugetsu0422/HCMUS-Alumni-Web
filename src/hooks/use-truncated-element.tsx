import { off } from "process"
import { useState, useLayoutEffect } from "react"

export const useTruncatedElement = ({ ref }) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const [isReadingMore, setIsReadingMore] = useState(false)

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {}

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true)
    } else {
      setIsTruncated(false)
    }
  }, [ref])

  return {
    isTruncated,
    isReadingMore,
    setIsReadingMore,
  }
}