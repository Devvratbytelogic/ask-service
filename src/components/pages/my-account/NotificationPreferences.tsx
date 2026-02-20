'use client'

import React, { useState } from 'react'
import { Button, Switch } from '@heroui/react'

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

export default function NotificationPreferences() {
    const [preferences, setPreferences] = useState(initialPreferences)

    const handleToggle = (key: NotificationKey) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
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
                                            classNames={{
                                                wrapper:
                                                    'group-data-[selected=true]:bg-primaryColor',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-center">
                <Button className="rounded-xl bg-primaryColor px-8 font-medium text-white">
                    Save Preference
                </Button>
            </div>
        </>
    )
}
