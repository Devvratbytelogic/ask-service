export interface VendorNotificationPreferencesPayload {
    email_notifications: {
        new_leads_available: boolean
        quote_accepted: boolean
        messages: boolean
        low_credit_balance: boolean
        platform_updates: boolean
    }
    push_notifications: {
        new_leads: boolean
        messages: boolean
        low_credits: boolean
    }
    sms_notifications: {
        important_updates: boolean
    }
}
