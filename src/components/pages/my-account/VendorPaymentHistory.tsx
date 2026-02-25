'use client'

import React, { useState } from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem } from '@heroui/react'
import { CalendarSVG, CheckGreenIconSVG, CircleXmarkIconSVG } from '@/components/library/AllSVG'
import { HiOutlineArrowDownTray } from 'react-icons/hi2'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { FiCopy } from 'react-icons/fi'

type PaymentStatus = 'completed' | 'failed' | 'refunded'

interface PaymentRecord {
    id: string
    transactionId: string
    dateTime: string
    paymentMethod: string
    amountPaid: string
    creditAdded: string | null
    status: PaymentStatus
}

const DATE_RANGE_OPTIONS = [
    { key: '7', label: 'Last 7 days' },
    { key: '30', label: 'Last 30 days' },
    { key: '90', label: 'Last 90 days' },
]

const STATUS_OPTIONS = [
    { key: 'all', label: 'All Statuses' },
    { key: 'completed', label: 'Completed' },
    { key: 'failed', label: 'Failed' },
    { key: 'refunded', label: 'Refunded' },
]

const PAYMENTS: PaymentRecord[] = [
    { id: '1', transactionId: 'TXN-2026-00147', dateTime: '30 Jan 2026, 14:32', paymentMethod: 'Visa **** 4532', amountPaid: '€50.00', creditAdded: '+500 credits', status: 'completed' },
    { id: '2', transactionId: 'TXN-2026-00146', dateTime: '28 Jan 2026, 11:20', paymentMethod: 'Visa **** 4532', amountPaid: '€50.00', creditAdded: null, status: 'failed' },
    { id: '3', transactionId: 'TXN-2026-00145', dateTime: '25 Jan 2026, 09:15', paymentMethod: 'Mastercard **** 8821', amountPaid: '€50.00', creditAdded: '+500 credits', status: 'completed' },
    { id: '4', transactionId: 'TXN-2026-00144', dateTime: '22 Jan 2026, 16:45', paymentMethod: 'Visa **** 4532', amountPaid: '€50.00', creditAdded: null, status: 'refunded' },
    { id: '5', transactionId: 'TXN-2026-00143', dateTime: '20 Jan 2026, 10:00', paymentMethod: 'Visa **** 4532', amountPaid: '€50.00', creditAdded: '+500 credits', status: 'completed' },
    { id: '6', transactionId: 'TXN-2026-00142', dateTime: '18 Jan 2026, 14:32', paymentMethod: 'Visa **** 4532', amountPaid: '€50.00', creditAdded: '+500 credits', status: 'completed' },
    { id: '7', transactionId: 'TXN-2026-00141', dateTime: '15 Jan 2026, 08:22', paymentMethod: 'Mastercard **** 8821', amountPaid: '€50.00', creditAdded: null, status: 'completed' },
    { id: '8', transactionId: 'TXN-2026-00140', dateTime: '12 Jan 2026, 17:10', paymentMethod: 'Visa **** 4532', amountPaid: '€50.00', creditAdded: '+500 credits', status: 'completed' },
]

