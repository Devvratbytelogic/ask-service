/** User (customer) notification preferences - API payload for PUT /user/notification */
export interface UserNotificationPreferencesPayload {
    email_notifications: {
        new_quotes: boolean
        messages: boolean
        product_updates: boolean
    }
    push_notifications: {
        new_quotes: boolean
        messages: boolean
    }
    sms_notifications: {
        important_updates: boolean
    }
}

export interface IUserNotificationAPIResponse {
    http_status_code?: number
    success: boolean
    data: UserNotificationPreferencesPayload
    message?: string
    timestamp?: string
}

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
