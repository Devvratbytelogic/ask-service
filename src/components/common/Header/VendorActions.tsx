'use client'

import Link from 'next/link'
import { FaCoins } from 'react-icons/fa6'
import { getCreditsRoutePath } from '@/routes/routes'
import NotificationsPopover from './NotificationsPopover'
import ThemeToggle from '@/components/common/ThemeToggle'
import AccountMenuDropdown from './AccountMenuDropdown'
import { useGetVendorDashboardDataQuery } from '@/redux/rtkQueries/clientSideGetApis'

interface VendorActionsProps {
    isAuthenticated?: boolean
}

export default function VendorActions({
    isAuthenticated = false,
}: VendorActionsProps) {
    const { data: dashboardData } = useGetVendorDashboardDataQuery(undefined, {
        skip: !isAuthenticated,
    })
    const credits = dashboardData?.data?.creditBalance ?? 0

    return (
        <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
            <NotificationsPopover isVendor isAuthenticated={isAuthenticated} />

            <Link
                href={getCreditsRoutePath()}
                title={`${credits} Points`}
                className="hidden md:flex items-center gap-1 lg:gap-1.5 max-w-36 lg:max-w-44 xl:max-w-none px-2 lg:px-3 xl:px-3.5 py-1.5 rounded-full bg-amber/12 border border-amber/30 hover:bg-amber/20 transition-all shrink-0"
            >
                <FaCoins aria-hidden className="size-3.5 shrink-0 text-amber" />
                <strong className="text-[13px] lg:text-[14px] font-extrabold text-amber leading-none truncate">
                    {credits}
                </strong>
                <span className="hidden lg:inline text-[11px] text-amber/70 leading-none shrink-0">Points</span>
            </Link>

            <ThemeToggle />

            <AccountMenuDropdown isVendorView />
        </div>
    )
}
