'use client'
import type { NavId } from './AccountSidebar'
import SecuritySettings from './SecuritySettings'
import NotificationPreferences from './NotificationPreferences'
import ProfileInfo from './ProfileInfo'
import VendorProfileInfo from './VendorProfileInfo'
import VendorDocuments from './VendorDocuments'
import VendorReviews from '@/components/vendor/profile/VendorReviews'
import VendorPaymentHistory from './VendorPaymentHistory'

interface AccountDetailsProps {
    activeSection?: NavId
    variant?: 'default' | 'vendor'
}
export default function AccountDetails({ activeSection = 'profile', variant = 'default' }: AccountDetailsProps) {
    return (
        <>
            <div className="rounded-2xl border border-borderDark p-4">
                {activeSection === 'profile' && variant === 'default' && <ProfileInfo />}
                {activeSection === 'profile' && variant === 'vendor' && <VendorProfileInfo />}
                {activeSection === 'security' && <SecuritySettings variant={variant} />}
                {activeSection === 'notifications' && <NotificationPreferences variant={variant} />}
                {variant === 'vendor' && activeSection === 'documents' && <VendorDocuments />}
                {variant === 'vendor' && activeSection === 'reviews' && <VendorReviews hideLeaveReviewButton={variant === 'vendor'} />}
                {variant === 'vendor' && activeSection === 'payment-history' && <VendorPaymentHistory />}
            </div>
        </>
    )
}