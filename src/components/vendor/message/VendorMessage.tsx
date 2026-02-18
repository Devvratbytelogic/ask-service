'use client';
import React, { useState } from 'react';
import { Button } from '@heroui/react';
import MessagesList from './MessagesList';
import ChatHeader from './ChatHeader';
import DiscussionContextBar from './DiscussionContextBar';
import MessagesChatBox from './MessagesChatBox';
import { EmojiIconSVG, PaperClipIconSVG, PhotographIconSVG, SendIconSVG } from '@/components/library/AllSVG';

export default function VendorMessage() {
  const [messageInput, setMessageInput] = useState('');
  // On mobile: show list or chat. On lg+: always show both
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  return (
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
        <MessagesList onSelectConversation={() => setMobileView('chat')} />
      </aside>

      {/* Main chat area */}
      <main
        className={`
          flex min-h-0 flex-1 flex-col min-w-0 bg-customWhite
          absolute lg:relative inset-0 z-10 lg:z-auto
          ${mobileView === 'chat' ? 'flex' : 'hidden lg:flex'}
        `}
      >
        {/* Chat header */}
        <header>
          <ChatHeader onBack={() => setMobileView('list')} />
        </header>

        {/* Discussion context bar */}
        <div className="shrink-0 bg-[#EFF6FF] px-4 py-3 md:px-6 md:py-3">
          <DiscussionContextBar />
        </div>

        {/* Messages - scrollable, leaves room for input */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
          <MessagesChatBox />
        </div>

        {/* Message input - always visible at bottom, compact on mobile */}
        <div className="shrink-0 border-t border-borderColor bg-white px-4 py-3 md:px-6 md:py-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              isIconOnly
              aria-label="Attach file"
              className="btn_radius btn_bg_white hidden sm:flex"
            >
              <PaperClipIconSVG />
            </Button>
            <Button
              isIconOnly
              aria-label="Send image"
              className="btn_radius btn_bg_white hidden sm:flex"
            >
              <PhotographIconSVG />
            </Button>
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 rounded-full border border-borderDark bg-[#F9FAFB] px-3 py-2 sm:px-4 sm:py-2.5">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
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
            >
              <span className="sm:hidden inline-flex"><SendIconSVG /></span>
              <span className="hidden sm:flex sm:items-center sm:gap-2">
                <SendIconSVG />
                Send
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
