'use client'
import ImageComponent from "../../library/ImageComponent";
import NavbarComponent from "./NavbarComponent";
import NotificationsPopover from "./NotificationsPopover";
import { BellIconSVG, ChevronDownIconSVG, DocumentIconSVG, LightningIconSVG, ProfileIconSVG, SecurityIconSVG, SignOutIconSVG } from "@/components/library/AllSVG"
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineCog6Tooth } from "react-icons/hi2"
import { useSelector } from "react-redux";
import { getHomeRoutePath, getMyRequestRoutePath, getVendorMessageRoutePath, getMessageRoutePath, getVendorProfileRoutePath, getVendorAccountRoutePath, getVendorDashboardRoutePath, getMyAccountRoutePath } from "@/routes/routes";
import { getUserRole, clearAllCookiesAndReload, getAuthToken, setUserRoleCookie } from "@/utils/authCookies";
import { clientSideGetApis, useGetGlobalSettingsQuery } from "@/redux/rtkQueries/clientSideGetApis";
import type { RootState } from "@/redux/appStore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserRole } from "@/redux/slices/authSlice";

/** Get initials from first + last name, or email/placeholder */
function getInitials(firstName?: string | null, lastName?: string | null, email?: string | null): string {
    const first = firstName?.trim();
    const last = lastName?.trim();
    if (first || last) {
        return [first?.charAt(0), last?.charAt(0)].filter(Boolean).join("").toUpperCase().slice(0, 2) || "U";
    }
    if (email?.trim()) return email.trim().slice(0, 2).toUpperCase();
    return "U";
}

/** Get short display name for header (e.g. "David.R") */
function getDisplayName(firstName?: string | null, lastName?: string | null, email?: string | null): string {
    const first = firstName?.trim();
    const last = lastName?.trim();
    if (first && last) return `${first}.${last.charAt(0)}`;
    if (first) return first;
    if (email?.trim()) return email.split("@")[0] ?? "Utilisateur";
    return "Utilisateur";
}

/** Full name for popover */
function getFullName(firstName?: string | null, lastName?: string | null): string {
    return [firstName, lastName].filter(Boolean).join(" ").trim() || "Utilisateur";
}

interface HeaderProps {
    initialIsAuthenticated?: boolean;
}

