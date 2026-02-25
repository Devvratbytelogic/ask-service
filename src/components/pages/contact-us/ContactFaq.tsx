'use client'

import React, { useState } from 'react'
import { Accordion, AccordionItem, Tabs, Tab } from '@heroui/react'
import { HiPlus } from 'react-icons/hi2'

const FAQ_BY_CATEGORY: Record<string, { question: string; answer: string }[]> = {
  general: [
    { question: 'Why do I need a UI Kit / design system?', answer: 'A UI Kit helps maintain consistency across your product and speeds up development with reusable components.' },
    { question: 'How do I get started with the design system?', answer: 'Install the package, follow the setup guide, and start using components in your project.' },
    { question: 'Can I customize the components?', answer: 'Yes, all components are built to be themed and extended to match your brand.' },
    { question: 'Is there support for dark mode?', answer: 'Yes, our design system supports light and dark themes out of the box.' },
    { question: 'What browsers are supported?', answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge.' },
  ],
  payments: [
    { question: 'What payment methods do you accept?', answer: 'We accept major credit cards, debit cards, and digital wallets.' },
    { question: 'When will I be charged?', answer: 'Charges are processed at the time of purchase or as per your subscription plan.' },
    { question: 'How do I get a refund?', answer: 'Contact support with your order details to request a refund within our policy window.' },
  ],
  licensing: [
    { question: 'What license do I get with my purchase?', answer: 'You receive a commercial license for use in your projects.' },
    { question: 'Can I use this in client projects?', answer: 'Yes, the license allows use in client work and commercial products.' },
    { question: 'Is there a team or enterprise license?', answer: 'Yes, contact us for team and enterprise pricing.' },
  ],
  support: [
    { question: 'How do I contact support?', answer: 'Use the contact form on this page or email support@example.com.' },
    { question: 'What are your response times?', answer: 'We aim to respond within 24 hours on business days.' },
    { question: 'Do you offer technical implementation help?', answer: 'Yes, we can provide guidance and best practices for implementation.' },
  ],
}

const FAQ_TABS = [
  { key: 'general', label: 'General' },
  { key: 'payments', label: 'Payments' },
  { key: 'licensing', label: 'Licensing' },
  { key: 'support', label: 'Support' },
] as const

export default function ContactFaq() {
  const [activeTab, setActiveTab] = useState<string>('general')
  const items = FAQ_BY_CATEGORY[activeTab] ?? FAQ_BY_CATEGORY.general

  return (
    <>
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        variant="light"
        classNames={{
          base: 'w-full md:w-2/4 md:mx-auto flex justify-center items-center',
          tabList: 'mb-6 gap-0 p-1 rounded-full bg-[#F3F4F6] w-full flex w-full',
          tab: 'rounded-full p-6 text-sm font-normal text-darkSilver data-[selected=true]:text-fontBlack',
          cursor: 'rounded-full bg-white shadow-sm',
          // panel: 'md:pt-6',
        }}
      >
        {FAQ_TABS.map((tab) => (
          <Tab key={tab.key} title={tab.label}>
            <Accordion
              selectionMode="single"
              showDivider={false}
              itemClasses={{
                base: 'rounded-xl border border-[#E5E7EB] bg-white mb-3 last:mb-0 overflow-hidden shadow-none',
                title: 'text-sm font-normal text-fontBlack text-left',
                trigger: 'px-4 py-4 min-h-0 cursor-pointer data-[hover=true]:bg-transparent',
                content: 'px-4 pb-4 pt-0 text-darkSilver text-sm',
                indicator: 'text-fontBlack',
              }}
              className="gap-0 p-0"
            >
              {items.map((item, index) => (
                <AccordionItem
                  key={`${activeTab}-${index}`}
                  title={item.question}
                  aria-label={item.question}
                  indicator={({ isOpen }) => (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-fontBlack">
                      <HiPlus className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
                    </span>
                  )}
                >
                  {item.answer}
                </AccordionItem>
              ))}
            </Accordion>
          </Tab>
        ))}
      </Tabs>
    </>

  )
}
