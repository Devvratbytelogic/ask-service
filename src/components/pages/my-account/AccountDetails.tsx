'use client'
import SecuritySettings from './SecuritySettings'
import NotificationPreferences from './NotificationPreferences'
import ProfileInfo from './ProfileInfo'

type NavId = 'profile' | 'security' | 'notifications'
interface AccountDetailsProps {
    activeSection?: NavId
}
export default function AccountDetails({ activeSection = 'profile' }: AccountDetailsProps) {
    return (
        <>
            <div className="rounded-2xl border border-borderDark p-4">
                {activeSection === 'profile' && <ProfileInfo />}
                {activeSection === 'security' && <SecuritySettings />}
                {activeSection === 'notifications' && <NotificationPreferences />}
            </div>
        </>
    )
}