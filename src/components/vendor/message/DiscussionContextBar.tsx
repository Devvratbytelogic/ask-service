import React from 'react'

export default function DiscussionContextBar() {
    return (
        <>
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex flex-col min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-fontBlack truncate">
                        Discussing: <span className='font-bold'>House Cleaning</span> (REQ-A7X9K2)
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm text-darkSilver line-clamp-2 sm:line-clamp-1">
                        Regular weekly cleaning for 3-bedroom house
                    </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                    <p className="text-lg font-bold text-fontBlack">€85/week</p>
                    <p className="text-xs text-darkSilver">Quoted price</p>
                </div>
            </div>
        </>
    )
}
