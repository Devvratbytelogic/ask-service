import React from 'react'
import { getVendorDashboardRoutePath } from '@/routes/routes'
import { BackArrowSVG, LockPrimaryColorSVG, UnlockGreenIconSVG } from '@/components/library/AllSVG'
import { Button } from '@heroui/react'
import { useRouter } from 'next/navigation'
import { LeadFullDetailsData } from './LeadFullDetails'

interface LeadHeaderProps {
    data: LeadFullDetailsData;
}
export default function LeadHeader({ data }: LeadHeaderProps) {
    const router = useRouter()

    return (
        <>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <Button
                        isIconOnly
                        className="btn_radius btn_bg_white"
                        onPress={() => router.push(getVendorDashboardRoutePath())}
                    >
                        <BackArrowSVG />
                    </Button>
                    <div className="space-y-0.5">
                        <h1 className="font-bold text-xl md:text-2xl text-fontBlack">
                            {data?.title}
                        </h1>
                        <p className="text-sm text-darkSilver">
                            Lead {data?.id}
                            <span className="mx-1.5">•</span>
                            {data?.postedAt}
                        </p>
                    </div>
                </div>
                {data?.unlocked ? (
                    <Button className="btn_radius font-medium bg-[#DCFCE7] text-[#008236] hover:bg-[#7BF1A8]"
                        startContent={<UnlockGreenIconSVG />} >
                        View Full Details
                    </Button>) :
                    (
                        <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right">
                                <p className="font-bold text-fontBlack">
                                    {data?.creditsToUnlock} Credits
                                </p>
                                <p className="text-xs text-darkSilver">to unlock</p>
                            </div>
                            <Button className="btn_radius btn_bg_blue font-medium shrink-0" startContent={<LockPrimaryColorSVG className="size-4 text-white" />} >
                                Unlock Lead
                            </Button>
                        </div>
                    )}
            </div>

        </>
    )
}
