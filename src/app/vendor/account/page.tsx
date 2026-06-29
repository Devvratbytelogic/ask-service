import { getVendorAccountRoutePath, type VendorAccountSection } from '@/routes/routes'
import { redirect } from 'next/navigation'

const VALID_SECTIONS: VendorAccountSection[] = [
    'profile',
    'security',
    'notifications',
    'documents',
    'reviews',
    'payment-history',
]

export default async function LegacyVendorAccountRedirectPage({
    searchParams,
}: {
    searchParams: Promise<{ section?: string }>
}) {
    const { section } = await searchParams
    const targetSection =
        section && VALID_SECTIONS.includes(section as VendorAccountSection)
            ? (section as VendorAccountSection)
            : 'profile'
    redirect(getVendorAccountRoutePath(targetSection))
}
