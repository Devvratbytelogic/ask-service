import React from 'react'
import type { IAllChatListData } from '@/types/allChatList';

interface DiscussionContextBarProps {
    selectedChat?: IAllChatListData | null;
}

export default function DiscussionContextBar({ selectedChat }: DiscussionContextBarProps) {
    console.log('selectedChat', selectedChat);
    const quote = selectedChat?.quote_id;
    const title = quote?.service_description ?? 'House Cleaning';
    const requestId = quote?.service_request_id?.reference_no ?? '—';
    const price = quote != null ? `${quote.currency ?? '€'}${quote.quote_price}` : '€85/week';

    return (
        <>
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex flex-col min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-fontBlack truncate">
                        Discussing: <span className='font-bold'>{title}</span> ({requestId})
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm text-darkSilver line-clamp-2 sm:line-clamp-1">
                        {quote?.service_description ?? 'Regular weekly cleaning for 3-bedroom house'}
                    </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                    <p className="text-lg font-bold text-fontBlack">{price}</p>
                    <p className="text-xs text-darkSilver">Quoted price</p>
                </div>
            </div>
        </>
    )
}
