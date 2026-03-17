'use client'

import { BackArrowSVG, CalendarSVG, DollarSignIconSVG } from '@/components/library/AllSVG'
import { getVendorDashboardRoutePath } from '@/routes/routes'
import { useGetCreditsPackagesQuery, useGetVendorDashboardDataQuery, useGetVendorDashboardTransactionHistoryQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { usePurchaseCreditsMutation } from '@/redux/rtkQueries/allPostApi'
import type { IAllCreditsDataEntity } from '@/types/allCredits'
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem, Spinner } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { HiMinus, HiOutlineArrowDownTray, HiPlus } from 'react-icons/hi2'
import { MdKeyboardArrowDown } from 'react-icons/md'

type CreditPackageDisplay = {
    id: string
    credits: number
    bonus: number | null
    price: string
    unitPrice: string
    popular: boolean
}

function mapPackageToDisplay(entity: IAllCreditsDataEntity): CreditPackageDisplay {
    return {
        id: entity._id,
        credits: entity.credits,
        bonus: entity.bonus_credits > 0 ? entity.bonus_credits : null,
        price: String(entity.price),
        unitPrice: String(entity.per_credit_price),
        popular: entity.is_most_popular,
    }
}

const PERIOD_OPTIONS = [
    { key: 'all', label: 'All time' },
    { key: '7', label: 'Last 7 days' },
    { key: '30', label: 'Last 30 days' },
    { key: '90', label: 'Last 90 days' },
]

