'use client'

import React, { useState } from 'react'
import { addToast, Button, Switch } from '@heroui/react'
import { useVendorNotificationPreferencesMutation } from '@/redux/rtkQueries/allPostApi'
import type { VendorNotificationPreferencesPayload } from '@/types/notifications'

type NotificationKey =
    | 'email_new_quotes'
    | 'email_messages'
    | 'email_product_updates'
    | 'push_new_quotes'
    | 'push_messages'
    | 'sms_important_updates'

const initialPreferences: Record<NotificationKey, boolean> = {
    email_new_quotes: true,
    email_messages: true,
    email_product_updates: true,
    push_new_quotes: true,
    push_messages: false,
    sms_important_updates: true,
}

/** Default vendor payload; used when variant is vendor */
const defaultVendorPayload: VendorNotificationPreferencesPayload = {
    email_notifications: {
        new_leads_available: true,
        quote_accepted: true,
        messages: true,
        low_credit_balance: true,
        platform_updates: false,
    },
    push_notifications: {
        new_leads: true,
        messages: true,
        low_credits: false,
    },
    sms_notifications: {
        important_updates: false,
    },
}

const notificationItems: {
    category: string
    items: {
        key: NotificationKey
        title: string
        description: string
    }[]
}[] = [
        {
            category: 'Email Notifications',
            items: [
                {
                    key: 'email_new_quotes',
                    title: 'New Quotes',
                    description: 'Get notified when you receive new quotes',
                },
                {
                    key: 'email_messages',
                    title: 'Messages',
                    description: 'Get notified when you receive new messages',
                },
                {
                    key: 'email_product_updates',
                    title: 'Product Updates',
                    description: 'Get notified about new features and updates',
                },
            ],
        },
        {
            category: 'Push Notifications',
            items: [
                {
                    key: 'push_new_quotes',
                    title: 'New Quotes',
                    description: 'Browser notifications for new quotes',
                },
                {
                    key: 'push_messages',
                    title: 'Messages',
                    description: 'Browser notifications for new messages',
                },
            ],
        },
        {
            category: 'SMS Notifications',
            items: [
                {
                    key: 'sms_important_updates',
                    title: 'Important Updates',
                    description: 'SMS for critical account activity',
                },
            ],
        },
    ]

interface NotificationPreferencesProps {
    variant?: 'default' | 'vendor'
}

