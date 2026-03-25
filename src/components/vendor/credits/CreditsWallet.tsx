'use client'

import { BackArrowSVG, CalendarSVG } from '@/components/library/AllSVG'
import { getVendorDashboardRoutePath } from '@/routes/routes'
import { useGetCreditsPackagesQuery, useGetVendorDashboardDataQuery, useGetVendorDashboardTransactionHistoryQuery, useGetVendorProfileInfoQuery, useLazyGetCreditsTransactionHistoryExportCSVQuery, useLazyGetCreditsTransactionHistoryExportPDFQuery, useLazyGetCreditsTransactionInvoiceQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { usePurchaseCreditsMutation, useStripePaymentMutation, useVerifyStripePaymentMutation } from '@/redux/rtkQueries/allPostApi'
import type { IAllCreditsDataEntity } from '@/types/allCredits'
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Select, SelectItem, Spinner } from '@heroui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HiMinus, HiOutlineArrowDownTray, HiPlus } from 'react-icons/hi2'
import { MdKeyboardArrowDown } from 'react-icons/md'
import BillingInfoModal from './BillingInfoModal'

type CreditPackageDisplay = {
    id: string
    name: string
    credits: number
    bonus: number | null
    price: string
    unitPrice: string
    popular: boolean
    vatRate: number
    vatAmount: string
    totalPrice: string
}

