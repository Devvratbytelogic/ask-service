'use client'
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BackArrowSVG, FlagIconSVG, ProfileIconSVG, StarRatingIconSVG, VerifiedShieldIconSVG, VerticalChatDotsSVG } from '@/components/library/AllSVG';
import type { IAllChatListData, UsersEntity } from '@/types/allChatList';
import ImageComponent from '@/components/library/ImageComponent';
import { getVendorProfileRoutePath } from '@/routes/routes';
import { useDispatch } from 'react-redux';
import { openModal } from '@/redux/slices/allModalSlice';
import { useRouter } from 'next/navigation';

function getOtherUser(chat: IAllChatListData): UsersEntity | undefined {
    return chat.users?.find((u) => !u.itsMe);
}

function getDisplayName(chat: IAllChatListData): string {
    const u = getOtherUser(chat);
    if (!u) return 'Inconnu';
    const isVendor = (u.role?.name ?? '').toLowerCase() === 'vendor';
    if (isVendor && u.business_name?.trim()) return u.business_name.trim();
    const first = (u.first_name ?? '').trim();
    const last = (u.last_name ?? '').trim();
    return [first, last].filter(Boolean).join(' ') || 'Inconnu';
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
    const dispatch = useDispatch();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const otherUser = selectedChat ? getOtherUser(selectedChat) : undefined;
    const name = selectedChat ? getDisplayName(selectedChat) : 'Sélectionnez une conversation';
    const profilePic = otherUser?.profile_pic ?? null;
    const rating = otherUser?.averageRating ?? null;
    const reviewCount = otherUser?.totalReviews ?? null;
    const isVerified = otherUser?.kyc_status === 'ACTIVE';
    const isVendor =
        !!otherUser && (otherUser.role?.name ?? '').toLowerCase() === 'vendor';
    const vendorProfileHref =
        selectedChat && otherUser && isVendor && otherUser._id
            ? getVendorProfileRoutePath(otherUser._id)
            : null;
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    const handleOpenReport = () => {
        setDropdownOpen(false);
        dispatch(openModal({
            componentName: 'ReportProfileModal',
            modalSize: 'lg',
            modalPadding: 'px-6 py-6',
            data: { vendorId: otherUser?._id },
        }));
    };

    const handleGoToProfile = () => {
        setDropdownOpen(false);
        if (vendorProfileHref) router.push(vendorProfileHref);
    };

    const avatarClassName =
        'flex size-10 md:size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#D1D5DC] font-semibold text-white text-base md:text-lg';
    const avatarInner =
        selectedChat && profilePic ? (
            <ImageComponent url={profilePic} img_title={name} />
        ) : (
            getInitial(name)
        );
    return (
        <>
            <div className="flex shrink-0 justify-between items-center gap-3 md:gap-4 border-b border-borderDark bg-white px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    {/* Back button - mobile only */}
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex shrink-0 items-center justify-center -ml-1 p-2 rounded-lg text-darkSilver hover:bg-borderDark hover:text-fontBlack transition-colors lg:hidden"
                            aria-label="Retour aux messages"
                        >
                            <BackArrowSVG />
                        </button>
                    )}
                    {vendorProfileHref ? (
                        <Link
                            href={vendorProfileHref}
                            className={`${avatarClassName} cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fontBlack`}
                            aria-label={`Voir le profil de ${name}`}
                        >
                            {avatarInner}
                        </Link>
                    ) : (
                        <div className={avatarClassName}>{avatarInner}</div>
                    )}
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                            <h2 className="font-bold text-fontBlack text-sm md:text-base truncate">{name}</h2>
                            {selectedChat && (
                                <>
                                    {isVerified ? <p className="inline-flex items-center gap-1 rounded-full border border-[#BEDBFF] bg-[#EFF6FF] px-2 py-1 text-xs font-medium text-[#1447E6]">
                                        <VerifiedShieldIconSVG />
                                        Vérifié
                                    </p> :
                                        <p className="inline-flex items-center gap-1 rounded-full border border-[#BEDBFF] bg-[#EFF6FF] px-2 py-1 text-xs font-medium text-[#1447E6]">
                                            Non vérifié
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
                                    en train d&apos;écrire…
                                </p>
                            ) : (
                                <p className={`flex items-center gap-1 text-xs font-medium ${isOnline ? 'text-[#00A63E]' : 'text-darkSilver'}`}>
                                    <span className={`inline-block size-1.5 rounded-full ${isOnline ? 'bg-[#00A63E]' : 'bg-darkSilver'}`} />
                                    {isOnline ? 'En ligne' : 'Hors ligne'}
                                </p>
                            )
                        )}
                    </div>
                </div>
                {selectedChat && (
                    <div className="relative flex shrink-0 items-center gap-2 cursor-pointer" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="rounded p-1.5 text-darkSilver hover:bg-borderDark cursor-pointer"
                            aria-label="Options"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                        >
                            <VerticalChatDotsSVG />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-borderDark bg-white py-1 shadow-lg">
                                {vendorProfileHref && (
                                    <button
                                        type="button"
                                        onClick={handleGoToProfile}
                                        className="cursor-pointer flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-fontBlack hover:bg-borderDark transition-colors"
                                    >
                                        <ProfileIconSVG />
                                        Profil
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleOpenReport}
                                    className="cursor-pointer flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#F04438] hover:bg-borderDark transition-colors"
                                >
                                    <FlagIconSVG />
                                    Signaler
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
