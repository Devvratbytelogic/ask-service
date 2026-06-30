function Bone({ className = '' }: { className?: string }) {
    return (
        <div
            className={`rounded-md bg-appBorder/60 dark:bg-white/8 animate-pulse ${className}`}
        />
    )
}

function LeadCardSkeleton() {
    return (
        <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden mb-3.5">
            <div className="px-[22px] py-5 border-b border-appBorderSub">
                <div className="flex items-center gap-2.5 flex-wrap mb-3">
                    <Bone className="h-6 w-28 rounded-full" />
                    <Bone className="h-6 w-24 rounded-full" />
                    <Bone className="h-5 w-10 rounded-[4px]" />
                </div>

                <div className="flex items-center gap-[7px] mb-2.5">
                    <Bone className="w-8 h-8 rounded-[9px] shrink-0" />
                    <Bone className="h-7 w-52 max-w-full" />
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                    <Bone className="h-3.5 w-36" />
                    <Bone className="h-3.5 w-14" />
                    <Bone className="h-3.5 w-24" />
                </div>
            </div>

            <div className="px-[22px] py-[18px] border-b border-appBorderSub">
                <div className="flex items-center gap-2 mb-3.5">
                    <Bone className="w-[26px] h-[26px] rounded-[8px] shrink-0" />
                    <Bone className="h-4 w-36" />
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="rounded-[10px] border border-appBorderSub bg-black/2 dark:bg-white/3 px-3.5 py-3 space-y-2"
                        >
                            <Bone className="h-2.5 w-20" />
                            <Bone className="h-3.5 w-full max-w-[140px]" />
                        </div>
                    ))}
                </div>

                <Bone className="mt-3.5 h-[46px] w-full rounded-[10px]" />
            </div>

            <div className="px-[22px] py-[18px]">
                <div className="flex items-center gap-2 mb-3.5">
                    <Bone className="w-[26px] h-[26px] rounded-[8px] shrink-0" />
                    <Bone className="h-4 w-32" />
                </div>

                <div className="flex flex-col gap-2.5">
                    <Bone className="h-4 w-44" />
                    <Bone className="h-4 w-56" />
                    <div className="flex gap-2 mt-2 flex-wrap">
                        <Bone className="h-6 w-24 rounded-full" />
                        <Bone className="h-6 w-24 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function UnlockPanelSkeleton() {
    return (
        <aside className="bg-appBg border-l border-appBorder p-[18px_14px] sticky top-[58px] h-[calc(100vh-58px)] overflow-y-auto">
            <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden">
                <div className="px-[18px] py-3.5 border-b border-appBorderSub">
                    <Bone className="h-4 w-40" />
                </div>

                <div className="p-4 flex flex-col gap-3.5">
                    <div className="py-2 flex flex-col items-center gap-2">
                        <Bone className="h-10 w-16" />
                        <Bone className="h-3 w-44" />
                    </div>

                    <Bone className="h-[52px] w-full rounded-[10px]" />

                    <div className="flex flex-col gap-2">
                        <Bone className="h-4 w-full" />
                        <Bone className="h-4 w-full" />
                        <Bone className="h-4 w-4/5" />
                    </div>

                    <Bone className="h-[52px] w-full rounded-[10px]" />
                    <Bone className="h-[50px] w-full rounded-[12px]" />
                    <Bone className="h-3 w-40 mx-auto" />
                </div>
            </div>
        </aside>
    )
}

export default function LeadDetailViewSkeleton() {
    return (
        <>
            <section
                className="bg-appBg overflow-y-auto p-5"
                role="status"
                aria-live="polite"
                aria-label="Chargement du prospect"
            >
                <div className="flex items-center gap-[7px] mb-[18px]">
                    <Bone className="h-3.5 w-3.5 rounded-full shrink-0" />
                    <Bone className="h-3 w-16" />
                    <Bone className="h-3 w-3 shrink-0" />
                    <Bone className="h-3.5 w-28" />
                </div>

                <LeadCardSkeleton />
            </section>

            <div className="hidden lg:block">
                <UnlockPanelSkeleton />
            </div>
        </>
    )
}