export default function NotificationPreferences({ variant = 'default' }: NotificationPreferencesProps) {
    const [preferences, setPreferences] = useState(initialPreferences)
    const [vendorPayload, setVendorPayload] = useState<VendorNotificationPreferencesPayload>(defaultVendorPayload)
    const [updateVendorNotifications, { isLoading: isSavingVendor }] = useVendorNotificationPreferencesMutation()

    const handleToggle = (key: NotificationKey) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const handleVendorToggle = (
        category: keyof VendorNotificationPreferencesPayload,
        key: string
    ) => {
        setVendorPayload((prev) => {
            const cat = prev[category] as Record<string, boolean>
            return {
                ...prev,
                [category]: { ...cat, [key]: !cat[key] },
            }
        })
    }

    const handleSave = async () => {
        if (variant === 'vendor') {
            try {
                await updateVendorNotifications(vendorPayload).unwrap()
                addToast({ title: 'Notification preferences saved', color: 'success', timeout: 2000 })
            } catch {
                // Error handled by RTK Query / toast
            }
        } else {
            addToast({ title: 'Notification preferences saved', color: 'success', timeout: 2000 })
        }
    }

    const switchClass = { wrapper: 'group-data-[selected=true]:bg-primaryColor' }

    if (variant === 'vendor') {
        return (
            <>
                <h2 className="mb-6 text-lg font-bold text-fontBlack">
                    Notification Preferences
                </h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="mb-4 font-bold text-fontBlack">Email Notifications</h3>
                        <div className="space-y-2">
                            {[
                                { key: 'new_leads_available' as const, title: 'New leads available', description: 'Get notified when new leads are available' },
                                { key: 'quote_accepted' as const, title: 'Quote accepted', description: 'Get notified when a quote is accepted' },
                                { key: 'messages' as const, title: 'Messages', description: 'Get notified about new messages' },
                                { key: 'low_credit_balance' as const, title: 'Low credit balance', description: 'Get notified when your credit balance is low' },
                                { key: 'platform_updates' as const, title: 'Platform updates', description: 'Get notified about platform news and updates' },
                            ].map((item) => (
                                <div
                                    key={item.key}
                                    className="border border-borderDark rounded-xl p-4 flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-4"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-fontBlack">{item.title}</p>
                                        <p className="mt-0.5 text-sm text-darkSilver">{item.description}</p>
                                    </div>
                                    <Switch
                                        size="sm"
                                        isSelected={vendorPayload.email_notifications[item.key]}
                                        onValueChange={() => handleVendorToggle('email_notifications', item.key)}
                                        classNames={switchClass}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-4 font-bold text-fontBlack">Push Notifications</h3>
                        <div className="space-y-2">
                            {[
                                { key: 'new_leads' as const, title: 'New leads', description: 'Browser notifications for new leads' },
                                { key: 'messages' as const, title: 'Messages', description: 'Browser notifications for messages' },
                                { key: 'low_credits' as const, title: 'Low credits', description: 'Get notified when credits are low' },
                            ].map((item) => (
                                <div
                                    key={item.key}
                                    className="border border-borderDark rounded-xl p-4 flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-4"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-fontBlack">{item.title}</p>
                                        <p className="mt-0.5 text-sm text-darkSilver">{item.description}</p>
                                    </div>
                                    <Switch
                                        size="sm"
                                        isSelected={vendorPayload.push_notifications[item.key]}
                                        onValueChange={() => handleVendorToggle('push_notifications', item.key)}
                                        classNames={switchClass}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-4 font-bold text-fontBlack">SMS Notifications</h3>
                        <div className="space-y-2">
                            <div className="border border-borderDark rounded-xl p-4 flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-4">
                                <div className="flex-1">
                                    <p className="font-medium text-fontBlack">Important updates</p>
                                    <p className="mt-0.5 text-sm text-darkSilver">SMS for critical account activity</p>
                                </div>
                                <Switch
                                    size="sm"
                                    isSelected={vendorPayload.sms_notifications.important_updates}
                                    onValueChange={() => handleVendorToggle('sms_notifications', 'important_updates')}
                                    classNames={switchClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        className="rounded-xl bg-primaryColor px-8 font-medium text-white"
                        onPress={handleSave}
                        isLoading={isSavingVendor}
                        isDisabled={isSavingVendor}
                    >
                        Save Preference
                    </Button>
                </div>
            </>
        )
    }

    return (
        <>
            <h2 className="mb-6 text-lg font-bold text-fontBlack">
                Notification Preferences
            </h2>

            <div className="space-y-8">
                {notificationItems.map((section) => (
                    <div key={section.category}>
                        <h3 className="mb-4 font-bold text-fontBlack">{section.category}</h3>
                        <div className="space-y-2">
                            {section.items.map((item) => (
                                <div
                                    key={item.key}
                                    className="border border-borderDark rounded-xl p-4 flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-4"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-fontBlack">{item.title}</p>
                                        <p className="mt-0.5 text-sm text-darkSilver">
                                            {item.description}
                                        </p>
                                    </div>
                                    <div className="shrink-0 pt-2 sm:pt-0">
                                        <Switch
                                            size="sm"
                                            isSelected={preferences[item.key]}
                                            onValueChange={() => handleToggle(item.key)}
                                            classNames={switchClass}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <Button className="rounded-xl bg-primaryColor px-8 font-medium text-white" onPress={handleSave}>
                    Save Preference
                </Button>
            </div>
        </>
    )
}
