'use client'

import React from 'react'
import { Button } from '@heroui/react'
import { SendIconSVG } from '@/components/library/AllSVG'

export default function AskQuestionCallout() {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-primaryColor/5 w-full min-w-0">
        {/* Left: text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-fontBlack mb-1">
            Can&apos;t find your answer?
          </h3>
          <p className="text-sm text-darkSilver font-normal">
            Get in touch with us we are happy to assist you!
          </p>
        </div>
        {/* Right: button with avatar overlapping its top-right corner */}
        <div className="relative shrink-0 pt-2 pr-2">
          <Button
            className="btn_bg_blue btn_radius"
            startContent={<SendIconSVG/>}
          >
            Ask a Question
          </Button>
        </div>
      </div>
    </>
  )
}
