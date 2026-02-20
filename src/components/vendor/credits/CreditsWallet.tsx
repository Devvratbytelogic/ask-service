'use client'

import { openModal } from '@/redux/slices/allModalSlice'
import { BackArrowSVG, CalendarSVG, DollarSignIconSVG } from '@/components/library/AllSVG'
import { getVendorDashboardRoutePath } from '@/routes/routes'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { HiOutlineArrowDownTray } from 'react-icons/hi2'
import { MdKeyboardArrowDown } from 'react-icons/md'

const CREDIT_PACKAGES = [
    { id: '50', credits: 50, bonus: null, price: '19.99', unitPrice: '0.40', popular: false },
    { id: '150', credits: 150, bonus: 15, price: '49.99', unitPrice: '0.33', popular: true },
    { id: '300', credits: 300, bonus: 50, price: '89.99', unitPrice: '0.30', popular: false },
    { id: '500', credits: 500, bonus: 100, price: '139.99', unitPrice: '0.28', popular: false },
]

const TRANSACTIONS = [
    { type: 'deduction', description: 'Unlocked lead: House Cleaning in West London', credits: -3, balanceAfter: '150 credits', date: '30 Jan 2026, 14:32' },
    { type: 'purchase', description: 'Purchased Professional Package', credits: 150, balanceAfter: '156 credits', date: '30 Jan 2026, 14:32' },
    { type: 'deduction', description: 'Unlocked lead: Gardening in East London', credits: -5, balanceAfter: '6 credits', date: '29 Jan 2026, 10:15' },
    { type: 'purchase', description: 'Purchased Starter Package', credits: 50, balanceAfter: '11 credits', date: '28 Jan 2026, 16:45' },
    { type: 'deduction', description: 'Unlocked lead: House Cleaning in North London', credits: -3, balanceAfter: '6 credits', date: '27 Jan 2026, 09:22' },
]

const PERIOD_OPTIONS = [
    { key: '7', label: 'Last 7 days' },
    { key: '30', label: 'Last 30 days' },
    { key: '90', label: 'Last 90 days' },
]

