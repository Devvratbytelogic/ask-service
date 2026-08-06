function Bone({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-md bg-appBorder/60 dark:bg-white/8 animate-pulse ${className}`}
    />
  )
}

function DemandCardSkeleton() {
  return (
    <div className="bg-appCard border border-appBorder rounded-2xl overflow-hidden">
      {/* Desktop skeleton */}
      <div className="hidden md:grid p-5 grid-cols-[auto_1fr_auto_auto] gap-4 items-center">
        <Bone className="w-11 h-11 rounded-[13px] shrink-0" />
        <div className="min-w-0 space-y-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <Bone className="h-[18px] w-36" />
            <Bone className="h-[18px] w-20 rounded-[5px]" />
            <Bone className="h-[18px] w-16 rounded-[5px]" />
          </div>
          <div className="flex items-center gap-3.5 flex-wrap">
            <Bone className="h-3.5 w-24" />
            <Bone className="h-3.5 w-20" />
            <Bone className="h-3.5 w-40" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1 shrink-0">
          <Bone className="h-7 w-8" />
          <Bone className="h-2.5 w-14" />
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Bone className="h-8 w-24 rounded-[8px]" />
          <Bone className="h-8 w-8 rounded-[8px]" />
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="md:hidden p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Bone className="h-4 w-28" />
          <Bone className="h-5 w-18 rounded-md" />
        </div>
        <div className="flex gap-3">
          <Bone className="w-12 h-12 rounded-xl shrink-0" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Bone className="h-5 w-28 rounded-md" />
            <Bone className="h-3 w-32" />
            <Bone className="h-3 w-40" />
          </div>
        </div>
        <div className="mt-3.5 flex items-center gap-2">
          <Bone className="h-10 flex-1 rounded-lg" />
          <Bone className="h-10 w-11 rounded-lg shrink-0" />
          <Bone className="h-10 w-10 rounded-lg shrink-0" />
        </div>
      </div>
    </div>
  )
}

export default function DemandListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <DemandCardSkeleton key={i} />
      ))}
    </div>
  )
}
