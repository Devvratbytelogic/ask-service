import React from 'react'
import { BackArrowSVG, StarRatingIconSVG, VerifiedShieldIconSVG, VerticalChatDotsSVG } from '@/components/library/AllSVG';
import type { IAllChatListData, UsersEntity } from '@/types/allChatList';
import ImageComponent from '@/components/library/ImageComponent';

function getOtherUser(chat: IAllChatListData): UsersEntity | undefined {
    return chat.users?.find((u) => !u.itsMe);
}

function getDisplayName(chat: IAllChatListData): string {
    const u = getOtherUser(chat);
    if (!u) return 'Unknown';
    const isVendor = (u.role?.name ?? '').toLowerCase() === 'vendor';
    if (isVendor && u.business_name?.trim()) return u.business_name.trim();
    const first = (u.first_name ?? '').trim();
    const last = (u.last_name ?? '').trim();
    return [first, last].filter(Boolean).join(' ') || 'Unknown';
}

function getInitial(name: string): string {
    return name.trim().charAt(0)?.toUpperCase() || 'U';
}

interface ChatHeaderProps {
    onBack?: () => void;
    selectedChat?: IAllChatListData | null;
    isOnline?: boolean;
    isTyping?: boolean;
}

export default function ChatHeader({ onBack, selectedChat, isOnline, isTyping }: ChatHeaderProps) {
    const otherUser = selectedChat ? getOtherUser(selectedChat) : undefined;
    const name = selectedChat ? getDisplayName(selectedChat) : 'Select a conversation';
    const profilePic = otherUser?.profile_pic ?? null;
    const rating = otherUser?.averageRating ?? null;
    const reviewCount = otherUser?.totalReviews ?? null;
    const isVerified = otherUser?.kyc_status === 'ACTIVE';
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
                    <div className="flex size-10 md:size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D1D5DC] font-semibold text-white text-base md:text-lg">
                        {selectedChat && profilePic ? (
                            <ImageComponent url={profilePic} img_title={name} />
                        ) : (
                            getInitial(name)
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                            <h2 className="font-bold text-fontBlack text-sm md:text-base truncate">{name}</h2>
                            {selectedChat && (
                                <>
                                    {isVerified ? <p className="inline-flex items-center gap-1 rounded-full border border-[#BEDBFF] bg-[#EFF6FF] px-2 py-1 text-xs font-medium text-[#1447E6]">
                                        <VerifiedShieldIconSVG />
                                        Verified
                                    </p> :
                                        <p className="inline-flex items-center gap-1 rounded-full border border-[#BEDBFF] bg-[#EFF6FF] px-2 py-1 text-xs font-medium text-[#1447E6]">
                                            Not Verified
                                        </p>}
                                    {(rating != null || reviewCount != null) && (
                                        <p className="inline-flex items-center gap-1 text-sm ">
                                            <StarRatingIconSVG />
                                            {rating ?? '—'} <span className="text-darkSilver">({reviewCount ?? 0})</span>
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                        {selectedChat && (
                            isTyping ? (
                                <p className="flex items-center gap-1.5 text-xs font-medium text-[#00A63E]">
                                    <span className="flex items-end gap-0.75 h-3">
                                        <span className="inline-block w-1 h-1 rounded-full bg-[#00A63E] animate-bounce [animation-delay:0ms]" />
                                        <span className="inline-block w-1 h-1 rounded-full bg-[#00A63E] animate-bounce [animation-delay:150ms]" />
                                        <span className="inline-block w-1 h-1 rounded-full bg-[#00A63E] animate-bounce [animation-delay:300ms]" />
                                    </span>
                                    typing...
                                </p>
                            ) : (
                                <p className={`flex items-center gap-1 text-xs font-medium ${isOnline ? 'text-[#00A63E]' : 'text-darkSilver'}`}>
                                    <span className={`inline-block size-1.5 rounded-full ${isOnline ? 'bg-[#00A63E]' : 'bg-darkSilver'}`} />
                                    {isOnline ? 'Active now' : 'Offline'}
                                </p>
                            )
                        )}
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
