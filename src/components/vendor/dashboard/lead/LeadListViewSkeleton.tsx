function Bone({ className = '' }: { className?: string }) {
    return (
        <div
            className={`rounded-md bg-appBorder/60 dark:bg-white/8 animate-pulse ${className}`}
        />
    )
}

function LeadListItemSkeleton() {
    return (
        <div className="w-full px-4 py-3.5 border-b border-appBorderSub">
            <div className="flex items-start justify-between gap-2.5 mb-1.5">
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                        <Bone className="h-4 w-10 rounded-sm shrink-0" />
                        <Bone className="h-3.5 w-36 max-w-full" />
                    </div>
                    <Bone className="h-3 w-24" />
                    <Bone className="h-3 w-32" />
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <Bone className="h-5 w-12 rounded-full" />
                    <Bone className="size-3.5 rounded-sm" />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Bone className="h-3 w-28" />
                <Bone className="h-3 w-36" />
            </div>

            <Bone className="mt-2.5 h-7 w-full rounded-md" />
        </div>
    )
}

export default function LeadListViewSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div
            className="min-h-[calc(100vh-68px)] bg-appBg"
            role="status"
            aria-live="polite"
            aria-label="Chargement des prospects disponibles"
        >
            <div className="sticky top-17 z-30 bg-appSurface border-b border-appBorder">
                <div className="px-4 pt-4 pb-3">
                    <div className="flex items-baseline justify-between gap-3 mb-3">
                        <Bone className="h-4 w-44" />
                        <Bone className="h-3 w-6" />
                    </div>
                    <Bone className="h-9 w-full rounded-lg" />
                </div>
            </div>

            <div className="flex flex-col">
                {Array.from({ length: count }).map((_, index) => (
                    <LeadListItemSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}
