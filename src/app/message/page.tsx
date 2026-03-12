import MessageLayout from '@/components/common/message/MessageLayout'
import React from 'react'

export default function MessagePage() {
    return (
        <div
            className="min-h-75 min-w-0 overflow-hidden"
            style={{
                height: 'calc(100dvh - 6rem)',
                maxHeight: 'calc(100dvh - 6rem)',
            }}
        >
            <MessageLayout />
        </div>
    )
}
