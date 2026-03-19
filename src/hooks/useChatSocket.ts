'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { io, type Socket } from 'socket.io-client';
import { clientSideGetApis } from '@/redux/rtkQueries/clientSideGetApis';
import { SOCKET_URL } from '@/utils/config';
import type { AppDispatch } from '@/redux/appStore';
import type { MessagesEntity } from '@/types/allChatsMessages';
import type { LatestMessage } from '@/types/allChatList';

/** Socket message payload (server may send slightly different shape) */
export interface SocketMessage {
  _id?: string;
  sender?: { _id?: string; first_name?: string; last_name?: string; profile_pic?: string };
  content?: string;
  chat?: { _id?: string } | string;
  type?: string;
  media_url?: string | null;
  createdAt?: string;
  updatedAt?: string;
  users?: string[];
}

/** Payload for emitting "new message" (e.g. from send-msg API response) */
export type NewMessagePayload = SocketMessage;

function getChatIdFromMessage(msg: SocketMessage): string | null {
  const chat = msg.chat;
  if (!chat) return null;
  return typeof chat === 'string' ? chat : chat._id ?? null;
}

function normalizeToMessagesEntity(msg: SocketMessage, currentUserId: string | undefined): MessagesEntity {
  const sender = msg.sender ?? {};
  const senderId = sender._id ?? '';
  return {
    _id: msg._id ?? `socket-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    sender: {
      _id: senderId,
      first_name: sender.first_name ?? '',
      last_name: sender.last_name ?? '',
      profile_pic: sender.profile_pic ?? undefined,
      id: senderId,
    },
    content: msg.content ?? '',
    media_url: msg.media_url ?? null,
    chat: typeof msg.chat === 'object' && msg.chat ? { _id: msg.chat._id ?? '', chatName: '', isGroupChat: false, quote_id: '', createdAt: '', updatedAt: '', __v: 0, latestMessage: '', id: msg.chat._id ?? '' } as MessagesEntity['chat'] : { _id: String(msg.chat), chatName: '', isGroupChat: false, quote_id: '', createdAt: '', updatedAt: '', __v: 0, latestMessage: '', id: String(msg.chat) } as MessagesEntity['chat'],
    type: msg.type ?? 'text',
    readBy: null,
    reactions: null,
    createdAt: msg.createdAt ?? new Date().toISOString(),
    updatedAt: msg.updatedAt ?? new Date().toISOString(),
    __v: 0,
    reactionCounts: {},
  };
}

function normalizeToLatestMessage(msg: SocketMessage): LatestMessage {
  const sender = msg.sender ?? {};
  const senderId = sender._id ?? '';
  return {
    _id: msg._id ?? '',
    sender: {
      _id: senderId,
      first_name: sender.first_name ?? '',
      last_name: sender.last_name ?? '',
      profile_pic: sender.profile_pic ?? '',
      id: senderId,
    },
    content: msg.content ?? '',
    chat: getChatIdFromMessage(msg) ?? '',
    type: msg.type ?? 'text',
    media_url: msg.media_url ?? null,
    readBy: null,
    reactions: null,
    createdAt: msg.createdAt ?? new Date().toISOString(),
    updatedAt: msg.updatedAt ?? new Date().toISOString(),
    __v: 0,
  };
}

export interface UseChatSocketOptions {
  userId: string | undefined;
  userDisplayName: string;
  selectedChatId: string | null;
  isVendor: boolean;
}

/**
 * Connects to the chat socket, runs setup and join chat, and updates RTK Query
 * cache on "message recieved" so the UI updates in real time without refetching.
 * Also exposes emitNewMessage so the server can broadcast when we send (REST + socket).
 */
const MESSAGE_RECEIVED_EVENT = 'message recieved';
const MESSAGE_RECEIVED_ALT = 'message received';
const NEW_MESSAGE_EVENT = 'new message';
const DISCONNECT_DELAY_MS = 200;

export function useChatSocket({ userId, userDisplayName, selectedChatId, isVendor }: UseChatSocketOptions) {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | null>(null);
  const joinedChatIdRef = useRef<string | null>(null);
  const selectedChatIdRef = useRef<string | null>(selectedChatId);
  const disconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  selectedChatIdRef.current = selectedChatId;

  const emitNewMessage = useCallback((payload: NewMessagePayload) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(NEW_MESSAGE_EVENT, payload);
      if (process.env.NODE_ENV === 'development') {
        console.log('[ChatSocket] Emitted new message', payload.content);
      }
    }
  }, []);

  /** Update RTK cache with a message we just sent so fetch-chats and all-messages are not refetched. Also clear unread for this chat since we're viewing it. */
  const addSentMessageToCache = useCallback(
    (payload: NewMessagePayload, chatId: string) => {
      const normalized = normalizeToMessagesEntity(payload, userId);
      const latest = normalizeToLatestMessage(payload);

      if (isVendor) {
        dispatch(
          clientSideGetApis.util.updateQueryData('getVendorAllMessages', { chatId, index: 1 }, (draft) => {
            if (!draft?.data?.messages) return;
            const exists = draft.data.messages.some((m) => m._id === normalized._id);
            if (!exists) draft.data.messages.push(normalized);
          })
        );
        dispatch(
          clientSideGetApis.util.updateQueryData('getVendorChats', undefined, (draft) => {
            if (!draft?.data || !Array.isArray(draft.data)) return;
            const chat = draft.data.find((c) => c._id === chatId);
            if (chat) {
              (chat as { latestMessage?: LatestMessage }).latestMessage = latest;
              (chat as { unreadCount?: number }).unreadCount = 0;
            }
          })
        );
      } else {
        dispatch(
          clientSideGetApis.util.updateQueryData('getUserAllMessages', { chatId, index: 1 }, (draft) => {
            if (!draft?.data?.messages) return;
            const exists = draft.data.messages.some((m) => m._id === normalized._id);
            if (!exists) draft.data.messages.push(normalized);
          })
        );
        dispatch(
          clientSideGetApis.util.updateQueryData('getUserChats', undefined, (draft) => {
            if (!draft?.data || !Array.isArray(draft.data)) return;
            const chat = draft.data.find((c) => c._id === chatId);
            if (chat) {
              (chat as { latestMessage?: LatestMessage }).latestMessage = latest;
              (chat as { unreadCount?: number }).unreadCount = 0;
            }
          })
        );
      }
    },
    [dispatch, isVendor, userId]
  );

  /** Clear unread count for a chat in the RTK cache (e.g. when user opens that chat). */
  const clearUnreadForChat = useCallback(
    (chatId: string) => {
      if (isVendor) {
        dispatch(
          clientSideGetApis.util.updateQueryData('getVendorChats', undefined, (draft) => {
            if (!draft?.data || !Array.isArray(draft.data)) return;
            const chat = draft.data.find((c) => c._id === chatId);
            if (chat) (chat as { unreadCount?: number }).unreadCount = 0;
          })
        );
      } else {
        dispatch(
          clientSideGetApis.util.updateQueryData('getUserChats', undefined, (draft) => {
            if (!draft?.data || !Array.isArray(draft.data)) return;
            const chat = draft.data.find((c) => c._id === chatId);
            if (chat) (chat as { unreadCount?: number }).unreadCount = 0;
          })
        );
      }
    },
    [dispatch, isVendor]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !userId) return;

    if (disconnectTimeoutRef.current) {
      clearTimeout(disconnectTimeoutRef.current);
      disconnectTimeoutRef.current = null;
    }

    let socket = socketRef.current;
    if (!socket || !socket.connected) {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
      socket = io(SOCKET_URL, { transports: ['websocket'], autoConnect: true });
      socketRef.current = socket;
    } else {
      socket.off('connect');
      socket.off(MESSAGE_RECEIVED_EVENT);
      socket.off(MESSAGE_RECEIVED_ALT);
      socket.off('connect_error');
    }

    socket.on('connect', () => {
      socket.emit('setup', { id: userId, name: userDisplayName });
      const chatId = selectedChatIdRef.current;
      if (chatId) {
        joinedChatIdRef.current = chatId;
        socket.emit('join chat', chatId);
        if (process.env.NODE_ENV === 'development') {
          console.log('[ChatSocket] Connected and joined chat', chatId);
        }
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('[ChatSocket] Connected to', SOCKET_URL);
      }
    });

    const handleMessageReceived = (message: SocketMessage) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[ChatSocket] message recieved', message);
      }
      const chatId = getChatIdFromMessage(message);
      if (!chatId) return;

      const normalized = normalizeToMessagesEntity(message, userId);
      const latest = normalizeToLatestMessage(message);

      if (isVendor) {
        dispatch(
          clientSideGetApis.util.updateQueryData('getVendorAllMessages', { chatId, index: 1 }, (draft) => {
            if (!draft?.data?.messages) return;
            const exists = draft.data.messages.some((m) => m._id === normalized._id);
            if (!exists) draft.data.messages.push(normalized);
          })
        );
        dispatch(
          clientSideGetApis.util.updateQueryData('getVendorChats', undefined, (draft) => {
            if (!draft?.data || !Array.isArray(draft.data)) return;
            const chat = draft.data.find((c) => c._id === chatId);
            if (chat) {
              (chat as { latestMessage?: LatestMessage }).latestMessage = latest;
              const senderId = message.sender?._id;
              if (senderId && senderId !== userId) {
                (chat as { unreadCount?: number }).unreadCount = ((chat as { unreadCount?: number }).unreadCount ?? 0) + 1;
              }
            }
          })
        );
      } else {
        dispatch(
          clientSideGetApis.util.updateQueryData('getUserAllMessages', { chatId, index: 1 }, (draft) => {
            if (!draft?.data?.messages) return;
            const exists = draft.data.messages.some((m) => m._id === normalized._id);
            if (!exists) draft.data.messages.push(normalized);
          })
        );
        dispatch(
          clientSideGetApis.util.updateQueryData('getUserChats', undefined, (draft) => {
            if (!draft?.data || !Array.isArray(draft.data)) return;
            const chat = draft.data.find((c) => c._id === chatId);
            if (chat) {
              (chat as { latestMessage?: LatestMessage }).latestMessage = latest;
              const senderId = message.sender?._id;
              if (senderId && senderId !== userId) {
                (chat as { unreadCount?: number }).unreadCount = ((chat as { unreadCount?: number }).unreadCount ?? 0) + 1;
              }
            }
          })
        );
      }
    };

    socket.on(MESSAGE_RECEIVED_EVENT, handleMessageReceived);
    socket.on(MESSAGE_RECEIVED_ALT, handleMessageReceived);

    /** When backend marks messages as read it emits message:seen:update. Clear unread for that chat if chatId is in payload (backend should send it). */
    const handleMessageSeenUpdate = (payload: { messageId?: string; userId?: string; chatId?: string }) => {
      const chatId = payload.chatId ?? selectedChatIdRef.current;
      if (chatId && payload.userId === userId) {
        if (isVendor) {
          dispatch(
            clientSideGetApis.util.updateQueryData('getVendorChats', undefined, (draft) => {
              const chat = draft?.data?.find((c) => c._id === chatId);
              if (chat) (chat as { unreadCount?: number }).unreadCount = 0;
            })
          );
        } else {
          dispatch(
            clientSideGetApis.util.updateQueryData('getUserChats', undefined, (draft) => {
              const chat = draft?.data?.find((c) => c._id === chatId);
              if (chat) (chat as { unreadCount?: number }).unreadCount = 0;
            })
          );
        }
      }
    };
    socket.on('message:seen:update', handleMessageSeenUpdate);

    socket.on('connect_error', (err) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[ChatSocket] Connection error', err.message);
      }
    });

    return () => {
      socket.off(MESSAGE_RECEIVED_EVENT, handleMessageReceived);
      socket.off(MESSAGE_RECEIVED_ALT, handleMessageReceived);
      socket.off('message:seen:update', handleMessageSeenUpdate);
      disconnectTimeoutRef.current = setTimeout(() => {
        socket.removeAllListeners();
        socket.disconnect();
        socketRef.current = null;
        joinedChatIdRef.current = null;
        disconnectTimeoutRef.current = null;
      }, DISCONNECT_DELAY_MS);
    };
  }, [userId, userDisplayName, isVendor, dispatch]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket?.connected || !selectedChatId) return;
    if (joinedChatIdRef.current === selectedChatId) return;
    joinedChatIdRef.current = selectedChatId;
    socket.emit('join chat', selectedChatId);
    if (process.env.NODE_ENV === 'development') {
      console.log('[ChatSocket] Joined chat', selectedChatId);
    }
  }, [selectedChatId]);

  /** When user opens a chat, clear its unread count in the cache so the badge disappears. */
  useEffect(() => {
    if (selectedChatId) clearUnreadForChat(selectedChatId);
  }, [selectedChatId, clearUnreadForChat]);

  return { emitNewMessage, addSentMessageToCache };
}
