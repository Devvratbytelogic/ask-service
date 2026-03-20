'use client';
import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@heroui/react';
import MessagesList from './MessagesList';
import ChatHeader from './ChatHeader';
import DiscussionContextBar from './DiscussionContextBar';
import MessagesChatBox from './MessagesChatBox';
import { EmojiIconSVG, MessageIconSVG, PaperClipIconSVG, PhotographIconSVG, SendIconSVG } from '@/components/library/AllSVG';
import { useUserSendMessageMutation, useVendorSendMessageMutation } from '@/redux/rtkQueries/allPostApi';
import { useChatSocket, type NewMessagePayload } from '@/hooks/useChatSocket';
import { getUserId, getUserRole } from '@/utils/authCookies';
import type { RootState } from '@/redux/appStore';
import type { IAllChatListData } from '@/types/allChatList';

// Images and documents only — no video
const IMAGE_ACCEPT = 'image/*';
const DOCUMENT_ACCEPT = '.pdf,.doc,.docx';

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

function AttachedFilePreview({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const isImage = isImageFile(file);
  const [preview, setPreview] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isImage) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, isImage]);

  return (
    <div className="mb-2 flex items-center gap-3 rounded-lg border border-borderDark bg-[#F9FAFB] px-3 py-2">
      {isImage && preview ? (
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#E5E7EB]">
          <img
            src={preview}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E5E7EB] text-[#6B7280]">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </span>
      )}
      <span className="min-w-0 flex-1 truncate text-sm text-fontBlack">{file.name}</span>
      <Button
        size="sm"
        variant="light"
        className="min-w-0 shrink-0 text-darkSilver"
        onPress={onRemove}
        aria-label="Remove attachment"
      >
        Remove
      </Button>
    </div>
  );
}

