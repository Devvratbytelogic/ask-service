'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/appStore';
import { useGetUserAllMessagesQuery, useGetVendorAllMessagesQuery } from '@/redux/rtkQueries/clientSideGetApis';
import { getUserId } from '@/utils/authCookies';

interface MessagesChatBoxProps {
    selectedChatId: string | null;
}

// Shape we expect from API for a single message (backend may vary)
interface ChatMessageRow {
    _id?: string;
    content?: string;
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

export default function MessagesChatBox({ selectedChatId }: MessagesChatBoxProps) {
    const role = useSelector((state: RootState) => state.auth.userRole);
    const isVendor = (role ?? '').toLowerCase() === 'vendor';
    const currentUserId = getUserId();

    const { data: userMessages, isLoading: userLoading } = useGetUserAllMessagesQuery(
        { chatId: selectedChatId! },
        { skip: !selectedChatId || isVendor }
    );
    const { data: vendorMessages, isLoading: vendorLoading } = useGetVendorAllMessagesQuery(
        { chatId: selectedChatId! },
        { skip: !selectedChatId || !isVendor }
    );

    const messagesData = isVendor ? vendorMessages : userMessages;
    const isLoading = isVendor ? vendorLoading : userLoading;
    const messages = (messagesData?.data?.messages as ChatMessageRow[] | undefined) ?? [];

    if (!selectedChatId) {
        return (
            <div className="flex flex-1 items-center justify-center py-12 text-center">
                <p className="text-sm text-darkSilver">Select a conversation to view messages</p>
            </div>
        );
    }

    if (isLoading) {
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

    return (
        <>
            {messages.map((msg) => {
                const senderId = typeof msg.sender === 'object' && msg.sender?._id != null
                    ? String((msg.sender as { _id?: string })._id)
                    : null;
                const isYou = msg.isSentByMe ?? (currentUserId != null && senderId === currentUserId);
                const senderName = isYou ? 'You' : getSenderDisplay(msg.sender);
                const initial = getInitial(senderName);
                const time = formatTime(msg.createdAt);
                const text = msg.content ?? '';

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
                            <div className="rounded-2xl rounded-tr-md bg-primaryColor px-4 py-2.5 text-sm text-white">
                                {text}
                            </div>
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
                            <div className="rounded-2xl rounded-tl-md bg-[#F3F4F6] px-4 py-2.5 text-sm text-fontBlack">
                                {text}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
