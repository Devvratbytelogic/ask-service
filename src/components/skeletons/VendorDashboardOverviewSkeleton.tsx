function Bone({ className = '' }: { className?: string }) {
    return (
        <div
            className={`rounded-md bg-appBorder/60 dark:bg-white/8 animate-pulse ${className}`}
        />
    )
}

function StatCardSkeleton({ highlight = false }: { highlight?: boolean }) {
    return (
        <div
            className={`rounded-2xl border p-5 ${
                highlight
                    ? 'border-trust-green/30 bg-emerald-50 dark:bg-linear-to-br dark:from-[#0D2018] dark:to-[#111D14]'
                    : 'border-appBorder bg-appCard'
            }`}
        >
            <Bone className="w-[38px] h-[38px] rounded-[11px] mb-3.5" />
            <Bone className="h-8 w-16 mb-1" />
            <Bone className="h-3.5 w-28 mb-3" />
            <Bone className="h-3 w-40" />
        </div>
    )
}

function OpportunityCardSkeleton() {
    return (
        <div className="p-[18px] bg-appCard h-full">
            <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                    <Bone className="w-[30px] h-[30px] rounded-[9px] shrink-0" />
                    <Bone className="h-[18px] w-24" />
                </div>
                <Bone className="w-7 h-7 rounded-[7px]" />
            </div>

            <div className="flex flex-col gap-[5px] mb-3">
                <Bone className="h-3.5 w-full" />
                <Bone className="h-3.5 w-4/5" />
                <Bone className="h-3.5 w-3/5" />
            </div>

            <div className="px-3 py-2.5 bg-black/3 dark:bg-white/3 border border-appBorder rounded-[10px] mb-3.5 space-y-[5px]">
                <div className="flex items-center gap-2">
                    <Bone className="w-[26px] h-[26px] rounded-full shrink-0" />
                    <Bone className="h-3.5 w-28" />
                </div>
                <Bone className="h-3 w-36" />
                <Bone className="h-3 w-44" />
            </div>

            <div className="flex items-center gap-2">
                <Bone className="flex-1 h-[38px] rounded-[9px]" />
                <Bone className="h-[38px] w-24 rounded-[9px]" />
            </div>
        </div>
    )
}

function OpportunityGroupSkeleton({ cardCount = 3 }: { cardCount?: number }) {
    return (
        <div className="bg-appSurface border border-appBorder rounded-2xl overflow-hidden mb-4">
            <div className="px-[18px] py-3 bg-black/2 dark:bg-white/2 border-b border-appBorderSub flex items-center gap-2.5 flex-wrap">
                <Bone className="h-6 w-16 rounded-[5px]" />
                <Bone className="h-5 w-32" />
                <Bone className="h-6 w-20 rounded-[6px]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-appBorderSub">
                {Array.from({ length: cardCount }).map((_, i) => (
                    <OpportunityCardSkeleton key={i} />
                ))}
            </div>

            <div className="px-[18px] py-3 border-t border-appBorderSub flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 bg-black/1 dark:bg-white/1">
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Bone key={i} className="w-8 h-8 rounded-full" />
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Bone className="h-8 w-[72px] rounded-lg" />
                    <Bone className="h-3 w-24" />
                </div>
            </div>
        </div>
    )
}

export default function VendorDashboardOverviewSkeleton({
    showStatCards = true,
}: {
    showStatCards?: boolean
}) {
    return (
        <div
            className="max-w-[1400px] mx-auto px-7 py-7"
            role="status"
            aria-live="polite"
            aria-label="Chargement du tableau de bord"
        >
            <div className="mb-7">
                <Bone className="h-8 w-72 mb-2" />
                <Bone className="h-3.5 w-56" />
            </div>

            {showStatCards && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
                    <StatCardSkeleton highlight />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                    <StatCardSkeleton />
                </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-3 mb-[18px]">
                <div className="flex items-center gap-2.5 flex-wrap">
                    <Bone className="h-5 w-48" />
                    <Bone className="h-6 w-36 rounded-full" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Bone className="h-9 w-[180px] rounded-lg" />
                    <Bone className="h-9 w-[180px] rounded-lg" />
                    <Bone className="h-3 w-40" />
                </div>
            </div>

            <OpportunityGroupSkeleton cardCount={3} />
            <OpportunityGroupSkeleton cardCount={3} />

            <div className="bg-appSurface border border-dashed border-appBorder rounded-2xl px-10 py-10 text-center mt-2">
                <Bone className="h-5 w-64 mx-auto mb-2" />
                <Bone className="h-3.5 w-80 max-w-full mx-auto mb-5" />
                <Bone className="h-11 w-72 max-w-full mx-auto rounded-[10px]" />
            </div>
        </div>
    )
}
