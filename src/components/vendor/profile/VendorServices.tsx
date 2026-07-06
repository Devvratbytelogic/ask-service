'use client'

import React from 'react'
import { Accordion, AccordionItem } from '@heroui/react'
import { ChevronDownIconSVG } from '@/components/library/AllSVG'
import { IVendorDetailsAPIResponseDataVendor } from '@/types/vendorDetails'



interface VendorServicesProps {
    profile?: IVendorDetailsAPIResponseDataVendor | null
}

export default function VendorServices({ profile }: VendorServicesProps) {
    const services = profile?.service
        ? (Array.isArray(profile.service) ? profile.service : [profile.service]).map((service) => ({
            key: service.id ?? service._id,
            title: service.title,
            description: service.description || '',
        }))
        : [];
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-fontBlack">Services</h2>

            <Accordion
                // variant="bordered"
                selectionMode="single"
                defaultExpandedKeys={services[0] ? [services[0].key] : ['private-security']}
                showDivider={false}
                itemClasses={{
                    base: 'rounded-xl bg-appCard px-4 shadow-none',
                    title: 'font-bold text-fontBlack py-4',
                    trigger: 'py-0 min-h-0 cursor-pointer data-[hover=true]:bg-transparent',
                    content: 'pb-4 pt-0',
                    indicator: 'text-darkSilver',
                }}
                className="gap-3 overflow-visible p-0"
            >
                {services.map((service) => (
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
                            base: 'rounded-xl border border-appBorder bg-appCard mb-3 px-3',
                            content: 'border-t border-appBorder py-4',
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
