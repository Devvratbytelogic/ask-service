'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { SearchIconSVG } from '@/components/library/AllSVG';
import { Button, Input } from '@heroui/react';
import { useGetUserChatsQuery, useGetVendorChatsQuery } from '@/redux/rtkQueries/clientSideGetApis';
import type { IAllChatListData, UsersEntity } from '@/types/allChatList';
import ImageComponent from '@/components/library/ImageComponent';
import { getUserRole } from '@/utils/authCookies';

const LOADING_TIMEOUT_MS = 10_000;

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

function getFileNameFromUrl(url: string): string {
    try {
        const path = (url || '').split('?')[0];
        const name = path.split('/').pop();
        return name && name.length > 0 ? decodeURIComponent(name) : '';
    } catch {
        return '';
    }
}

function getLastMessage(chat: IAllChatListData): string {
    const latest = chat.latestMessage as {
        content?: string;
        type?: string;
        media_url?: string | null;
    } | null | undefined;
    if (!latest) return 'Aucun message';
    const content = typeof latest.content === 'string' ? latest.content.trim() : '';
    const type = (latest.type ?? 'text').toLowerCase();
    const mediaUrl = latest.media_url ?? '';
    // Media message: show file name or a short label (content is often empty or opaque)
    if (type === 'media' && mediaUrl) {
        const fileName = getFileNameFromUrl(mediaUrl);
        if (fileName) return fileName;
        return 'Pièce jointe';
    }
    if (content) return content;
    return 'Aucun message';
}

interface MessagesListProps {
    onSelectConversation?: (chat: IAllChatListData) => void;
    selectedChatId?: string | null;
}

export default function MessagesList({
    onSelectConversation,
    selectedChatId = null,
}: MessagesListProps) {
    const [search, setSearch] = useState('');
    const [timedOut, setTimedOut] = useState(false);
    const [loadAttempt, setLoadAttempt] = useState(0);
    const role = getUserRole();
    const isVendor = (role ?? '').toLowerCase() === 'vendor';

    const {
        data: userData,
        isLoading: userLoading,
        isFetching: userFetching,
        isError: userError,
        refetch: refetchUserChats,
    } = useGetUserChatsQuery(undefined, { skip: isVendor });
    const {
        data: vendorData,
        isLoading: vendorLoading,
        isFetching: vendorFetching,
        isError: vendorError,
        refetch: refetchVendorChats,
    } = useGetVendorChatsQuery(undefined, { skip: !isVendor });

    const rawChats = isVendor ? vendorData?.data : userData?.data ?? null;
    const chats = Array.isArray(rawChats) ? rawChats : [];
    const isLoading = isVendor ? vendorLoading : userLoading;
    const isFetching = isVendor ? vendorFetching : userFetching;
    const isError = isVendor ? vendorError : userError;
    const refetch = isVendor ? refetchVendorChats : refetchUserChats;

    // Treat prolonged in-flight requests (e.g. hung 503) as a failure so the spinner cannot spin forever.
    const waitingForChats = (isLoading || isFetching) && chats.length === 0 && !isError;
    useEffect(() => {
        if (!waitingForChats) {
            setTimedOut(false);
            return;
        }
        setTimedOut(false);
        const timer = window.setTimeout(() => setTimedOut(true), LOADING_TIMEOUT_MS);
        return () => window.clearTimeout(timer);
    }, [waitingForChats, loadAttempt]);

    const showError = isError || timedOut;
    const showLoading = waitingForChats && !timedOut;

    const handleRetry = () => {
        setTimedOut(false);
        setLoadAttempt((n) => n + 1);
        void refetch();
    };

    const filtered = useMemo(() => {
        if (!search.trim()) return chats;
        const q = search.trim().toLowerCase();
        return chats.filter((c) => {
            const name = getDisplayName(c).toLowerCase();
            const msg = getLastMessage(c).toLowerCase();
            return name.includes(q) || msg.includes(q);
        });
    }, [chats, search]);

    return (
        <>
            <div className="border-b border-borderColor p-3 md:p-4">
                <div className="mb-4">
                    <h1 className="font-bold text-fontBlack">Messages</h1>
                </div>
                <div className="relative">
                    <Input
                        type="text"
                        name="search"
                        variant="bordered"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        classNames={{
                            inputWrapper: [
                                'custom_input_design shadow-none btn_radius px-3! border-borderColor!',
                            ],
                        }}
                        placeholder="Rechercher"
                        startContent={<SearchIconSVG />}
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                {showLoading && (
                    <div className="flex items-center justify-center py-8 text-sm text-darkSilver">
                        Chargement des conversations...
                    </div>
                )}
                {showError && (
                    <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
                        <p className="text-sm text-red-600">
                            Impossible de charger les conversations.
                        </p>
                        <p className="text-xs text-darkSilver">
                            Vérifiez votre connexion ou réessayez dans un instant.
                        </p>
                        <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={handleRetry}
                            isLoading={isFetching && !timedOut}
                        >
                            Réessayer
                        </Button>
                    </div>
                )}
                {!showLoading && !showError && filtered.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-darkSilver">
                        Aucune conversation pour l&apos;instant.
                    </div>
                )}
                {!showLoading && !showError &&
                    filtered.map((chat) => {
                        const name = getDisplayName(chat);
                        const profilePic = getOtherUser(chat)?.profile_pic ?? null;
                        const unread = Number(chat.unreadCount ?? 0) || 0;
                        return (
                            <button
                                key={chat._id}
                                type="button"
                                onClick={() => onSelectConversation?.(chat)}
                                className={`flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-borderDark/50 active:bg-borderDark/30 md:px-4 ${
                                    selectedChatId === chat._id ? 'bg-primaryColor/5' : ''
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-[#D1D5DC] border border-borderColor text-base font-semibold text-white">
                                        {profilePic ? (
                                            <ImageComponent url={profilePic} img_title={name} />
                                        ) : (
                                            getInitial(name)
                                        )}
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="truncate text-sm font-semibold text-fontBlack">
                                            {name}
                                        </span>
                                        {unread > 0 && (
                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primaryColor text-xs font-medium text-white">
                                                {unread}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 truncate text-xs font-medium text-darkSilver">
                                        {getLastMessage(chat)}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
            </div>
        </>
    );
}