export default function CreditsWallet() {
    const [period, setPeriod] = useState('all')
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState('10')
    const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
    const router = useRouter()

    const queryParams = useMemo(() => {
        const base = { page, limit: Number(itemsPerPage) }
        if (period === 'all' || !period) return base
        const days = Number(period) || 30
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - days)
        return {
            ...base,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
        }
    }, [period, page, itemsPerPage])

    const { data: dashboardData, isLoading: balanceLoading } = useGetVendorDashboardDataQuery()
    const creditBalance = dashboardData?.data?.creditBalance ?? 0

    const { data, isLoading } = useGetVendorDashboardTransactionHistoryQuery(queryParams)
    const apiData = data?.data
    const transactions = apiData?.transactions ?? []
    const totalItems = apiData?.total ?? 0
    const totalPages = Math.max(1, Math.ceil(totalItems / Number(itemsPerPage)))

    const [purchaseCredits] = usePurchaseCreditsMutation()
    const { data: creditsResponse, isLoading: packagesLoading } = useGetCreditsPackagesQuery()
    const creditPackages = useMemo(() => {
        const list = creditsResponse?.data ?? []
        return list
            .filter((p) => p.status === 'ACTIVE')
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map(mapPackageToDisplay)
    }, [creditsResponse?.data])

    const openPurchaseModal = async (pkg: CreditPackageDisplay) => {
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        if (!keyId) {
            alert(
                'Razorpay not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID, RAZORPAY_KEY_ID, and RAZORPAY_KEY_SECRET to .env.local (get free test keys from Razorpay Dashboard)'
            )
            return
        }
        try {
            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(pkg.price),
                    currency: 'INR',
                    receipt: `credits_${pkg.id}`,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? 'Failed to create order')
            const { orderId } = data

            const packageId = pkg.id
            const openCheckout = () => {
                const Razorpay = (window as unknown as { Razorpay: new (o: object) => { open: () => void } }).Razorpay
                const options = {
                    key: keyId,
                    amount: Math.round(parseFloat(pkg.price) * 100),
                    currency: 'INR',
                    name: 'Credits Purchase',
                    description: `${pkg.credits} credits${pkg.bonus ? ` + ${pkg.bonus} bonus` : ''}`,
                    order_id: orderId,
                    handler: async () => {
                        try {
                            await purchaseCredits({ package_id: packageId }).unwrap()
                            addToast({ title: 'Credits purchased successfully', color: 'success', timeout: 2000 })
                            setSelectedPackageId(null)
                        } catch (err) {
                            console.error(err)
                            alert(err instanceof Error ? err.message : 'Failed to complete purchase')
                        }
                    },
                }
                const rzp = new Razorpay(options)
                rzp.open()
            }

            const Razorpay = (window as unknown as { Razorpay?: new (o: object) => { open: () => void } }).Razorpay
            if (Razorpay) {
                openCheckout()
                return
            }
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            script.onload = openCheckout
            document.body.appendChild(script)
        } catch (err) {
            console.error(err)
            alert(err instanceof Error ? err.message : 'Failed to open payment')
        }
    }
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <Button isIconOnly className="btn_radius btn_bg_white shrink-0" onPress={() => router.push(getVendorDashboardRoutePath({ leads: 'purchased' }))}>
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
                {/* <Button
                    className="btn_radius btn_bg_white"
                    startContent={<BackArrowSVG />}
                    onPress={() => router.push(getVendorDashboardRoutePath())}
                >
                    Back to Dashboard
                </Button> */}
            </div>

            {/* Current Credit Balance Card */}
            <div className="rounded-2xl bg-primaryColor p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
                <div>
                    <p className="text-white/90 text-sm font-medium">Current Credit Balance</p>
                    {balanceLoading ? (
                        <div className="mt-1">
                            <Spinner size="lg" color="white" classNames={{ circle1: 'border-b-white', circle2: 'border-b-white' }} />
                        </div>
                    ) : (
                        <p className="text-4xl md:text-5xl font-bold text-white mt-1">{creditBalance} credits</p>
                    )}
                </div>
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/20">
                    <span className="text-4xl font-bold text-white">€</span>
                </div>
            </div>

            {/* Buy Credits Section */}
            <div>
                <h2 className="font-bold text-lg text-fontBlack mb-4">Buy Credits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {packagesLoading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <Spinner size="lg" color="primary" />
                        </div>
                    ) : (
                        creditPackages && creditPackages?.length > 0 && creditPackages?.map((pkg) => {
                            const isSelected = selectedPackageId === pkg.id
                            return (
                                <div
                                    key={pkg.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setSelectedPackageId(pkg.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            setSelectedPackageId(pkg.id)
                                        }
                                    }}
                                    className={`relative rounded-2xl border bg-white p-5 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-primaryColor focus-visible:ring-offset-2 ${isSelected ? 'ring-2 ring-primaryColor border-primaryColor' : ''} ${!isSelected && pkg.popular ? 'border-primaryColor' : ''} ${!isSelected && !pkg.popular ? 'border-borderDark' : ''} flex flex-col justify-between items-center gap-8`}
                                >
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
                            )
                        })
                    )}
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
                                    if (key) {
                                        setPeriod(key)
                                        setPage(1)
                                    }
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
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center">
                                            <Spinner size="lg" color="primary" />
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center text-sm text-darkSilver">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((txn) => {
                                        const creditsNum = Number(txn.credits)
                                        return (
                                            <tr key={txn._id} className="border-b border-borderDark last:border-b-0">
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium capitalize ${txn.type?.toLowerCase() === 'purchase'
                                                                ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                                                : 'bg-[#FFEBEE] text-[#C62828]'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`flex size-5 shrink-0 items-center justify-center rounded-full ${txn.type?.toLowerCase() === 'purchase'
                                                                    ? 'bg-[#4CAF50] text-white'
                                                                    : 'bg-danger text-white'
                                                                }`}
                                                        >
                                                            {txn.type?.toLowerCase() === 'purchase' ? (
                                                                <HiPlus className="size-3" strokeWidth={2.5} />
                                                            ) : (
                                                                <HiMinus className="size-3" strokeWidth={2.5} />
                                                            )}
                                                        </span>
                                                        {txn.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-fontBlack">
                                                    {txn.description}
                                                </td>
                                                <td
                                                    className={`px-4 py-4 text-sm font-medium ${creditsNum > 0 ? 'text-[#4CAF50]' : 'text-danger'
                                                        }`}
                                                >
                                                    {creditsNum > 0 ? `${txn.credits}` : txn.credits}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-fontBlack">
                                                    {txn.balanceAfter} credits
                                                </td>
                                                <td className="px-4 py-4 text-sm text-darkSilver">
                                                    {txn.date}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t border-borderDark">
                        <p className="text-sm text-darkSilver">
                            {totalItems === 0
                                ? '0 items'
                                : `${(page - 1) * Number(itemsPerPage) + 1}-${Math.min(page * Number(itemsPerPage), totalItems)} of ${totalItems} items`}
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
                                    if (key) {
                                        setItemsPerPage(key)
                                        setPage(1)
                                    }
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