function mapPackageToDisplay(entity: IAllCreditsDataEntity): CreditPackageDisplay {
    const basePrice = entity.price
    const vatRate = entity.vat_rate ?? 0
    const vatAmount = basePrice * (vatRate / 100)
    const totalPrice = basePrice + vatAmount
    return {
        id: entity._id,
        name: entity.name ?? '',
        credits: entity.credits,
        bonus: entity.bonus_credits > 0 ? entity.bonus_credits : null,
        price: basePrice.toFixed(2),
        unitPrice: entity.per_credit_price.toFixed(4).replace(/\.?0+$/, ''),
        popular: entity.is_most_popular,
        vatRate,
        vatAmount: vatAmount.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
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
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'fail' | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const verifyCalledRef = useRef(false)

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

    const [billingModalOpen, setBillingModalOpen] = useState(false)
    const [pendingPackage, setPendingPackage] = useState<CreditPackageDisplay | null>(null)

    const { data: vendorProfileData } = useGetVendorProfileInfoQuery()
    const profileData = vendorProfileData?.data

    const [stripePayment, { isLoading: stripeLoading }] = useStripePaymentMutation()
    const [verifyStripePayment] = useVerifyStripePaymentMutation()
    const [purchaseCredits] = usePurchaseCreditsMutation()
    const [fetchCSV] = useLazyGetCreditsTransactionHistoryExportCSVQuery()
    const [fetchPDF] = useLazyGetCreditsTransactionHistoryExportPDFQuery()
    const [fetchInvoice] = useLazyGetCreditsTransactionInvoiceQuery()
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null)
    const { data: creditsResponse, isLoading: packagesLoading } = useGetCreditsPackagesQuery()
    const creditPackages = useMemo(() => {
        const list = creditsResponse?.data ?? []
        return list
            .filter((p) => p.status === 'ACTIVE')
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map(mapPackageToDisplay)
    }, [creditsResponse?.data])

    const handleStripeResult = useCallback((rawStripeStatus: string, rawSessionId: string | null) => {
        // Stripe sometimes returns ?session_id= instead of &session_id= in the redirect URL,
        // causing both values to be merged into a single query param.
        const [stripeStatus, sessionIdFromStatus] = rawStripeStatus.includes('?session_id=')
            ? rawStripeStatus.split('?session_id=')
            : [rawStripeStatus, null]

        const sessionId = rawSessionId ?? sessionIdFromStatus

        if (stripeStatus === 'success' && sessionId && !verifyCalledRef.current) {
            verifyCalledRef.current = true
            const packageId = localStorage.getItem('stripe_package_id')
            setIsVerifying(true)
            verifyStripePayment({ transactionId: sessionId })
                .unwrap()
                .then(() => purchaseCredits({ transactionId: sessionId, ...(packageId ? { package_id: packageId } : {}) }).unwrap())
                .then(() => {
                    localStorage.removeItem('stripe_package_id')
                    setPaymentStatus('success')
                    addToast({ title: 'Payment verified! Credits have been added to your account.', color: 'success', timeout: 5000 })
                })
                .catch(() => {
                    setPaymentStatus('fail')
                    // addToast({ title: 'Payment verification failed. Please contact support.', color: 'danger', timeout: 5000 })
                })
                .finally(() => {
                    setIsVerifying(false)
                    verifyCalledRef.current = false
                })
        } else if (stripeStatus === 'fail') {
            setPaymentStatus('fail')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Fallback: handle redirect-based return (popup blocked)
    useEffect(() => {
        const rawStripeStatus = searchParams.get('stripe_payment_status') ?? ''
        if (rawStripeStatus) {
            handleStripeResult(rawStripeStatus, searchParams.get('session_id'))
            router.replace('/vendor/credits')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getExportParams = useMemo(() => {
        if (period === 'all' || !period) return undefined
        const days = Number(period) || 30
        const end = new Date()
        const start = new Date()
        start.setDate(start.getDate() - days)
        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0],
        }
    }, [period])

    const handleDownload = async (format: 'csv' | 'pdf') => {
        try {
            const result = format === 'csv' ? await fetchCSV(getExportParams).unwrap() : await fetchPDF(getExportParams).unwrap()
            const blob = result as Blob
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `credits-transaction-history.${format}`
            a.click()
            URL.revokeObjectURL(url)
            addToast({ title: `Downloaded as ${format.toUpperCase()}`, color: 'success', timeout: 2000 })
        } catch {
            addToast({ title: 'Download failed', color: 'danger', timeout: 3000 })
        }
    }

    const handleDownloadInvoice = async (transactionId: string) => {
        try {
            setDownloadingInvoiceId(transactionId)
            const result = await fetchInvoice({ transactionId }).unwrap()
            const blob = result as Blob
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `invoice-${transactionId}.pdf`
            a.click()
            URL.revokeObjectURL(url)
            addToast({ title: 'Invoice downloaded', color: 'success', timeout: 2000 })
        } catch {
            console.error('Failed to download invoice')
        } finally {
            setDownloadingInvoiceId(null)
        }
    }

    const initiateStripeCheckout = useCallback(async (pkg: CreditPackageDisplay) => {
        try {
            setSelectedPackageId(pkg.id)
            const result = await stripePayment({ amount: (parseFloat(pkg.price)) }).unwrap() as { data?: { payment_url?: string } }
            const paymentUrl = result?.data?.payment_url
            if (!paymentUrl) throw new Error('No payment URL returned')
            localStorage.setItem('stripe_package_id', pkg.id)

            // Open Stripe checkout in a centered popup
            const w = 600, h = 700
            const left = window.screenX + (window.outerWidth - w) / 2
            const top = window.screenY + (window.outerHeight - h) / 2
            const popup = window.open(paymentUrl, 'stripe_checkout', `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`)

            if (!popup) {
                // Popup was blocked — fall back to same-tab redirect
                window.location.href = paymentUrl
                return
            }

            // Poll until Stripe redirects back to our domain
            const timer = setInterval(() => {
                if (!popup || popup.closed) {
                    clearInterval(timer)
                    setSelectedPackageId(null)
                    return
                }
                try {
                    const popupUrl = popup.location.href
                    if (popupUrl.includes('stripe_payment_status=')) {
                        clearInterval(timer)
                        const params = new URL(popupUrl).searchParams
                        popup.close()
                        setSelectedPackageId(null)
                        handleStripeResult(
                            params.get('stripe_payment_status') ?? '',
                            params.get('session_id')
                        )
                    }
                } catch {
                    // Still on Stripe's domain (cross-origin) — keep polling
                }
            }, 500)
        } catch (err) {
            console.error(err)
            setSelectedPackageId(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stripePayment, handleStripeResult])

    const handlePurchase = (pkg: CreditPackageDisplay) => {
        setPendingPackage(pkg)
        setBillingModalOpen(true)
    }

    const handleBillingConfirm = () => {
        setBillingModalOpen(false)
        if (pendingPackage) {
            initiateStripeCheckout(pendingPackage)
            setPendingPackage(null)
        }
    }

    const handleBillingClose = () => {
        setBillingModalOpen(false)
        setPendingPackage(null)
    }
    const billingInitialValues = {
        businessName: profileData?.business_name ?? '',
        businessAddress: profileData?.address ?? '',
        postcode: profileData?.postal_code ?? '',
        city: profileData?.city ?? '',
        vatNumber: profileData?.vat_number ?? '',
        companyRegistrationNumber: profileData?.company_registration_number ?? '',
    }

    return (
        <div className="space-y-8">
            <BillingInfoModal
                isOpen={billingModalOpen}
                onClose={handleBillingClose}
                onConfirm={handleBillingConfirm}
                initialValues={billingInitialValues}
            />

            {/* Verification Loader Overlay */}
            {isVerifying && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm">
                    <Spinner size="lg" color="primary" classNames={{ circle1: 'border-b-primaryColor', circle2: 'border-b-primaryColor' }} />
                    <p className="text-sm font-medium text-fontBlack">Verifying your payment, please wait…</p>
                </div>
            )}

            {/* Payment Status Banner */}
            {paymentStatus === 'success' && (
                <div className="flex items-start gap-3 rounded-2xl border border-[#4CAF50] bg-[#E8F5E9] px-5 py-4">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4CAF50] text-white">
                        <HiPlus className="size-3" />
                    </span>
                    <div className="flex-1">
                        <p className="font-semibold text-[#2E7D32]">Payment Successful</p>
                        <p className="text-sm text-[#2E7D32]/80">Your credits have been added to your account.</p>
                    </div>
                    <button
                        onClick={() => setPaymentStatus(null)}
                        className="text-[#2E7D32]/60 hover:text-[#2E7D32] transition-colors"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                </div>
            )}
            {paymentStatus === 'fail' && (
                <div className="flex items-start gap-3 rounded-2xl border border-danger bg-[#FFEBEE] px-5 py-4">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-danger text-white">
                        <HiMinus className="size-3" />
                    </span>
                    <div className="flex-1">
                        <p className="font-semibold text-[#C62828]">Payment Failed</p>
                        <p className="text-sm text-[#C62828]/80">Your payment was not completed. Please try again.</p>
                    </div>
                    <button
                        onClick={() => setPaymentStatus(null)}
                        className="text-[#C62828]/60 hover:text-[#C62828] transition-colors"
                        aria-label="Dismiss"
                    >
                        ✕
                    </button>
                </div>
            )}

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
                                        {pkg.name && (
                                            <p className="text-sm font-medium text-darkSilver mt-2">
                                                {pkg.name}
                                            </p>
                                        )}
                                        <p className="font-bold text-xl text-fontBlack mt-1">
                                            {pkg.credits}
                                        </p>
                                        <p className='text-sm text-darkSilver'>credits</p>
                                        {pkg.bonus && (
                                            <span className="inline-flex mt-1 rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-xs font-medium text-[#4CAF50]">
                                                +{pkg.bonus} bonus
                                            </span>
                                        )}
                                        <p className="mt-3 font-bold text-xl text-fontBlack">€{pkg.totalPrice}</p>
                                        <p className="text-xs text-darkSilver">€{pkg.unitPrice} per credit</p>
                                        <div className="mt-1.5 space-y-0.5 text-left text-xs text-darkSilver border-t border-borderDark pt-1.5">
                                            <div className="flex justify-between gap-4">
                                                <span>Subtotal</span>
                                                <span>€{pkg.price}</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span>VAT ({pkg.vatRate}%)</span>
                                                <span>€{pkg.vatAmount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        className={`btn_radius font-medium ${pkg.popular ? 'btn_bg_blue' : 'bg-[#F3F4F6]'} w-full`}
                                        isLoading={stripeLoading && selectedPackageId === pkg.id}
                                        isDisabled={stripeLoading}
                                        onPress={() => handlePurchase(pkg)}
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
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    className="btn_radius btn_bg_blue font-medium"
                                    startContent={<HiOutlineArrowDownTray className="size-5" />}
                                    endContent={<MdKeyboardArrowDown className="size-5" />}
                                >
                                    Download
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Download format">
                                <DropdownItem key="csv" onPress={() => handleDownload('csv')}>
                                    Download as CSV
                                </DropdownItem>
                                <DropdownItem key="pdf" onPress={() => handleDownload('pdf')}>
                                    Download as PDF
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-fontBlack">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <Spinner size="lg" color="primary" />
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-darkSilver">
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
                                                <td className="px-4 py-4">
                                                    {txn.type?.toLowerCase() === 'purchase' && (
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="flat"
                                                            className="bg-[#F3F4F6] text-fontBlack hover:bg-[#E5E7EB]"
                                                            isLoading={downloadingInvoiceId === txn._id}
                                                            onPress={() => handleDownloadInvoice(txn._id)}
                                                            aria-label="Download invoice"
                                                        >
                                                            {downloadingInvoiceId !== txn._id && (
                                                                <HiOutlineArrowDownTray className="size-4" />
                                                            )}
                                                        </Button>
                                                    )}
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
