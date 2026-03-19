'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useGetUserAllMessagesQuery, useGetVendorAllMessagesQuery } from '@/redux/rtkQueries/clientSideGetApis';
import { getUserId, getUserRole } from '@/utils/authCookies';
import ImageComponent from '@/components/library/ImageComponent';

interface MessagesChatBoxProps {
    selectedChatId: string | null;
}

// Shape we expect from API for a single message (backend may vary)
interface ChatMessageRow {
    _id?: string;
    content?: string;
    media_url?: string | null;
    type?: string;
    sender?: { _id?: string; first_name?: string; last_name?: string } | string;
    createdAt?: string;
    isSentByMe?: boolean;
}

function getSenderDisplay(sender: ChatMessageRow['sender']): string {
    if (!sender) return 'Unknown';
    if (typeof sender === 'string') return sender;
    const first = sender.first_name ?? '';
    const last = sender.last_name ?? '';
    return [first, last].filter(Boolean).join(' ') || 'Unknown';
}

function getInitial(name: string): string {
    return name.trim().charAt(0)?.toUpperCase() || '?';
}

function formatTime(createdAt?: string): string {
    if (!createdAt) return '';
    try {
        const d = new Date(createdAt);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return '';
    }
}

function getDateLabel(dateStr: string): string {
    try {
        const d = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return '';
    }
}

function groupMessagesByDate(messages: ChatMessageRow[]): { dateLabel: string; messages: ChatMessageRow[] }[] {
    const groups: { dateLabel: string; messages: ChatMessageRow[] }[] = [];
    let lastDateLabel = '';
    for (const msg of messages) {
        const label = getDateLabel(msg.createdAt ?? '');
        if (label !== lastDateLabel) {
            groups.push({ dateLabel: label, messages: [] });
            lastDateLabel = label;
        }
        groups[groups.length - 1].messages.push(msg);
    }
    return groups;
}

// Resolve URL: backend may send media in media_url with empty content (e.g. type "media")
function getMediaUrl(msg: ChatMessageRow): string {
    const url = msg.media_url ?? msg.content ?? '';
    return typeof url === 'string' ? url.trim() : '';
}

function isImageUrl(url: string): boolean {
    return /\.(jpe?g|png|gif|webp|bmp)(\?|$)/i.test(url) || /\/image\//i.test(url);
}

function isVideoUrl(url: string): boolean {
    return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || /\/video\//i.test(url);
}

function getFileNameFromUrl(url: string, fallback: string): string {
    try {
        const path = url.split('?')[0];
        const name = path.split('/').pop();
        return name && name.length > 0 ? decodeURIComponent(name) : fallback;
    } catch {
        return fallback;
    }
}