export default function MessageLayout() {
  const [messageInput, setMessageInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  // On mobile: show list or chat. On lg+: always show both
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<IAllChatListData | null>(null);

  const role = getUserRole();
  const isVendor = (role ?? '').toLowerCase() === 'vendor';
  const userId = getUserId();
  const userDisplayName = isVendor ? 'Vendor' : 'User';

  const { emitNewMessage, addSentMessageToCache, emitMessageSeen, emitTyping, emitStopTyping, isOtherTyping, onlineUsers } = useChatSocket({
    userId,
    userDisplayName,
    selectedChatId,
    isVendor,
  });

  const otherUserId = selectedChat?.users?.find((u) => !u.itsMe)?._id;
  const isOtherUserOnline = Boolean(otherUserId && onlineUsers.has(otherUserId));

  // Debounced typing indicator — emit "stop typing" 2 s after the user stops pressing keys
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const handleInputChange = useCallback((value: string) => {
    setMessageInput(value);
    if (!selectedChatId) return;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitTyping(selectedChatId);
    }

    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    typingDebounceRef.current = setTimeout(() => {
      isTypingRef.current = false;
      emitStopTyping(selectedChatId);
    }, 2000);
  }, [selectedChatId, emitTyping, emitStopTyping]);

  const [userSendMessage, { isLoading: isUserSending }] = useUserSendMessageMutation();
  const [vendorSendMessage, { isLoading: isVendorSending }] = useVendorSendMessageMutation();
  const isSending = isUserSending || isVendorSending;

  const handleSelectConversation = (chat: IAllChatListData) => {
    setSelectedChat(chat);
    setSelectedChatId(chat._id);
    setMobileView('chat');
  };

  const canSend = Boolean(selectedChatId && (messageInput.trim() || attachedFile) && !isSending);

  const handleSendMessage = async () => {
    if (!selectedChatId || !canSend) return;
    const content = messageInput.trim();
    try {
      if (attachedFile) {
        const formData = new FormData();
        formData.append('chatId', selectedChatId);
        formData.append('content', content);
        formData.append('media', attachedFile);
        const result = isVendor
          ? await vendorSendMessage(formData).unwrap()
          : await userSendMessage(formData).unwrap();
        const payload = (result as { data?: unknown })?.data ?? result;
        if (payload && typeof payload === 'object') {
          const p = payload as NewMessagePayload;
          emitNewMessage(p);
          addSentMessageToCache(p, selectedChatId);
        }
        setAttachedFile(null);
        setMessageInput('');
      } else {
        const body = { chatId: selectedChatId, content, media: '' };
        const result = isVendor
          ? await vendorSendMessage(body).unwrap()
          : await userSendMessage(body).unwrap();
        const payload = (result as { data?: unknown })?.data ?? result;
        if (payload && typeof payload === 'object') {
          const p = payload as NewMessagePayload;
          emitNewMessage(p);
          addSentMessageToCache(p, selectedChatId);
        }
        setMessageInput('');
      }
    } catch {
      // Error can be handled via toast or inline UI if needed
    } finally {
      // Always stop typing indicator when message is sent or errored
      if (selectedChatId) {
        if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
        isTypingRef.current = false;
        emitStopTyping(selectedChatId);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAttachedFile(file);
    }
    e.target.value = '';
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith('video/')) {
      setAttachedFile(file);
    }
    e.target.value = '';
  };

  return (
    <>
      <div className="relative flex h-full min-h-0 overflow-hidden bg-white">
        {/* Left sidebar - Messages list: full width on mobile when active, fixed width on lg+ */}
        <aside
          className={`
            flex flex-col min-h-0 border-r border-borderColor bg-white
            absolute lg:relative inset-0 z-10 lg:z-auto
            w-full lg:w-[320px] lg:shrink-0
            ${mobileView === 'list' ? 'flex' : 'hidden lg:flex'}
          `}
        >
          <MessagesList
            selectedChatId={selectedChatId}
            onSelectConversation={handleSelectConversation}
          />
        </aside>

        {/* Main chat area */}
        <main
          className={`
            flex min-h-0 flex-1 flex-col min-w-0 bg-customWhite
            absolute lg:relative inset-0 z-10 lg:z-auto
            ${mobileView === 'chat' ? 'flex' : 'hidden lg:flex'}
          `}
        >
          {!selectedChatId ? (
            /* WhatsApp-style empty state when no chat selected */
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex flex-col items-center gap-4 max-w-sm">
                <div className="flex size-24 items-center justify-center rounded-full bg-primaryColor/10 text-primaryColor md:size-28">
                  <MessageIconSVG />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-fontBlack md:text-xl">
                    Select a chat to start messaging
                  </h2>
                  <p className="text-sm text-darkSilver">
                    Choose a conversation from the list or start a new one.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <header>
                <ChatHeader selectedChat={selectedChat} onBack={() => setMobileView('list')} isOnline={isOtherUserOnline} isTyping={isOtherTyping} />
              </header>

              {/* Discussion context bar */}
              {selectedChat?.quote_id && <div className="shrink-0 bg-[#EFF6FF] px-4 py-3 md:px-6 md:py-3">
                <DiscussionContextBar selectedChat={selectedChat} />
              </div>}

              {/* Messages - scrollable, leaves room for input */}
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
                <MessagesChatBox
                  selectedChatId={selectedChatId}
                  otherUserId={otherUserId}
                  onMessageSeen={emitMessageSeen}
                />
              </div>

              {/* Message input - WhatsApp-style: text, images & documents (no video) */}
              <div className="shrink-0 border-t border-borderColor bg-white px-4 py-3 md:px-6 md:py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept={IMAGE_ACCEPT}
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Upload image"
                />
                <input
                  ref={documentInputRef}
                  type="file"
                  accept={DOCUMENT_ACCEPT}
                  onChange={handleDocumentChange}
                  className="hidden"
                  aria-label="Upload document"
                />
                {attachedFile && (
                  <AttachedFilePreview
                    file={attachedFile}
                    onRemove={() => setAttachedFile(null)}
                  />
                )}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    isIconOnly
                    aria-label="Attach document"
                    className="btn_radius btn_bg_white hidden sm:flex"
                    onPress={() => documentInputRef.current?.click()}
                  >
                    <PaperClipIconSVG />
                  </Button>
                  <Button
                    isIconOnly
                    aria-label="Send image"
                    className="btn_radius btn_bg_white hidden sm:flex"
                    onPress={() => imageInputRef.current?.click()}
                  >
                    <PhotographIconSVG />
                  </Button>
                  <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 rounded-full border border-borderDark bg-[#F9FAFB] px-3 py-2 sm:px-4 sm:py-2.5">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="min-w-0 flex-1 bg-transparent text-sm text-fontBlack placeholder:text-placeHolderText focus:outline-none"
                    />
                  </div>
                  <Button
                    isIconOnly
                    aria-label="Emoji"
                    className="btn_radius btn_bg_white hidden sm:flex"
                  >
                    <EmojiIconSVG />
                  </Button>
                  <Button
                    variant="solid"
                    color="primary"
                    aria-label="Send"
                    className="btn_radius shrink-0 btn_bg_blue min-w-11 sm:min-w-0"
                    isDisabled={!canSend}
                    onPress={handleSendMessage}
                  >
                    <span className="sm:hidden inline-flex"><SendIconSVG /></span>
                    <span className="hidden sm:flex sm:items-center sm:gap-2">
                      <SendIconSVG />
                      Send
                    </span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
