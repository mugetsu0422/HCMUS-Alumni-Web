import React, { forwardRef, useImperativeHandle, Ref } from 'react'

type SingleCommentIndicatorProps = {
  parentCommentUrl: string
  fullPostUrl: string
}

const SingleCommentIndicator = forwardRef<
  HTMLDivElement,
  SingleCommentIndicatorProps
>(
  (
    { parentCommentUrl, fullPostUrl }: SingleCommentIndicatorProps,
    ref: Ref<HTMLDivElement>
  ) => {

    return (
      <div ref={ref} className="w-full flex justify-center items-center gap-2 scroll-mt-[var(--navbar-height)]">
        {parentCommentUrl ? (
          <a
            href={`${parentCommentUrl}`}
            className="no-underline hover:no-underline visited:no-underline text-[var(--blue-05)]">
            Chuỗi bình luận đơn lẻ
          </a>
        ) : (
          <span className="no-underline hover:no-underline visited:no-underline text-black">
            Chuỗi bình luận đơn lẻ
          </span>
        )}

        <span className="flex-1 h-px mx-xs bg-black"></span>
        <a
          href={fullPostUrl}
          className="no-underline hover:no-underline visited:no-underline text-[var(--blue-05)]">
          Xem toàn bộ bình luận
        </a>
      </div>
    )
  }
)

SingleCommentIndicator.displayName = 'SingleCommentIndicator'

export default SingleCommentIndicator
