export interface IPopupNotificationsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IPopupNotificationsAPIResponseDataEntity)[] | null;
    message: string;
    timestamp: string;
}
export interface IPopupNotificationsAPIResponseDataEntity {
    _id: string;
    user_id: string;
    title: string;
    body: string;
    is_read: boolean;
    image?: null;
    url?: null;
    data?: null;
    __v: number;
    createdAt: string;
    updatedAt: string;
}
