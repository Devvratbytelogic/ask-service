'use client'

import React, { useEffect, useState } from 'react'
import { addToast, Button, Switch } from '@heroui/react'
import { useVendorNotificationPreferencesMutation, useUserNotificationPreferencesMutation } from '@/redux/rtkQueries/allPostApi'
import { useGetUserNotificationQuery } from '@/redux/rtkQueries/clientSideGetApis'
import type { UserNotificationPreferencesPayload, VendorNotificationPreferencesPayload } from '@/types/notifications'

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
            category: 'Notifications par email',
            items: [
                {
                    key: 'email_new_quotes',
                    title: 'Nouveaux devis',
                    description: 'Recevoir une notification lorsque vous recevez de nouveaux devis',
                },
                {
                    key: 'email_messages',
                    title: 'Messages',
                    description: 'Recevoir une notification lorsque vous recevez de nouveaux messages',
                },
                {
                    key: 'email_product_updates',
                    title: 'Mises à jour de la plateforme',
                    description: 'Recevoir des notifications sur les nouvelles fonctionnalités et les mises à jour',
                },
            ],
        },
        {
            category: 'Notifications push',
            items: [
                {
                    key: 'push_new_quotes',
                    title: 'Nouveaux devis',
                    description: 'Notifications du navigateur pour les nouveaux devis',
                },
                {
                    key: 'push_messages',
                    title: 'Messages',
                    description: 'Notifications du navigateur pour les nouveaux messages',
                },
            ],
        },
        {
            category: 'Notifications par SMS',
            items: [
                {
                    key: 'sms_important_updates',
                    title: 'Mises à jour importantes',
                    description: 'SMS pour les activités importantes du compte',
                },
            ],
        },
    ]

/** Map nested API payload to flat UI state */
function userPayloadToPreferences(data: UserNotificationPreferencesPayload | undefined): Record<NotificationKey, boolean> {
    if (!data?.email_notifications || !data?.push_notifications || !data?.sms_notifications) {
        return initialPreferences
    }
    return {
        email_new_quotes: data.email_notifications.new_quotes ?? initialPreferences.email_new_quotes,
        email_messages: data.email_notifications.messages ?? initialPreferences.email_messages,
        email_product_updates: data.email_notifications.product_updates ?? initialPreferences.email_product_updates,
        push_new_quotes: data.push_notifications.new_quotes ?? initialPreferences.push_new_quotes,
        push_messages: data.push_notifications.messages ?? initialPreferences.push_messages,
        sms_important_updates: data.sms_notifications.important_updates ?? initialPreferences.sms_important_updates,
    }
}

/** Map flat UI state to nested API payload */
function preferencesToUserPayload(prefs: Record<NotificationKey, boolean>): UserNotificationPreferencesPayload {
    return {
        email_notifications: {
            new_quotes: prefs.email_new_quotes,
            messages: prefs.email_messages,
            product_updates: prefs.email_product_updates,
        },
        push_notifications: {
            new_quotes: prefs.push_new_quotes,
            messages: prefs.push_messages,
        },
        sms_notifications: {
            important_updates: prefs.sms_important_updates,
        },
    }
}

interface NotificationPreferencesProps {
    variant?: 'default' | 'vendor'
}

export default function NotificationPreferences({ variant = 'default' }: NotificationPreferencesProps) {
    const { data: userNotificationData } = useGetUserNotificationQuery(undefined, { skip: variant === 'vendor' })
    const [updateUserNotifications, { isLoading: isSavingUser }] = useUserNotificationPreferencesMutation()
    const [vendorPayload, setVendorPayload] = useState<VendorNotificationPreferencesPayload>(defaultVendorPayload)
    const [updateVendorNotifications, { isLoading: isSavingVendor }] = useVendorNotificationPreferencesMutation()

    const apiPreferences = userNotificationData?.data as UserNotificationPreferencesPayload | undefined
    const [userPreferences, setUserPreferences] = useState<Record<NotificationKey, boolean>>(initialPreferences)

    useEffect(() => {
        if (variant === 'default' && apiPreferences) {
            setUserPreferences(userPayloadToPreferences(apiPreferences))
        }
    }, [variant, apiPreferences])

    const handleToggle = (key: NotificationKey) => {
        setUserPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
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
                addToast({ title: 'Préférences de notification enregistrées', color: 'success', timeout: 2000 })
            } catch {
                // Error handled by RTK Query / toast
            }
        } else {
            try {
                const payload = preferencesToUserPayload(userPreferences)
                await updateUserNotifications(payload).unwrap()
                addToast({ title: 'Préférences de notification enregistrées', color: 'success', timeout: 2000 })
            } catch {
                // Error handled by RTK Query / toast
            }
        }
    }

    const switchClass = { wrapper: 'group-data-[selected=true]:bg-primaryColor' }

    if (variant === 'vendor') {
        return (
            <>
                <h2 className="mb-6 text-lg font-bold text-fontBlack">
                    Paramètres de notification
                </h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="mb-4 font-bold text-fontBlack">Notifications par email</h3>
                        <div className="space-y-2">
                            {[
                                { key: 'new_leads_available' as const, title: 'Nouveaux prospects disponibles', description: 'Recevoir une notification lorsque de nouveaux prospects sont disponibles' },
                                { key: 'quote_accepted' as const, title: 'Devis accepté', description: 'Recevoir une notification lorsqu\'un devis est accepté' },
                                { key: 'messages' as const, title: 'Messages', description: 'Recevoir une notification pour les nouveaux messages' },
                                { key: 'low_credit_balance' as const, title: 'Solde de crédits faible', description: 'Recevoir une notification lorsque votre solde de crédits est faible' },
                                { key: 'platform_updates' as const, title: 'Mises à jour de la plateforme', description: 'Recevoir des notifications sur les nouveautés et les mises à jour de la plateforme' },
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
                        <h3 className="mb-4 font-bold text-fontBlack">Notifications push</h3>
                        <div className="space-y-2">
                            {[
                                { key: 'new_leads' as const, title: 'Nouveaux prospects', description: 'Notifications du navigateur pour les nouveaux prospects' },
                                { key: 'messages' as const, title: 'Messages', description: 'Notifications du navigateur pour les nouveaux messages' },
                                { key: 'low_credits' as const, title: 'Crédits faibles', description: 'Recevoir une notification lorsque votre solde de crédits est faible' },
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
                        <h3 className="mb-4 font-bold text-fontBlack">Notifications par SMS</h3>
                        <div className="space-y-2">
                            <div className="border border-borderDark rounded-xl p-4 flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-4">
                                <div className="flex-1">
                                    <p className="font-medium text-fontBlack">Mises à jour importantes</p>
                                    <p className="mt-0.5 text-sm text-darkSilver">SMS pour les activités importantes du compte</p>
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
                        Enregistrer les préférences
                    </Button>
                </div>
            </>
        )
    }

    return (
        <>
            <h2 className="mb-6 text-lg font-bold text-fontBlack">
                Paramètres de notification
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
                                            isSelected={userPreferences[item.key]}
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
                <Button
                    className="rounded-xl bg-primaryColor px-8 font-medium text-white"
                    onPress={handleSave}
                    isLoading={isSavingUser}
                    isDisabled={isSavingUser}
                >
                    Enregistrer les préférences
                </Button>
            </div>
        </>
    )
}
