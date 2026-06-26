// Skeleton loader that mirrors the DemandCard layout

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
      <div className="p-5 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_auto] gap-3 md:gap-4 items-center">

        {/* Service icon */}
        <Bone className="w-11 h-11 rounded-[13px] shrink-0" />

        {/* Content */}
        <div className="min-w-0 space-y-2.5">
          {/* Title + status badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Bone className="h-[18px] w-36" />
            <Bone className="h-[18px] w-20 rounded-[5px]" />
            <Bone className="h-[18px] w-16 rounded-[5px]" />
          </div>
          {/* Meta row */}
          <div className="flex items-center gap-3.5 flex-wrap">
            <Bone className="h-3.5 w-24" />
            <Bone className="h-3.5 w-20" />
            <Bone className="h-3.5 w-16" />
            <Bone className="h-3.5 w-18" />
          </div>
        </div>

        {/* Quotes count — hidden on mobile */}
        <div className="hidden md:flex flex-col items-center gap-1 shrink-0">
          <Bone className="h-7 w-8" />
          <Bone className="h-2.5 w-14" />
          <Bone className="h-2.5 w-12" />
        </div>

        {/* Action buttons */}
        <div className="col-span-full md:col-span-1 flex items-center gap-1.5 shrink-0">
          <Bone className="h-8 w-24 rounded-[8px]" />
          <Bone className="h-8 w-8 rounded-[8px]" />
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
