'use client'

import { CheckGreenIconSVG, CreditCardIconSVG, DocumentArrowIconSVG, DocumentIconSVG, EnvelopeIconSVG, InfoBlueIconSVG, InfoSVG, LocationSVG, LockGreenIconSVG, LockPrimaryColorSVG, LockUnlockedIconSVG, ProfileIconSVG, SecurityIconSVG, SignOutIconSVG, TimeIconSVG } from '@/components/library/AllSVG'
import { generateLeadDetailRoutePath, getCreditsRoutePath, getVendorDashboardRoutePath } from '@/routes/routes'
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from '@heroui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import moment from 'moment'
import { MdKeyboardArrowDown } from 'react-icons/md'
import SupportAlert from './SupportAlert'
import { useGetVendorAvailableLeadsQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useGetVendorDashboardDataQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useUnlockLeadMutation } from '@/redux/rtkQueries/allPostApi'

export default function VendorDashboard() {
    const router = useRouter()
    const [locationFilter, setLocationFilter] = useState('all')
    const [sortFilter, setSortFilter] = useState('newest')
    const [unlockingLeadId, setUnlockingLeadId] = useState<string | null>(null)

    const { data: dashboardData, isLoading: dashboardLoading } = useGetVendorDashboardDataQuery()
    const dashboard = dashboardData?.data;

    const leadsParams = useMemo(
        () => ({
            location: locationFilter !== 'all' ? locationFilter : undefined,
            sort: sortFilter,
        }),
        [locationFilter, sortFilter],
    )
    const { data: leadsData, isLoading: leadsLoading } = useGetVendorAvailableLeadsQuery(leadsParams)
    const [unlockLead] = useUnlockLeadMutation()
    const leads = leadsData?.data ?? []
    const isLoading = dashboardLoading || leadsLoading

    const handleUnlockLead = async (leadId: string) => {
        console.log('leadId', leadId)
        setUnlockingLeadId(leadId)
        try {
            await unlockLead(leadId).unwrap()
            addToast({ title: 'Lead unlocked successfully', color: 'success', timeout: 2000 })
            router.push(generateLeadDetailRoutePath(leadId))
        } catch {
            // Error toast handled by rtkQuerieSetup
        } finally {
            setUnlockingLeadId(null)
        }
    }

    const locationOptions = [
        { key: 'all', label: 'All Locations' },
        { key: 'london', label: 'London' },
        { key: 'manchester', label: 'Manchester' },
    ]

    const sortOptions = [
        { key: 'newest', label: 'Newest First' },
        { key: 'oldest', label: 'Oldest First' },
        { key: 'credits', label: 'Credits (Low to High)' },
    ]

    return (
        <>
            <div className="mt-8 space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8F4FD] mb-3">
                            <DocumentIconSVG className="size-5 text-primaryColor" />
                        </div>
                        <p className="text-2xl font-bold text-fontBlack">
                            {isLoading ? '—' : dashboard?.availableLeadsCount ?? 0}
                        </p>
                        <p className="text-sm text-darkSilver mt-0.5">Available Leads</p>
                    </div>

                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#E8F5E9] mb-3">
                            <LockGreenIconSVG className="size-5 text-[#4CAF50]" />
                        </div>
                        <p className="text-2xl font-bold text-fontBlack">
                            {isLoading ? '—' : dashboard?.purchasedLeadsCount ?? 0}
                        </p>
                        <p className="text-sm text-darkSilver mt-0.5">Purchased Leads</p>
                        <Link href={generateLeadDetailRoutePath('345')} className="inline-block mt-2 text-sm font-medium text-[#4CAF50] hover:underline">
                            View leads →
                        </Link>
                    </div>

                    <Link href={getCreditsRoutePath()} className="block cursor-pointer">
                        <div className="rounded-2xl border border-borderDark bg-[#FFF8F0] p-5">
                            <div className="flex size-10 items-center justify-center rounded-full bg-[#FFE4CC] mb-3">
                                <CreditCardIconSVG className="size-5 text-[#E17100]" />
                            </div>
                            <p className="text-2xl font-bold text-fontBlack">
                                {isLoading ? '—' : `${dashboard?.creditBalance ?? 0} credits`}
                            </p>
                            <p className="text-sm text-darkSilver mt-0.5">Credit Balance</p>
                            <span className="inline-block mt-2 text-sm font-medium text-[#E17100] hover:underline">
                                Buy credits →
                            </span>
                        </div>
                    </Link>

                    <div className="rounded-2xl border border-borderDark bg-white p-5">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#F3E5F5] mb-3">
                            <DocumentArrowIconSVG className="size-5 text-[#9C27B0]" />
                        </div>
                        <p className="text-2xl font-bold text-fontBlack">
                            {isLoading ? '—' : dashboard?.quotesSentCount ?? 0}
                        </p>
                        <p className="text-sm text-darkSilver mt-0.5">Quotes Sent</p>
                        <Link href={getVendorDashboardRoutePath()} className="inline-block mt-2 text-sm font-medium text-[#9C27B0] hover:underline">
                            View all →
                        </Link>
                    </div>
                </div>

                {/* Available Leads Section */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div>
                            <h2 className="header_text_md text-fontBlack">Available Leads</h2>
                            <p className="text-sm text-darkSilver mt-1">
                                5 leads available • Unlock to view full details
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="btn_radius capitalize text-sm bg-white! border border-borderDark h-10 min-w-35 shadow-none"
                                        endContent={<MdKeyboardArrowDown className="text-lg text-fontBlack" />}
                                    >
                                        {locationOptions.find((o) => o.key === locationFilter)?.label ?? 'All Locations'}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Location filter"
                                    items={locationOptions}
                                    selectedKeys={[locationFilter]}
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const key = Array.from(keys as Set<string>)[0]
                                        if (key) setLocationFilter(key)
                                    }}
                                >
                                    {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="btn_radius capitalize text-sm bg-white! border border-borderDark h-10 min-w-35 shadow-none"
                                        endContent={<MdKeyboardArrowDown className="text-lg text-fontBlack" />}
                                    >
                                        {sortOptions.find((o) => o.key === sortFilter)?.label ?? 'Newest First'}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Sort filter"
                                    items={sortOptions}
                                    selectedKeys={[sortFilter]}
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const key = Array.from(keys as Set<string>)[0]
                                        if (key) setSortFilter(key)
                                    }}
                                >
                                    {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                                </DropdownMenu>
                            </Dropdown>
                            <span className="text-sm text-darkSilver">Showing <span className='font-bold text-fontBlack'>5</span> leads</span>
                        </div>
                    </div>

                    {/* Lead Cards */}
                    <div className="flex flex-col gap-4">
                        {leads && leads?.length > 0 && leads?.map((lead, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-borderDark bg-white p-6"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                    <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-lg text-fontBlack">
                                                {lead.service_category.title}
                                            </h3>
                                            <span className="inline-flex items-center rounded-full bg-[#E8F4FD] border border-primary px-2.5 py-0.5 text-xs font-medium text-primaryColor">
                                                {/* {lead.businessType} */}
                                                {lead?.contact_details?.client_type === 'Individual' ? 'B2C' : 'B2B'}
                                            </span>

                                            {lead?.unlocked && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-xs font-medium text-[#4CAF50]">
                                                    <LockUnlockedIconSVG className="size-3.5 text-[#4CAF50]" />
                                                    Unlocked
                                                </span>
                                            )}
                                            <div className="flex items-center gap-2 text-sm text-darkSilver">
                                                <span>{lead?.quotes_count}/5 professionals responded</span>
                                                {!lead?.unlocked && (
                                                    <Tooltip content="This request will stay open for 7 days. After that, it will close automatically.">
                                                        <span className="inline-flex cursor-help"><InfoSVG /></span>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-darkSilver">
                                            <span className="flex items-center gap-1.5">
                                                <LocationSVG />
                                                {lead.country}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <TimeIconSVG />
                                                Posted {moment(lead.createdAt).fromNow()}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm">
                                            {/* {lead?.unlocked ? (
                                                <> */}
                                            <span className="flex items-center gap-1.5 text-fontBlack">
                                                <CheckGreenIconSVG />
                                                {lead?.contact_details?.phone}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-fontBlack">
                                                <EnvelopeIconSVG />
                                                {lead?.contact_details?.email}
                                            </span>
                                            {/* </>
                                            ) : (
                                                <>
                                                    <span className="flex items-center gap-1.5 text-fontBlack">
                                                        <CheckGreenIconSVG />
                                                        {lead?.contact_details?.phone}
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-fontBlack">
                                                        <EnvelopeIconSVG />
                                                        {lead?.contact_details?.email}
                                                    </span>
                                                </>
                                            )} */}
                                        </div>
                                        <p className="text-sm text-darkSilver leading-relaxed">
                                            {lead.note}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start lg:items-end shrink-0 gap-2">
                                        {lead?.unlocked ? (
                                            <>
                                                <Button
                                                    className="btn_radius font-medium bg-[#4CAF50] text-white hover:bg-[#45a049]"
                                                    onPress={() => router.push(generateLeadDetailRoutePath(lead?._id))}
                                                >
                                                    View Full Details
                                                </Button>

                                            </>
                                        ) : (
                                            <>
                                                <div className="text-right">
                                                    <p className="font-bold text-fontBlack">
                                                        {lead?.creditsToUnlock} Credits
                                                    </p>
                                                    <p className="text-xs text-darkSilver">to unlock</p>
                                                </div>
                                                <Button
                                                    className="btn_radius btn_bg_blue font-medium disabled:opacity-60 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                    startContent={<LockPrimaryColorSVG className="size-4 text-white" />}
                                                    disabled={!dashboard?.canPurchaseLeads}
                                                    isLoading={unlockingLeadId === lead?._id}
                                                    onPress={() => handleUnlockLead(lead._id)}
                                                >
                                                    Unlock Lead
                                                </Button>
                                                <p className="text-xs text-darkSilver">
                                                    Full details available after unlocking
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Support Banner */}
                <SupportAlert title="Need help?" content={`Contact vendor support for assistance with leads, quotes, or your account`} />
            </div>
        </>
    )
}