export default function CreditsWallet() {
    const [period, setPeriod] = useState('30')
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState('10')
    const totalItems = 18
    const totalPages = Math.ceil(totalItems / Number(itemsPerPage))
    const router = useRouter()
    const dispatch = useDispatch()

    const openPurchaseModal = (pkg: (typeof CREDIT_PACKAGES)[0]) => {
        console.log('pkg', pkg)
        // dispatch(openModal({
        //     componentName: 'PurchaseCreditsModal',
        //     data: { package: pkg },
        //     modalSize: '4xl',
        //     modalPadding: 'p-0',
        //     hideCloseButton: true,
        // }))
    }
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <Button isIconOnly className="btn_radius btn_bg_white shrink-0" onPress={() => router.push(getVendorDashboardRoutePath())}>
                        <BackArrowSVG />
                    </Button>
                    <div>
                        <h1 className="font-bold text-xl md:text-2xl text-fontBlack">
                            Credits & Wallet
                        </h1>
                        <p className="text-sm text-darkSilver mt-0.5">
                            Manage your credit balance and purchase history
                        </p>
                    </div>
                </div>
                <Button
                    className="btn_radius btn_bg_white"
                    startContent={<BackArrowSVG />}
                    onPress={() => router.push(getVendorDashboardRoutePath())}
                >
                    Back to Dashboard
                </Button>
            </div>

            {/* Current Credit Balance Card */}
            <div className="rounded-2xl bg-primaryColor p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div>
                    <p className="text-white/90 text-sm font-medium">Current Credit Balance</p>
                    <p className="text-4xl md:text-5xl font-bold text-white mt-1">150 credits</p>
                    <p className="text-white/80 text-sm mt-2">
                        Each lead costs 3-5 credits to unlock
                    </p>
                </div>
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <DollarSignIconSVG className="size-8 text-white" />
                </div>
            </div>

            {/* Buy Credits Section */}
            <div>
                <h2 className="font-bold text-lg text-fontBlack mb-4">Buy Credits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {CREDIT_PACKAGES.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`relative rounded-2xl border bg-white p-5 ${pkg.popular ? 'border-primaryColor' : 'border-borderDark'} flex flex-col justify-between items-center gap-8`}>
                            <div className='space-y-1 text-center'>
                                {pkg.popular && (
                                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex rounded-full bg-primaryColor px-3 py-0.5 text-xs font-medium text-white">
                                        MOST POPULAR
                                    </span>
                                )}
                                <p className="font-bold text-xl text-fontBlack mt-2">
                                    {pkg.credits}
                                </p>
                                <p className='text-sm text-darkSilver'>credits</p>
                                {pkg.bonus && (
                                    <span className="inline-flex mt-1 rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-xs font-medium text-[#4CAF50]">
                                        +{pkg.bonus} bonus
                                    </span>
                                )}
                                <p className="mt-3 font-bold text-xl text-fontBlack">€{pkg.price}</p>
                                <p className="text-xs text-darkSilver">€{pkg.unitPrice} per credit</p>
                            </div>
                            <Button
                                className={`btn_radius font-medium ${pkg.popular ? 'btn_bg_blue' : 'bg-[#F3F4F6]'} w-full`}
                                onPress={() => openPurchaseModal(pkg)}
                            >
                                Purchase Credits
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction History */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <h2 className="font-bold text-lg text-fontBlack">Transaction History</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    className="btn_radius capitalize text-sm bg-white! border border-borderDark h-10 min-w-32 shadow-none"
                                    startContent={<CalendarSVG />}
                                    endContent={<MdKeyboardArrowDown className="text-lg text-fontBlack" />}
                                >
                                    {PERIOD_OPTIONS.find((o) => o.key === period)?.label ?? 'Last 30 days'}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Period filter"
                                items={PERIOD_OPTIONS}
                                selectedKeys={[period]}
                                selectionMode="single"
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys as Set<string>)[0]
                                    if (key) setPeriod(key)
                                }}
                            >
                                {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
                            </DropdownMenu>
                        </Dropdown>
                        <Button
                            className="btn_radius btn_bg_blue font-medium"
                            startContent={<HiOutlineArrowDownTray className="size-5" />}
                        >
                            Download
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl border border-borderDark bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-150">
                            <thead>
                                <tr className="border-b border-borderDark bg-[#F9FAFB]">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-fontBlack">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-fontBlack">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-fontBlack">
                                        Credits
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-fontBlack">
                                        Balance After
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-fontBlack">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {TRANSACTIONS.map((txn, i) => (
                                    <tr key={i} className="border-b border-borderDark last:border-b-0">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`size-2 rounded-full ${txn.type === 'purchase' ? 'bg-[#4CAF50]' : 'bg-danger'
                                                        }`}
                                                />
                                                <span className="text-sm font-medium text-fontBlack capitalize">
                                                    {txn.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-fontBlack">
                                            {txn.description}
                                        </td>
                                        <td
                                            className={`px-4 py-4 text-sm font-medium ${txn.credits > 0 ? 'text-[#4CAF50]' : 'text-danger'
                                                }`}
                                        >
                                            {txn.credits > 0 ? `+${txn.credits}` : txn.credits}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-fontBlack">
                                            {txn.balanceAfter}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-darkSilver">
                                            {txn.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-borderDark">
                        <p className="text-sm text-darkSilver">
                            1-05 of {totalItems} items
                        </p>
                        <div className="flex items-center gap-4">
                            <Pagination
                                total={totalPages}
                                page={page}
                                onChange={setPage}
                                showControls
                                size="sm"
                                radius="full"
                                classNames={{ cursor: 'bg-primaryColor text-white' }}
                            />
                        </div>
                        <div className='flex w-max min-w-max items-center gap-2'>
                            <Select
                                selectedKeys={[itemsPerPage]}
                                onSelectionChange={(keys) => {
                                    const key = Array.from(keys as Set<string>)[0]
                                    if (key) setItemsPerPage(key)
                                }}
                                className="min-w-24"
                                classNames={{
                                    trigger: 'min-h-9 border border-borderDark bg-white',
                                    value: 'text-sm',
                                }}
                                aria-label="Items per page"
                            >
                                <SelectItem key="10">10</SelectItem>
                                <SelectItem key="20">20</SelectItem>
                                <SelectItem key="50">50</SelectItem>
                            </Select>
                            <p className="text-sm text-darkSilver hidden sm:inline text-nowrap">Items per page</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
