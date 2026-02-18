'use client'

import React from 'react'
import { Accordion, AccordionItem } from '@heroui/react'
import { ChevronDownIconSVG } from '@/components/library/AllSVG'

const SERVICES = [
    {
        key: 'private-security',
        title: 'private security guard',
        description: 'Professional security guards for events, businesses, and residential properties.',
    },
    {
        key: 'fire-safety',
        title: 'fire safety officer',
        description: 'Trained fire safety officers to ensure compliance and emergency preparedness at your premises.',
    },
    {
        key: 'isolated-workers',
        title: 'protection of isolated workers',
        description: 'Dedicated support and monitoring for staff working alone or in remote locations.',
    },
    {
        key: 'night-surveillance',
        title: 'Night surveillance',
        description: 'Around-the-clock night surveillance and patrol services for your property.',
    },
]

export default function VendorServices() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-fontBlack">Services</h2>

            <Accordion
                // variant="bordered"
                selectionMode="single"
                defaultExpandedKeys={['private-security']}
                showDivider={false}
                itemClasses={{
                    base: 'rounded-xl bg-white px-4 shadow-none',
                    title: 'font-bold text-fontBlack py-4',
                    trigger: 'py-0 min-h-0 cursor-pointer data-[hover=true]:bg-transparent',
                    content: 'pb-4 pt-0',
                    indicator: 'text-darkSilver',
                }}
                className="gap-3 overflow-visible p-0"
            >
                {SERVICES.map((service) => (
                    <AccordionItem
                        key={service.key}
                        title={service.title}
                        aria-label={service.title}
                        indicator={({ isOpen }) => (
                            <span className={`inline-flex text-darkSilver transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                                <ChevronDownIconSVG />
                            </span>
                        )}
                        classNames={{
                            base: 'rounded-xl border border-[#E5E7EB] bg-white mb-3 px-3',
                            content: 'border-t border-[#E5E7EB] py-4',
                        }}
                    >
                        <p className="text-sm text-darkSilver leading-relaxed">
                            {service.description}
                        </p>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