function DownloadIconSVG({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
            <path d="M10 12.5V2.5M10 12.5L6.66667 9.16667M10 12.5L13.3333 9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.5 17.5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

function RefundIconSVG({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
            <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C10.5 2 12.5 3.5 13.5 5.5M13.5 5.5V2M13.5 5.5H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

function StatusBadge({ status }: { status: PaymentStatus }) {
    if (status === 'completed') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0FDF4] px-3 py-1 text-sm font-medium text-[#00A63E]">
                <CheckGreenIconSVG />
                Completed
            </span>
        )
    }
    if (status === 'failed') {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-sm font-medium text-danger [&_svg_path]:fill-current">
                <CircleXmarkIconSVG />
                Failed
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
            <RefundIconSVG />
            Refunded
        </span>
    )
}

const ITEMS_PER_PAGE_OPTIONS = ['10', '20', '50']

export default function VendorPaymentHistory() {
    const [dateRange, setDateRange] = useState('30')
    const [statusFilter, setStatusFilter] = useState('all')
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState('10')

    const filteredPayments = PAYMENTS.filter(
        (p) => statusFilter === 'all' || p.status === statusFilter
    )
    const totalItems = filteredPayments.length
    const perPage = Number(itemsPerPage)
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage))
    const start = (page - 1) * perPage
    const paginatedPayments = filteredPayments.slice(start, start + perPage)

    const handleCopyId = (text: string) => {
        void navigator.clipboard.writeText(text)
    }

    return (
        <>
            <div className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-fontBlack">Payment History</h2>
                        <p className="mt-1 text-sm text-darkSilver">
                            View, filter, and download your payment records.
                        </p>
                    </div>

                </div>

                <div className="mt-4 flex flex-nowrap items-center justify-between gap-3">
                    <div className='flex flex-nowrap items-center gap-3'>
                        <div className="shrink-0">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        className="min-w-36 justify-between bg-white px-4 shadow-none border border-borderDark h-10"
                                        startContent={<CalendarSVG />}
                                        endContent={<MdKeyboardArrowDown className="text-lg text-fontBlack" />}
                                    >
                                        {DATE_RANGE_OPTIONS.find((o) => o.key === dateRange)?.label ?? 'Last 30 days'}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Date range"
                                    selectedKeys={[dateRange]}
                                    selectionMode="single"
                                    onSelectionChange={(keys) => {
                                        const key = Array.from(keys as Set<string>)[0]
                                        if (key) setDateRange(key)
                                    }}
                                >
                                    {DATE_RANGE_OPTIONS.map((o) => (
                                        <DropdownItem key={o.key}>{o.label}</DropdownItem>
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="shrink-0">
                            <Select
                                selectedKeys={[statusFilter]}
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys as Set<string>)[0]
                                    if (key) setStatusFilter(key)
                                }}
                                className="min-w-36"
                                classNames={{
                                    trigger: 'min-h-10 border border-borderDark shadow-none bg-white',
                                    value: 'text-sm',
                                }}
                                aria-label="Filter by status"
                                placeholder="All Statuses"
                            >
                                {STATUS_OPTIONS.map((o) => (
                                    <SelectItem key={o.key}>{o.label}</SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="shrink-0">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    className="btn_radius btn_bg_blue gap-2 px-4"
                                    startContent={<DownloadIconSVG className="text-white" />}
                                    endContent={<MdKeyboardArrowDown className="text-lg text-white" />}
                                >
                                    Download
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Download options">
                                <DropdownItem key="csv">Download as CSV</DropdownItem>
                                <DropdownItem key="pdf">Download as PDF</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-borderDark bg-white overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-200">
                        <thead>
                            <tr className="border-b border-borderDark bg-[#F9FAFB]">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fontBlack">
                                    Transaction ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fontBlack">
                                    Date & Time
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fontBlack">
                                    Payment Method
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fontBlack">
                                    Amount Paid
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fontBlack">
                                    Credit Added
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fontBlack">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-fontBlack">
                                    Receipt
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPayments.map((row) => (
                                <tr key={row.id} className="border-b border-borderDark last:border-b-0 hover:bg-[#F9FAFB]/50">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-fontBlack">
                                                {row.transactionId}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleCopyId(row.transactionId)}
                                                className="text-darkSilver hover:text-fontBlack transition-colors"
                                                aria-label="Copy transaction ID"
                                            >
                                                <FiCopy className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-fontBlack">
                                        {row.dateTime}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-fontBlack">
                                        {row.paymentMethod}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-fontBlack">
                                        {row.amountPaid}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-fontBlack">
                                        {row.creditAdded ?? '—'}
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={row.status} />
                                    </td>
                                    <td className="px-4 py-4">
                                        <button
                                            type="button"
                                            className="text-darkSilver hover:text-primaryColor transition-colors p-1"
                                            aria-label="Download receipt"
                                        >
                                            <DownloadIconSVG />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-4 border-t border-borderDark p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-darkSilver">
                        {totalItems === 0
                            ? '0 items'
                            : `${start + 1}-${Math.min(start + perPage, totalItems)} of ${totalItems} items`}
                    </p>
                    <Pagination
                        total={totalPages}
                        page={page}
                        onChange={setPage}
                        showControls
                        size="sm"
                        radius="full"
                        classNames={{ cursor: 'bg-primaryColor text-white' }}
                    />
                    {/* <div className="flex flex-wrap items-center gap-4"> */}
                        <div className="flex w-max min-w-max items-center gap-2">
                            <Select
                                selectedKeys={[itemsPerPage]}
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys as Set<string>)[0]
                                    if (key) {
                                        setItemsPerPage(key)
                                        setPage(1)
                                    }
                                }}
                                className="min-w-20"
                                classNames={{
                                    trigger: 'min-h-9 border border-borderDark shadow-none bg-white',
                                    value: 'text-sm',
                                }}
                                aria-label="Items per page"
                            >
                                {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                                    <SelectItem key={n}>{n}</SelectItem>
                                ))}
                            </Select>
                            <span className="text-sm text-fontBlack whitespace-nowrap">
                                Items per page
                            </span>
                        </div>
                    {/* </div> */}
                </div>
            </div>
        </>
    )
}
