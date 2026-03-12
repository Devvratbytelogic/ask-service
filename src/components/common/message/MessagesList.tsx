import React from 'react'
import { EditIconSVG, HeartIconSVG, SearchIconSVG } from '@/components/library/AllSVG';
import { Input } from '@heroui/react';


const conversations = [
    {
        id: '1',
        initial: 'P',
        name: 'ProClean Services',
        lastMessage: 'We also bring all our own equipment...',
        status: 'Active now',
        unread: 2,
        isSelected: true,
    },
    {
        id: '2',
        initial: 'S',
        name: 'Sparkle Home Care',
        lastMessage: 'Marina is typing...',
        status: 'typing',
        unread: 0,
        isSelected: false,
    },
    {
        id: '3',
        initial: 'E',
        name: 'Elite Maids',
        lastMessage: 'Sent a picture',
        status: null,
        unread: 0,
        isSelected: false,
    },
    {
        id: '4',
        initial: 'F',
        name: 'Fresh Start Cleaners',
        lastMessage: 'Meet me before presentation...',
        status: null,
        unread: 0,
        isSelected: false,
    },
    {
        id: '5',
        initial: 'C',
        name: 'Crystal Clear',
        lastMessage: 'How did you prepared...',
        status: null,
        unread: 0,
        isSelected: false,
    },
];
interface MessagesListProps {
    onSelectConversation?: () => void;
}

export default function MessagesList({ onSelectConversation }: MessagesListProps) {
    return (
        <>
            <div className="border-b border-borderColor p-3 md:p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="font-bold text-fontBlack">Messages</h1>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            className="rounded p-1.5 text-darkSilver hover:bg-borderDark hover:text-fontBlack"
                            aria-label="New message"
                        >
                            <EditIconSVG />
                        </button>
                        <button
                            type="button"
                            className="rounded p-1.5 text-darkSilver hover:bg-borderDark hover:text-fontBlack"
                            aria-label="Favorites"
                        >
                            <HeartIconSVG />
                        </button>
                        {/* <button
                            type="button"
                            className="rounded p-1.5 text-darkSilver hover:bg-borderDark hover:text-fontBlack"
                            aria-label="More"
                        >
                            <HorizontalDotsSVG />
                        </button> */}
                    </div>
                </div>
                <div className="relative">
                    <Input
                        type="text"
                        name="name"
                        variant="bordered"
                        classNames={{
                            inputWrapper: ['custom_input_design shadow-none btn_radius px-3! border-borderColor!'],
                        }}
                        placeholder="Search"
                        startContent={<SearchIconSVG />}
                    />
                </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                    <button
                        key={conv.id}
                        type="button"
                        onClick={onSelectConversation}
                        className={`flex items-center w-full cursor-pointer gap-3 px-3 py-3 md:px-4 text-left transition-colors hover:bg-borderDark/50 active:bg-borderDark/30 ${conv.isSelected ? 'bg-primaryColor/5' : ''
                            }`}
                    >
                        <div className="relative shrink-0">
                            <div className="flex size-12 items-center justify-center rounded-full bg-[#D1D5DC] text-base font-semibold text-white">
                                {conv.initial}
                            </div>
                            {(conv.status === 'Active now' || conv.status === 'typing') && (
                                <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#00A63E]" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm truncate font-semibold text-fontBlack">
                                    {conv.name}
                                </span>
                                {conv.unread > 0 && (
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primaryColor text-xs font-medium text-white">
                                        {conv.unread}
                                    </span>
                                )}
                            </div>
                            <p className="mt-0.5 truncate text-xs font-medium text-darkSilver">
                                {conv.lastMessage}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </>
    )
}
