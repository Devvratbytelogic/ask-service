import { ArrowSendIconSVG, CheckmarkIconSVG, ClockCircleIconSVG, } from '@/components/library/AllSVG'
import OpportunityCard from './OpportunityCard'
import { IAvailableLeadByCategoryDataEntity } from '@/types/availableLeadByCategory'
import { generateLeadDetailRoutePath } from '@/routes/routes'
import Link from 'next/link'
import { Pagination, Select, SelectItem } from '@heroui/react'

const LEADS_LIMIT_OPTIONS = ['3', '6', '9'] as const

type GroupStatus = 'new' | 'pending' | 'accepted' | 'ignored'

const GROUP_STATUS_VARIANTS: Record<GroupStatus, { wrapperClass: string; icon: React.ReactNode }> = {
    new: {
        wrapperClass: 'bg-trust-green/15 text-[#6EE7B7] border border-trust-green/20',
        icon: <CheckmarkIconSVG />,
    },
    pending: {
        wrapperClass: 'bg-primaryColor/12 text-[#93C5FD] border border-primaryColor/20',
        icon: <ArrowSendIconSVG size={10} />,
    },
    accepted: {
        wrapperClass: 'bg-trust-green/15 text-[#6EE7B7] border border-trust-green/20',
        icon: <CheckmarkIconSVG />,
    },
    ignored: {
        wrapperClass: 'bg-black/5 dark:bg-white/5 text-appTextMuted border border-appBorderSub',
        icon: <ClockCircleIconSVG size={10} />,
    },
}

function resolveGroupStatus(status: string | null | undefined): GroupStatus {
    switch ((status ?? '').toLowerCase()) {
        case 'pending':
            return 'pending'
        case 'accepted':
            return 'accepted'
        case 'ignored':
            return 'ignored'
        case 'new':
        default:
            return 'new'
    }
}

function OppGroupStatusBadge({ status, label }: { status: string | null | undefined; label: string | null | undefined }) {
    if (!status && !label) return null

    const { wrapperClass, icon } = GROUP_STATUS_VARIANTS[resolveGroupStatus(status)]

    return (
        <span className={`flex items-center gap-[5px] text-[11px] font-extrabold uppercase tracking-[0.5px] px-2.5 py-1 rounded-[5px] ${wrapperClass}`}>
            {icon}
            {label ?? status ?? ''}
        </span>
    )
}

// ─── OpportunityGroup ─────────────────────────────────────────────────────────

export default function OpportunityGroup({
    item,
    setLeadsPage,
    setLeadsLimit,
    setPaginateServiceCategory,
    canPurchaseLeads,
}: {
    item: IAvailableLeadByCategoryDataEntity
    setLeadsPage: (page: number) => void
    setLeadsLimit: (limit: number) => void
    setPaginateServiceCategory: (serviceCategory: string) => void
    canPurchaseLeads: boolean
}) {
    const leads = item?.leads ?? []
    const hasLeads = leads.length > 0
    const categoryId = item.service_category?._id ?? ''
    const currentPage = item.pagination?.page ?? 1
    const currentLimit = item.pagination?.limit ?? 6
    const totalPages = item.pagination?.totalPages ?? 0
    return (
        <div className="bg-appSurface border border-appBorder rounded-2xl overflow-hidden mb-4">
            <div className="px-[18px] py-3 bg-black/2 dark:bg-white/2 border-b border-appBorderSub flex items-center gap-2.5 flex-wrap">
                <OppGroupStatusBadge status={item.status} label={item.status_label} />
                <span className="text-[16px] font-extrabold text-appText">{item.service_category?.title}</span>
                {item?.leads_count > 0 && (
                    <span className="text-[12px] text-appTextMuted bg-black/2 dark:bg-white/3 border border-appBorderSub px-2 py-[3px] rounded-[6px]">
                        {item?.leads_count} prospect{item?.leads_count > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-appBorderSub">
                {hasLeads ? (
                    leads.map((lead, index) => (
                        <Link href={generateLeadDetailRoutePath(lead._id)} key={index}>
                            <OpportunityCard lead={lead} canPurchaseLeads={canPurchaseLeads} />
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full px-[18px] py-10 text-center">
                        <p className="text-[14px] text-appTextSec">Aucun prospect pour cette catégorie.</p>
                    </div>
                )}
            </div>

            {hasLeads && totalPages > 0 && (
            <div className="px-[18px] py-3 border-t border-appBorderSub flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 bg-black/1 dark:bg-white/1">
                <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={(page) => {
                        setLeadsPage(page)
                        setPaginateServiceCategory(categoryId)
                    }}
                    showControls
                    color="primary"
                    radius="full"
                    size="sm"
                    classNames={{
                        cursor: 'bg-primaryColor text-white',
                        item: 'cursor-pointer',
                        prev: 'cursor-pointer',
                        next: 'cursor-pointer',
                        ellipsis: 'cursor-pointer',
                    }}
                />
                <div className="flex items-center gap-2">
                    <Select
                        selectedKeys={[String(currentLimit)]}
                        onSelectionChange={(keys) => {
                            const key = Array.from(keys as Set<string>)[0]
                            if (key) {
                                setLeadsLimit(Number(key))
                                setLeadsPage(1)
                                setPaginateServiceCategory(categoryId)
                            }
                        }}
                        className="min-w-[72px]"
                        size="sm"
                        classNames={{
                            trigger: 'min-h-8 border border-appBorderSub bg-appSurface shadow-none',
                            value: 'text-[12px]',
                        }}
                        aria-label="Prospects par page"
                    >
                        {LEADS_LIMIT_OPTIONS.map((n) => (
                            <SelectItem key={n}>{n}</SelectItem>
                        ))}
                    </Select>
                    <span className="text-[11px] text-appTextMuted whitespace-nowrap">
                        Prospects par page
                    </span>
                </div>
            </div>
            )}
        </div>
    )
}
