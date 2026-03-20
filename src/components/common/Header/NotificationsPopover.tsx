'use client'
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { BellIconSVG } from "@/components/library/AllSVG";
import { clientSideGetApis } from "@/redux/rtkQueries/clientSideGetApis";
import { useVendorReadNotificationMutation, useUserReadNotificationMutation } from "@/redux/rtkQueries/allPostApi";
import type { IPopupNotificationsAPIResponseDataEntity } from "@/types/popupNotifications";

interface NotificationsPopoverProps {
    isVendor: boolean;
    isAuthenticated: boolean;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "À l'instant";
    if (mins < 60) return `il y a ${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `il y a ${hrs} h`;
    const days = Math.floor(hrs / 24);
    return `il y a ${days} j`;
}

export default function NotificationsPopover({ isVendor, isAuthenticated }: NotificationsPopoverProps) {
    const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

    const { data: vendorNotifs, isLoading: vendorLoading, } = clientSideGetApis.useGetVendorNotificationsQuery(undefined, {
        skip: !isAuthenticated || !isVendor,
    });
    const { data: userNotifs, isLoading: userLoading, } = clientSideGetApis.useGetUserNotificationsQuery(undefined, {
        skip: !isAuthenticated || isVendor,
    });

    const [vendorReadNotification] = useVendorReadNotificationMutation();
    const [userReadNotification] = useUserReadNotificationMutation();

    const rawData = isVendor ? vendorNotifs?.data : userNotifs?.data;
    const notifications: IPopupNotificationsAPIResponseDataEntity[] =
        Array.isArray(rawData) ? rawData : [];
    const isLoading = isVendor ? vendorLoading : userLoading;

    const handleMarkAsRead = async (notif: IPopupNotificationsAPIResponseDataEntity) => {
        if (notif.is_read) return;
        const mutate = isVendor ? vendorReadNotification : userReadNotification;
        await mutate({ id: notif._id, body: {} });
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;
    const displayed = activeTab === "unread"
        ? notifications.filter((n) => !n.is_read)
        : notifications;

    return (
        <>
            <Popover
                placement="bottom-end"
                showArrow={false}
                classNames={{ content: "p-0 w-[360px] md:w-[450px] overflow-hidden shadow-lg border border-borderDark" }}
            >
                <PopoverTrigger>
                    <button
                        type="button"
                        className="cursor-pointer relative p-1.5 rounded-full hover:bg-borderDark transition-colors text-fontBlack"
                        aria-label="Notifications"
                    >
                        <BellIconSVG />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 rounded-full bg-primaryColor text-white text-xs font-medium flex items-center justify-center px-1">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-col w-full">
                        {/* Header */}
                        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
                            <h3 className="font-bold text-base text-fontBlack">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="text-xs font-medium text-primaryColor bg-primaryColor/10 px-2 py-0.5 rounded-full">
                                    {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
    
                        {/* Tabs */}
                        <div className="px-4 pb-2 flex gap-1 border-b border-borderDark">
                            <button
                                type="button"
                                onClick={() => setActiveTab("all")}
                                className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "all"
                                        ? "bg-primaryColor text-white"
                                        : "text-darkSilver hover:bg-borderDark"
                                    }`}
                            >
                                Toutes
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab("unread")}
                                className={`cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === "unread"
                                        ? "bg-primaryColor text-white"
                                        : "text-darkSilver hover:bg-borderDark"
                                    }`}
                            >
                                Non lues
                                {unreadCount > 0 && (
                                    <span className={`min-w-4.5 h-4.5 rounded-full text-xs font-medium flex items-center justify-center px-1 ${activeTab === "unread" ? "bg-white text-primaryColor" : "bg-primaryColor text-white"
                                        }`}>
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>
    
                        {/* Notification list */}
                        <div className="overflow-y-auto max-h-100">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <span className="w-6 h-6 rounded-full border-2 border-primaryColor border-t-transparent animate-spin" />
                                </div>
                            ) : displayed.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-darkSilver gap-2">
                                    <BellIconSVG />
                                    <p className="text-sm">
                                        {activeTab === "unread" ? "Aucune notification non lue" : "Aucune notification"}
                                    </p>
                                </div>
                            ) : (
                                <ul>
                                    {displayed.map((notif, idx) => (
                                        <li key={notif._id}>
                                            <div
                                                role={!notif.is_read ? "button" : undefined}
                                                onClick={() => handleMarkAsRead(notif)}
                                                className={`flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-borderDark/40 ${!notif.is_read ? "bg-primaryColor/5 cursor-pointer" : "cursor-default"}`}
                                            >
                                                {/* Unread dot */}
                                                <div className="mt-1.5 shrink-0 w-2 h-2 rounded-full">
                                                    {!notif.is_read && (
                                                        <span className="block w-2 h-2 rounded-full bg-primaryColor" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm leading-snug ${!notif.is_read ? "font-semibold text-fontBlack" : "font-medium text-fontBlack"}`}>
                                                        {notif.title}
                                                    </p>
                                                    <p className="text-sm text-darkSilver mt-0.5 line-clamp-2 leading-snug">
                                                        {notif.body}
                                                    </p>
                                                    <p className="text-xs text-darkSilver/70 mt-1">
                                                        {timeAgo(notif.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            {idx < displayed.length - 1 && (
                                                <div className="mx-4 border-t border-borderDark/60" />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
}
