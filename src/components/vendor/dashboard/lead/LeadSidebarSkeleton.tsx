function Bone({ className = '' }: { className?: string }) {
    return (
        <div
            className={`rounded-md bg-appBorder/60 dark:bg-white/8 animate-pulse ${className}`}
        />
    )
}

function LeadSidebarItemSkeleton({ active = false }: { active?: boolean }) {
    return (
        <div
            className={`w-full px-[14px] py-3 border-b border-appBorderSub border-l-[3px] ${active ? 'border-l-amber bg-amber/8' : 'border-l-transparent'}`}
        >
            <div className="flex items-center justify-between mb-[5px] gap-2">
                <div className="flex items-center gap-[5px] min-w-0 flex-1">
                    <Bone className="h-5 w-16 rounded-full shrink-0" />
                    <Bone className="h-3.5 flex-1 max-w-[120px]" />
                </div>
                <Bone className="h-5 w-10 rounded-full shrink-0" />
            </div>

            <div className="flex flex-col gap-[5px]">
                <Bone className="h-2.5 w-full max-w-[180px]" />
                <Bone className="h-2.5 w-24" />
                <Bone className="h-2.5 w-32" />
            </div>

            <Bone className="mt-[7px] h-[26px] w-full rounded-[6px]" />
        </div>
    )
}

export default function LeadSidebarSkeleton({ count = 6 }: { count?: number }) {
    return (
        <aside
            className="bg-appSurface border-r border-appBorder overflow-y-auto sticky top-[58px] h-[calc(100vh-58px)]"
            role="status"
            aria-live="polite"
            aria-label="Chargement des prospects disponibles"
        >
            <div className="p-4 pb-2.5">
                <Bone className="h-3 w-40 mb-2.5" />
                <Bone className="h-9 w-full rounded-lg" />
            </div>

            <div className="px-[14px] mb-1.5">
                <Bone className="h-2.5 w-32" />
            </div>

            {Array.from({ length: count }).map((_, index) => (
                <LeadSidebarItemSkeleton key={index} active={index === 0} />
            ))}
        </aside>
    )
}
