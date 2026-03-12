import React from 'react'
import { BackArrowSVG, StarRatingIconSVG, VerifiedShieldIconSVG, VerticalChatDotsSVG } from '@/components/library/AllSVG';

interface ChatHeaderProps {
    onBack?: () => void;
}

export default function ChatHeader({ onBack }: ChatHeaderProps) {

    return (
        <>
            <div className="flex shrink-0 items-start justify-between gap-3 md:gap-4 border-b border-borderDark bg-white px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    {/* Back button - mobile only */}
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex shrink-0 items-center justify-center -ml-1 p-2 rounded-lg text-darkSilver hover:bg-borderDark hover:text-fontBlack transition-colors lg:hidden"
                            aria-label="Back to messages"
                        >
                            <BackArrowSVG />
                        </button>
                    )}
                    <div className="flex size-10 md:size-12 shrink-0 items-center justify-center rounded-full bg-[#D1D5DC] font-semibold text-white text-base md:text-lg">
                        P
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                            <h2 className="font-bold text-fontBlack text-sm md:text-base truncate">ProClean Services Ltd</h2>
                            <p className="inline-flex items-center gap-1 rounded-full border border-[#BEDBFF] bg-[#EFF6FF] px-2 py-1 text-xs font-medium text-[#1447E6]">
                                <VerifiedShieldIconSVG />
                                Verified
                            </p>
                            <p className="inline-flex items-center gap-1 text-sm ">
                                <StarRatingIconSVG />
                                4.9 <span className="text-darkSilver">(127)</span>
                            </p>
                        </div>
                        <p className="text-xs text-[#00A63E]">Active now</p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        className="rounded p-1.5 text-darkSilver hover:bg-borderDark"
                        aria-label="Options"
                    >
                        <VerticalChatDotsSVG />
                    </button>
                </div>
            </div>
        </>
    )
}