const Header = ({ initialIsAuthenticated = false }: HeaderProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isClientAuthenticated = useSelector((state: RootState) => state.auth.isClientAuthenticated);
    const isAuthenticated = initialIsAuthenticated || !!getAuthToken() || isClientAuthenticated;
    const roleFromRedux = useSelector((state: RootState) => state.auth.userRole);
    const roleFromCookie = getUserRole();
    const role = roleFromRedux ?? roleFromCookie;
    const isVendor = role?.toLowerCase() === "vendor";

    const { data: vendorProfile, isError: isVendorProfileError, error: vendorProfileError } = clientSideGetApis.useGetVendorProfileInfoQuery(undefined, {
        skip: !isAuthenticated || !isVendor,
    });
    const { data: userProfile, isError: isUserProfileError, error: userProfileError } = clientSideGetApis.useGetUserProfileInfoQuery(undefined, {
        skip: !isAuthenticated || isVendor,
    });

    const { data: globalSettings } = useGetGlobalSettingsQuery();
    const logoUrl = globalSettings?.data?.logo;
    const marketplaceName = globalSettings?.data?.marketplace_name || "Ask Service";
    const { data: vendorChats } = clientSideGetApis.useGetVendorChatsQuery(undefined, { skip: !isAuthenticated || !isVendor });
    const { data: userChats } = clientSideGetApis.useGetUserChatsQuery(undefined, { skip: !isAuthenticated || isVendor });
    const totalUnread = (isVendor ? vendorChats?.data : userChats?.data)
        ?.reduce((sum, chat) => sum + (chat.unreadCount ?? 0), 0) ?? 0;

    // Auto logout only when these two profile APIs return 401
    useEffect(() => {
        const httpStatus = (vendorProfileError as { data?: { httpStatus?: number } } | undefined)?.data?.httpStatus;
        const userHttpStatus = (userProfileError as { data?: { httpStatus?: number } } | undefined)?.data?.httpStatus;
        if ((isVendorProfileError && httpStatus === 401) || (isUserProfileError && userHttpStatus === 401)) {
            handleLogout();
        }
    }, [isVendorProfileError, vendorProfileError, isUserProfileError, userProfileError]);
    const profile = isVendor ? vendorProfile?.data : userProfile?.data;

    // console.log("refetchVendorProfile", refetchVendorProfile);
    // console.log("refetchUserProfile", refetchUserProfile);
    const firstName = isVendor ? vendorProfile?.data?.business_name : profile?.first_name;
    const lastName = isVendor ? null : profile?.last_name;
    const email = profile?.email;
    const profilePic = typeof profile?.profile_pic === 'string' && profile.profile_pic.trim() ? profile.profile_pic : null;
    const displayName = getDisplayName(firstName, lastName, email);
    const initials = getInitials(firstName, lastName, email);
    const fullName = getFullName(firstName, lastName);

    const handleLogout = () => {
        clearAllCookiesAndReload(getHomeRoutePath());
    };

    /** Switch from vendor to user account: update role cookie + Redux, invalidate caches, redirect to user area */
    const handleSwitchToUserAccount = () => {
        setUserRoleCookie("User");
        dispatch(setUserRole("User"));
        dispatch(clientSideGetApis.util.invalidateTags(["VendorProfile", "UserProfile"]));
        window.location.href = getMyRequestRoutePath();
    };

    /** Switch from user to vendor account when profile has is_vendor: true */
    const handleSwitchToVendorAccount = () => {
        setUserRoleCookie("Vendor");
        dispatch(setUserRole("Vendor"));
        dispatch(clientSideGetApis.util.invalidateTags(["VendorProfile", "UserProfile"]));
        window.location.href = getVendorDashboardRoutePath({ leads: "purchased" });
    };

    /** Show "Switch to vendor" only when logged in as customer and profile says they are also a vendor */
    const showSwitchToVendor = !isVendor && userProfile?.data?.is_vendor === true;

    // Location is no longer requested on load; it is only requested when the user
    // clicks "Use my current location" in profile pages (ProfileInfo / VendorProfileInfo).


    if (!isAuthenticated) {
        return (
            <div className={`navbar_x_axis_padding navbar_y_axis_padding sticky top-0 left-0 right-0 z-10`} id="main_navbar">
                <div className="px-4 py-2 backdrop-blur-lg bg-navBgColor rounded-full flex justify-between items-center">
                    <Link href={getHomeRoutePath()} className="h-12 w-50 shrink-0 inline-flex items-center justify-start">
                        <ImageComponent url={logoUrl || "/images/navbar/ask_service_logo.png"} img_title={`${marketplaceName} logo`} object_contain />
                    </Link>
                    <NavbarComponent />
                </div>
            </div>
        )
    } else {
        return (
            <>

                <header className={`navbar_x_axis_padding navbar_y_axis_padding sticky top-0 left-0 right-0 z-50 bg-white border-b border-borderDark`} id="main_navbar">
                    <div className="flex items-center justify-between py-2">
                        <Link href={getHomeRoutePath()} className="flex items-center gap-2 shrink-0">
                            {logoUrl ? (
                                <span className="h-9 w-36 shrink-0 inline-flex items-center">
                                    <ImageComponent url={logoUrl} img_title={`${marketplaceName} logo`} object_contain />
                                </span>
                            ) : (
                                <>
                                    <span className="h-9 w-9 rounded-full bg-primaryColor flex items-center justify-center shrink-0">
                                        <LightningIconSVG />
                                    </span>
                                    <span className="font-bold text-lg text-fontBlack hidden sm:inline">{marketplaceName}</span>
                                </>
                            )}
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            {isVendor && <Link
                                href={getVendorDashboardRoutePath({ leads: 'purchased' })}
                                className="text-sm font-medium text-fontBlack hover:text-primaryColor transition-colors"
                            >
                                Tableau de bord
                            </Link>}
                            <Link
                                href={isVendor ? getVendorDashboardRoutePath({ leads: 'available' }) : getMyRequestRoutePath()}
                                className="text-sm font-medium text-fontBlack hover:text-primaryColor transition-colors"
                            >
                                {isVendor ? 'Trouver des prospects' : 'Mes demandes'}
                            </Link>
                            <Link
                                href={isVendor ? getVendorMessageRoutePath() : getMessageRoutePath()}
                                className="relative inline-flex items-center gap-1.5 text-sm font-medium text-fontBlack hover:text-primaryColor transition-colors"
                            >
                                Mes messages
                                {totalUnread > 0 && (
                                    <span className="min-w-4.5 h-4.5 rounded-full bg-primaryColor text-white text-xs font-medium flex items-center justify-center px-1">
                                        {totalUnread > 99 ? '99+' : totalUnread}
                                    </span>
                                )}
                            </Link>
                            <NotificationsPopover isVendor={isVendor} isAuthenticated={isAuthenticated} />
                            {isVendor ? (
                                <Popover placement="bottom-end" showArrow={false} classNames={{ content: "p-0 min-w-[240px] rounded-2xl shadow-lg border border-borderDark" }}>
                                    <PopoverTrigger>
                                        <Button
                                            variant="light"
                                            className="flex items-center gap-2 min-w-0 px-2 h-auto py-1.5 rounded-full hover:bg-borderDark"
                                        >
                                            {profilePic ? (
                                                <span className="h-8 w-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-primaryColor/20">
                                                    <ImageComponent url={profilePic} img_title={initials} object_cover />
                                                </span>
                                            ) : (
                                                <span className="h-8 w-8 rounded-full bg-primaryColor/20 flex items-center justify-center text-primaryColor font-semibold text-sm shrink-0">
                                                    {initials}
                                                </span>
                                            )}
                                            <span className="font-medium text-fontBlack text-sm hidden lg:inline">{displayName}</span>
                                            <ChevronDownIconSVG />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="flex flex-col">
                                            {/* User info section */}
                                            <div className="px-5 py-4">
                                                <p className="font-bold text-base text-fontBlack">{fullName}</p>
                                                <p className="text-sm text-darkSilver mt-0.5">{email ?? "—"}</p>
                                            </div>
                                            <div className="border-t border-borderDark" />
                                            {/* Navigation items */}
                                            <div className="py-2 px-2">
                                                <Link
                                                    href={getVendorAccountRoutePath({ section: 'profile' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><ProfileIconSVG /></span>
                                                    Mon Profil
                                                </Link>
                                                <Link
                                                    href={getVendorAccountRoutePath({ section: 'security' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <HiOutlineCog6Tooth className="size-5 shrink-0 text-darkSilver" />
                                                    Paramètres
                                                </Link>
                                            </div>
                                            <div className="border-t border-borderDark" />
                                            {/* Switch to user account */}
                                            <div className="py-2 px-2">
                                                <button
                                                    type="button"
                                                    onClick={handleSwitchToUserAccount}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-primaryColor text-sm font-normal hover:bg-primaryColor/10 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-primaryColor"><ProfileIconSVG /></span>
                                                    Passer en compte utilisateur
                                                </button>
                                            </div>
                                            <div className="border-t border-borderDark" />
                                            {/* Sign out */}
                                            <div className="py-2 px-2">
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#EF4444] text-sm font-normal hover:bg-red-50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex"><SignOutIconSVG /></span>
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Popover placement="bottom-end" showArrow={false} classNames={{ content: "p-0 min-w-[240px] rounded-2xl shadow-lg border border-borderDark" }}>
                                    <PopoverTrigger>
                                        <Button
                                            variant="light"
                                            className="flex items-center gap-2 min-w-0 px-2 h-auto py-1.5 rounded-full hover:bg-borderDark"
                                        >
                                            {profilePic ? (
                                                <span className="h-8 w-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-primaryColor/20">
                                                    <ImageComponent url={profilePic} img_title={initials} object_cover />
                                                </span>
                                            ) : (
                                                <span className="h-8 w-8 rounded-full bg-primaryColor/20 flex items-center justify-center text-primaryColor font-semibold text-sm shrink-0">
                                                    {initials}
                                                </span>
                                            )}
                                            <span className="font-medium text-fontBlack text-sm hidden lg:inline">{displayName}</span>
                                            <ChevronDownIconSVG />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="flex flex-col">
                                            <div className="px-5 py-4">
                                                <p className="font-bold text-base text-fontBlack">{fullName}</p>
                                                <p className="text-sm text-darkSilver mt-0.5">{email ?? "—"}</p>
                                            </div>
                                            <div className="border-t border-borderDark" />
                                            <div className="py-2 px-2">
                                                <Link
                                                    href={getMyAccountRoutePath({ section: 'profile' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><ProfileIconSVG /></span>
                                                    Mon Profil
                                                </Link>
                                                <Link
                                                    href={getMyAccountRoutePath({ section: 'security' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <HiOutlineCog6Tooth className="size-5 shrink-0 text-darkSilver" />
                                                    Paramètres
                                                </Link>
                                            </div>
                                            {showSwitchToVendor && (
                                                <>
                                                    <div className="border-t border-borderDark" />
                                                    <div className="py-2 px-2">
                                                        <button
                                                            type="button"
                                                            onClick={handleSwitchToVendorAccount}
                                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-primaryColor text-sm font-normal hover:bg-primaryColor/10 transition-colors"
                                                        >
                                                            <span className="size-5 shrink-0 flex text-primaryColor"><DocumentIconSVG /></span>
                                                            Passer en compte prestataire
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            <div className="border-t border-borderDark" />
                                            <div className="py-2 px-2">
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#EF4444] text-sm font-normal hover:bg-red-50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex"><SignOutIconSVG /></span>
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </nav>
                        <div className="flex md:hidden items-center gap-2">
                            <NotificationsPopover isVendor={isVendor} isAuthenticated={isAuthenticated} />
                            {isVendor ? (
                                <Popover placement="bottom-end" showArrow={false} classNames={{ content: "p-0 min-w-[240px] rounded-2xl shadow-lg border border-borderDark" }}>
                                    <PopoverTrigger>
                                        <Button variant="light" isIconOnly className="min-w-0 w-10 h-10 rounded-full overflow-hidden p-0 bg-primaryColor/20">
                                            {profilePic ? (
                                                <span className="block size-full">
                                                    <ImageComponent url={profilePic} img_title={initials} object_cover />
                                                </span>
                                            ) : (
                                                <span className="text-primaryColor font-semibold text-sm w-full h-full flex items-center justify-center">{initials}</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="flex flex-col">
                                            <div className="px-5 py-4">
                                                <p className="font-bold text-base text-fontBlack">{fullName}</p>
                                                <p className="text-sm text-darkSilver mt-0.5">{email ?? "—"}</p>
                                            </div>
                                            <div className="border-t border-borderDark" />
                                            <div className="py-2 px-2">
                                                <Link
                                                    href={getVendorDashboardRoutePath({ leads: 'purchased' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><DocumentIconSVG /></span>
                                                    Tableau de bord
                                                </Link>
                                                <Link
                                                    href={getVendorDashboardRoutePath({ leads: 'available' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><DocumentIconSVG /></span>
                                                    Trouver des prospects
                                                </Link>
                                                <Link
                                                    href={isVendor ? getVendorMessageRoutePath() : getMessageRoutePath()}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><BellIconSVG /></span>
                                                    Mes messages
                                                </Link>
                                                <Link
                                                    href={getVendorAccountRoutePath({ section: 'profile' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><ProfileIconSVG /></span>
                                                    Mon Profil
                                                </Link>
                                                <Link
                                                    href={getVendorAccountRoutePath({ section: 'security' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <HiOutlineCog6Tooth className="size-5 shrink-0 text-darkSilver" />
                                                    Paramètres
                                                </Link>
                                            </div>
                                            <div className="border-t border-borderDark" />
                                            <div className="py-2 px-2">
                                                <button
                                                    type="button"
                                                    onClick={handleSwitchToUserAccount}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-primaryColor text-sm font-normal hover:bg-primaryColor/10 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-primaryColor"><ProfileIconSVG /></span>
                                                    Passer en compte utilisateur
                                                </button>
                                            </div>
                                            <div className="border-t border-borderDark" />
                                            <div className="py-2 px-2">
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#EF4444] text-sm font-normal hover:bg-red-50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex"><SignOutIconSVG /></span>
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Popover placement="bottom-end" showArrow={false} classNames={{ content: "p-0 min-w-[240px] rounded-2xl shadow-lg border border-borderDark" }}>
                                    <PopoverTrigger>
                                        <Button variant="light" isIconOnly className="min-w-0 w-10 h-10 rounded-full overflow-hidden p-0 bg-primaryColor/20">
                                            {profilePic ? (
                                                <span className="block size-full">
                                                    <ImageComponent url={profilePic} img_title={initials} object_cover />
                                                </span>
                                            ) : (
                                                <span className="text-primaryColor font-semibold text-sm w-full h-full flex items-center justify-center">{initials}</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div className="flex flex-col">
                                            <div className="px-5 py-4">
                                                <p className="font-bold text-base text-fontBlack">{fullName}</p>
                                                <p className="text-sm text-darkSilver mt-0.5">{email ?? "—"}</p>
                                            </div>
                                            <div className="border-t border-borderDark" />
                                            <div className="py-2 px-2">
                                                <Link
                                                    href={getMyRequestRoutePath()}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><DocumentIconSVG /></span>
                                                    Mes demandes
                                                </Link>
                                                <Link
                                                    href={getMyAccountRoutePath({ section: 'profile' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><ProfileIconSVG /></span>
                                                    Mon Profil
                                                </Link>
                                                <Link
                                                    href={getMyAccountRoutePath({ section: 'security' })}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><HiOutlineCog6Tooth className="size-5 shrink-0 text-darkSilver" /></span>
                                                    Paramètres
                                                </Link>
                                                <Link
                                                    href={getMessageRoutePath()}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex text-darkSilver"><BellIconSVG /></span>
                                                    Mes messages
                                                </Link>
                                            </div>
                                            {showSwitchToVendor && (
                                                <>
                                                    <div className="border-t border-borderDark" />
                                                    <div className="py-2 px-2">
                                                        <button
                                                            type="button"
                                                            onClick={handleSwitchToVendorAccount}
                                                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-primaryColor text-sm font-normal hover:bg-primaryColor/10 transition-colors"
                                                        >
                                                            <span className="size-5 shrink-0 flex text-primaryColor"><DocumentIconSVG /></span>
                                                            Passer en compte prestataire
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                            <div className="border-t border-borderDark" />
                                            <div className="py-2 px-2">
                                                <button
                                                    type="button"
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#EF4444] text-sm font-normal hover:bg-red-50 transition-colors"
                                                >
                                                    <span className="size-5 shrink-0 flex"><SignOutIconSVG /></span>
                                                    Déconnexion
                                                </button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    </div>
                </header>
            </>
        )
    }
}

export default Header;