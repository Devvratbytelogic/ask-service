'use client'
import React, { useState } from 'react'
import { Tabs, Tab } from '@heroui/react'

type TabId = 'profile' | 'security' | 'notifications';

export default function AccountDetails() {
    const [activeTab, setActiveTab] = useState<TabId>('profile');

    return (
        <>
            <div className="rounded-2xl border border-borderDark p-6">
                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(key) => setActiveTab(key as TabId)}
                    variant="light"
                    classNames={{
                        base: 'w-full',
                        tabList: 'mb-6 gap-0 p-1 rounded-full bg-[#F3F4F6] w-full flex w-full',
                        tab: 'rounded-full p-6 text-sm font-normal text-darkSilver data-[selected=true]:text-fontBlack',
                        cursor: 'rounded-full bg-white shadow-sm',
                        // panel: 'overflow-visible',
                    }}
                >
                    <Tab key="profile" title="Profile">
                        <div className='space-y-6'>
                            <p>Profile</p>
                        </div>
                    </Tab>
                    <Tab key="security" title="Security">
                        <p>Security</p>
                    </Tab>
                    <Tab key="notifications" title="Notifications">
                        <p>Notifications</p>
                    </Tab>
                </Tabs>
            </div>
        </>
    )
}
