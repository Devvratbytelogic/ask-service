'use client'

import React, { useMemo, useState } from 'react'
import { Accordion, AccordionItem, Tabs, Tab } from '@heroui/react'
import { HiPlus } from 'react-icons/hi2'
import { useGetFaqsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { IFaqItem } from '@/types/faqs'

const FAQ_TAB_TYPES = [
  { key: 'general', label: 'General' },
  { key: 'payments', label: 'Payments' },
  { key: 'licensing', label: 'Licensing' },
  { key: 'support', label: 'Assistance' },
] as const

function FaqAccordion({ items }: { items: IFaqItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-darkSilver py-4">No FAQs in this category yet.</p>
    )
  }
  return (
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
      {items.map((item) => (
        <AccordionItem
          key={item._id}
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
  )
}

export default function ContactFaq() {
  const [activeTab, setActiveTab] = useState<string>('general')
  const { data, isLoading, isError } = useGetFaqsQuery({ type: activeTab })

  const categoriesByType = useMemo(() => {
    const list = data?.data?.list ?? []
    const map = new Map<string, IFaqItem[]>()
    for (const cat of list) {
      const existing = map.get(cat.type) ?? []
      const faqs = (cat.faqs ?? []).filter((f) => f.status !== false)
      map.set(cat.type, [...existing, ...faqs])
    }
    return map
  }, [data?.data?.list])

  if (isLoading) {
    return (
      <div className="w-full md:w-2/4 md:mx-auto py-8 flex justify-center">
        <div className="animate-pulse space-y-3 w-full">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-[#E5E7EB]" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full md:w-2/4 md:mx-auto py-6 text-center text-darkSilver text-sm">
        Unable to load FAQs. Please try again later.
      </div>
    )
  }

  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => setActiveTab(key as string)}
      variant="light"
      classNames={{
        base: 'w-full md:w-2/4 md:mx-auto flex justify-center items-center',
        tabList: 'mb-6 gap-0 p-1 rounded-full bg-[#F3F4F6] w-full flex w-full',
        tab: 'rounded-full p-6 text-sm font-normal text-darkSilver data-[selected=true]:text-fontBlack',
        cursor: 'rounded-full bg-white shadow-sm',
      }}
    >
      {FAQ_TAB_TYPES.map((tab) => (
        <Tab key={tab.key} title={tab.label}>
          <FaqAccordion items={categoriesByType.get(tab.key) ?? []} />
        </Tab>
      ))}
    </Tabs>
  )
}