// WhatsApp-style: text, image, video, and document with media_url support
function MessageContent({ msg, isYou }: { msg: ChatMessageRow; isYou: boolean }) {
    const type = (msg.type ?? 'text').toLowerCase();
    const content = (msg.content ?? '').trim();
    const mediaUrl = getMediaUrl(msg);
    const bubbleClass = isYou
        ? 'rounded-2xl rounded-tr-md bg-primaryColor text-white'
        : 'rounded-2xl rounded-tl-md bg-[#F3F4F6] text-fontBlack';

    // Image: type "image" or "media" with image URL — show thumbnail (not PDF/doc)
    const showAsImage =
        mediaUrl &&
        (type === 'image' || (type === 'media' && isImageUrl(mediaUrl)));
    if (showAsImage) {
        return (
            <div className={`overflow-hidden ${bubbleClass}`}>
                <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="relative max-w-60 min-h-30 sm:max-w-70">
                        <div className='w-full h-auto max-h-75'>
                            <ImageComponent
                                url={mediaUrl}
                                img_title="Shared image"
                                object_cover={true}
                                object_contain={false}
                            />
                        </div>
                    </div>
                </a>
            </div>
        );
    }

    // Video: type "video" or "media" with video URL — thumbnail + play icon like WhatsApp
    const showAsVideo = (type === 'video' && mediaUrl) || (type === 'media' && mediaUrl && isVideoUrl(mediaUrl));
    if (showAsVideo) {
        return (
            <div className={`overflow-hidden ${bubbleClass}`}>
                <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
                    <div className="relative max-w-60 min-h-30 sm:max-w-70 bg-black/20">
                        <video
                            src={mediaUrl}
                            className="object-cover w-full h-auto max-h-75"
                            preload="metadata"
                            muted
                            playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                            <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-primaryColor">
                                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </a>
            </div>
        );
    }

    // Document/File: type "file", "document", or "media" (non-image, non-video) — icon + name like WhatsApp
    const showAsFile =
        mediaUrl &&
        ((type === 'file' || type === 'document') || (type === 'media' && !isImageUrl(mediaUrl) && !isVideoUrl(mediaUrl)));
    if (showAsFile) {
        const fileName = content || getFileNameFromUrl(mediaUrl, 'Document');
        return (
            <a
                href={mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-2.5 text-sm ${bubbleClass} hover:opacity-90 min-w-0`}
            >
                <span className="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-black/10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </span>
                <span className="truncate min-w-0 flex-1">{fileName}</span>
                <span className="shrink-0 text-xs opacity-80">↗</span>
            </a>
        );
    }

    // Text or unknown
    return (
        <div className={`px-4 py-2.5 text-sm ${bubbleClass}`}>
            {content || '\u00A0'}
        </div>
    );
}

export default function MessagesChatBox({ selectedChatId }: MessagesChatBoxProps) {
    const role = getUserRole();
    const isVendor = (role ?? '').toLowerCase() === 'vendor';
    const currentUserId = getUserId();
    const scrollBottomRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(1);

    const { data: userMessages, isLoading: userLoading, isFetching: userFetching, } = useGetUserAllMessagesQuery(
        { chatId: selectedChatId!, index },
        { skip: !selectedChatId || isVendor }
    );
    const { data: vendorMessages, isLoading: vendorLoading, isFetching: vendorFetching, } = useGetVendorAllMessagesQuery(
        { chatId: selectedChatId!, index },
        { skip: !selectedChatId || !isVendor }
    );

    const messagesData = isVendor ? vendorMessages : userMessages;
    const isLoading = isVendor ? vendorLoading : userLoading;
    const isFetching = isVendor ? vendorFetching : userFetching;
    const rawMessages = (messagesData?.data?.messages as ChatMessageRow[] | undefined) ?? [];
    // Oldest at top, newest at bottom (ascending chronological order)
    const messages = [...rawMessages].sort((a, b) => {
        const tA = new Date(a.createdAt ?? 0).getTime();
        const tB = new Date(b.createdAt ?? 0).getTime();
        return tA - tB;
    });

    // Show loading when initial load OR when refetching (e.g. after switching chat).
    // This prevents showing the previous chat's messages while the new chat's request is pending.
    const showLoading = isLoading || isFetching;

    // WhatsApp-style: scroll to bottom when messages load or change
    useEffect(() => {
        if (messages.length > 0) {
            scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedChatId, messages.length]);

    if (!selectedChatId) {
        return (
            <div className="flex flex-1 items-center justify-center py-12 text-center">
                <p className="text-sm text-darkSilver">Select a conversation to view messages</p>
            </div>
        );
    }

    if (showLoading) {
        return (
            <div className="flex flex-1 items-center justify-center py-12">
                <p className="text-sm text-darkSilver">Loading messages...</p>
            </div>
        );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center py-12 text-center">
                <p className="text-sm text-darkSilver">No messages yet. Start the conversation.</p>
            </div>
        );
    }

    const grouped = groupMessagesByDate(messages);

    return (
        <div className="flex flex-col min-h-full">
            {/* <button onClick={() => setIndex(index + 1)}>Load more</button> */}
            {grouped.map(({ dateLabel, messages: groupMsgs }) => (
                <div key={dateLabel}>
                    <div className="flex justify-center my-3">
                        <span className="rounded-full bg-[#E5E7EB] px-3 py-1 text-xs text-fontBlack">
                            {dateLabel}
                        </span>
                    </div>
                    {groupMsgs.map((msg) => {
                        const senderId = typeof msg.sender === 'object' && msg.sender?._id != null
                            ? String((msg.sender as { _id?: string })._id)
                            : null;
                        const isYou = msg.isSentByMe ?? (currentUserId != null && senderId === currentUserId);
                        const senderName = isYou ? 'You' : getSenderDisplay(msg.sender);
                        const initial = getInitial(senderName);
                        const time = formatTime(msg.createdAt);

                        return isYou ? (
                            <div
                                key={msg._id ?? Math.random()}
                                className="mb-4 flex flex-row-reverse items-end gap-2"
                            >
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primaryColor text-xs font-semibold text-white">
                                    {initial}
                                </div>
                                <div className="flex max-w-[85%] sm:max-w-[75%] flex-col items-end">
                                    <span className="text-sm font-semibold text-fontBlack">
                                        {time}
                                        <span className="font-medium text-fontBlack">{senderName}</span>
                                    </span>
                                    <MessageContent msg={msg} isYou={true} />
                                </div>
                            </div>
                        ) : (
                            <div key={msg._id ?? Math.random()} className="mb-4 flex items-start gap-2">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#D1D5DC] text-xs font-semibold text-white">
                                    {initial}
                                </div>
                                <div className="flex max-w-[85%] sm:max-w-[75%] flex-col">
                                    <span className="mb-1 flex items-center gap-2 text-xs text-darkSilver">
                                        <span className="text-sm font-semibold text-fontBlack">
                                            {senderName}
                                        </span>
                                        {time}
                                    </span>
                                    <MessageContent msg={msg} isYou={false} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
            <div ref={scrollBottomRef} aria-hidden />
        </div>
    );
}
