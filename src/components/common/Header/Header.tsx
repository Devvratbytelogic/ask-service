'use client'
import ImageComponent from "../../library/ImageComponent";
import NavbarComponent from "./NavbarComponent";
import { BellIconSVG, ChevronDownIconSVG, DocumentIconSVG, LightningIconSVG, ProfileIconSVG, SignOutIconSVG } from "@/components/library/AllSVG"
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineCog6Tooth } from "react-icons/hi2"
import { getHomeRoutePath, getMyRequestRoutePath, getVendorMessageRoutePath, getVendorProfileRoutePath, getVendorAccountRoutePath, getVendorDashboardRoutePath } from "@/routes/routes";
import { getUserRole } from "@/utils/authCookies";

const USER_NAME = "David Robinson";
const USER_EMAIL = "david.robinson@example.com";

interface HeaderProps {
    initialIsAuthenticated?: boolean;
}

const Header = ({ initialIsAuthenticated = false }: HeaderProps) => {
    const router = useRouter();
    const isAuthenticated = initialIsAuthenticated;
    const role = getUserRole();
    const isVendor = role?.toLowerCase() === "vendor";
    const handleLogout = () => {
        router.push(getHomeRoutePath());
    };

    if (!isAuthenticated) {
        return (
            <div className={`navbar_x_axis_padding navbar_y_axis_padding sticky top-0 left-0 right-0 z-10`} id="main_navbar">
                <div className="px-4 py-2 backdrop-blur-lg bg-navBgColor rounded-full flex justify-between items-center">
                    <Link href={getHomeRoutePath()} className="h-12 w-50 shrink-0 inline-flex items-center justify-start">
                        <ImageComponent url="/images/navbar/ask_service_logo.png" img_title="ask service logo" object_contain />
                    </Link>
                    <NavbarComponent />
                </div>
            </div>
        )
    } else {
        return (
            <header className={`navbar_x_axis_padding navbar_y_axis_padding sticky top-0 left-0 right-0 z-10 bg-white border-b border-borderDark`} id="main_navbar">
                <div className="flex items-center justify-between py-2">
                    <Link href={getHomeRoutePath()} className="flex items-center gap-2 shrink-0">
                        <span className="h-9 w-9 rounded-full bg-primaryColor flex items-center justify-center shrink-0">
                            <LightningIconSVG />
                        </span>
                        <span className="font-bold text-lg text-fontBlack hidden sm:inline">Ask Service</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href={getMyRequestRoutePath()}
                            className="text-sm font-medium text-fontBlack hover:text-primaryColor transition-colors"
                        >
                            My Requests
                        </Link>
                        <Link
                            href={getVendorMessageRoutePath()}
                            className="relative inline-flex items-center gap-1.5 text-sm font-medium text-fontBlack hover:text-primaryColor transition-colors"
                        >
                            Messages
                            <span className="min-w-4.5 h-4.5 rounded-full bg-primaryColor text-white text-xs font-medium flex items-center justify-center px-1">
                                2
                            </span>
                        </Link>
                        <button
                            type="button"
                            className="relative p-1.5 rounded-full hover:bg-borderDark transition-colors text-fontBlack"
                            aria-label="Notifications"
                        >
                            <BellIconSVG />
                            <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 rounded-full bg-primaryColor text-white text-xs font-medium flex items-center justify-center">
                                2
                            </span>
                        </button>
                        {isVendor ? (
                            <Popover placement="bottom-end" showArrow={false} classNames={{ content: "p-0 min-w-[240px] rounded-2xl shadow-lg border border-borderDark" }}>
                                <PopoverTrigger>
                                    <Button
                                        variant="light"
                                        className="flex items-center gap-2 min-w-0 px-2 h-auto py-1.5 rounded-full hover:bg-borderDark"
                                    >
                                        <span className="h-8 w-8 rounded-full bg-primaryColor/20 flex items-center justify-center text-primaryColor font-semibold text-sm shrink-0">
                                            D.R
                                        </span>
                                        <span className="font-medium text-fontBlack text-sm hidden lg:inline">David.R</span>
                                        <ChevronDownIconSVG />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="flex flex-col">
                                        {/* User info section */}
                                        <div className="px-5 py-4">
                                            <p className="font-bold text-base text-fontBlack">{USER_NAME}</p>
                                            <p className="text-sm text-darkSilver mt-0.5">{USER_EMAIL}</p>
                                        </div>
                                        <div className="border-t border-borderDark" />
                                        {/* Navigation items */}
                                        <div className="py-2 px-2">
                                            <Link
                                                href={getVendorDashboardRoutePath()}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                            >
                                                <span className="size-5 shrink-0 flex text-darkSilver"><DocumentIconSVG /></span>
                                                Dashboard
                                            </Link>
                                            <Link
                                                href={getVendorProfileRoutePath()}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                            >
                                                <span className="size-5 shrink-0 flex text-darkSilver"><ProfileIconSVG /></span>
                                                My Profile
                                            </Link>
                                            <Link
                                                href={getVendorAccountRoutePath()}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                            >
                                                <HiOutlineCog6Tooth className="size-5 shrink-0 text-darkSilver" />
                                                Settings
                                            </Link>
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
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div className="flex items-center gap-2 min-w-0 px-2 py-1.5">
                                <span className="h-8 w-8 rounded-full bg-primaryColor/20 flex items-center justify-center text-primaryColor font-semibold text-sm shrink-0">
                                    D.R
                                </span>
                                <span className="font-medium text-fontBlack text-sm hidden lg:inline">David.R</span>
                            </div>
                        )}
                    </nav>
                    <div className="flex md:hidden items-center gap-2">
                        <Link href={getVendorMessageRoutePath()} className="relative p-2">
                            <BellIconSVG />
                            <span className="absolute top-1 right-1 min-w-3.5 h-3.5 rounded-full bg-primaryColor text-white text-[10px] font-medium flex items-center justify-center">
                                2
                            </span>
                        </Link>
                        {isVendor ? (
                            <Popover placement="bottom-end" showArrow={false} classNames={{ content: "p-0 min-w-[240px] rounded-2xl shadow-lg border border-borderDark" }}>
                                <PopoverTrigger>
                                    <Button variant="light" isIconOnly className="min-w-0 w-10 h-10 rounded-full bg-primaryColor/20">
                                        <span className="text-primaryColor font-semibold text-sm">D.R</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="flex flex-col">
                                        <div className="px-5 py-4">
                                            <p className="font-bold text-base text-fontBlack">{USER_NAME}</p>
                                            <p className="text-sm text-darkSilver mt-0.5">{USER_EMAIL}</p>
                                        </div>
                                        <div className="border-t border-borderDark" />
                                        <div className="py-2 px-2">
                                            <Link
                                                href={getVendorDashboardRoutePath()}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                            >
                                                <span className="size-5 shrink-0 flex text-darkSilver"><DocumentIconSVG /></span>
                                                Dashboard
                                            </Link>
                                            <Link
                                                href={getMyRequestRoutePath()}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                            >
                                                <span className="size-5 shrink-0 flex text-darkSilver"><DocumentIconSVG /></span>
                                                My Requests
                                            </Link>
                                            <Link
                                                href={getVendorMessageRoutePath()}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                            >
                                                <span className="size-5 shrink-0 flex text-darkSilver"><BellIconSVG /></span>
                                                Messages
                                            </Link>
                                            <Link
                                                href={getVendorProfileRoutePath()}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                            >
                                                <span className="size-5 shrink-0 flex text-darkSilver"><ProfileIconSVG /></span>
                                                My Profile
                                            </Link>
                                            <Link
                                                href={getVendorAccountRoutePath()}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-normal hover:bg-borderDark/50 transition-colors"
                                            >
                                                <HiOutlineCog6Tooth className="size-5 shrink-0 text-darkSilver" />
                                                Settings
                                            </Link>
                                        </div>
                                        <div className="border-t border-borderDark" />
                                        <div className="py-2 px-2">
                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[#EF4444] text-sm font-normal hover:bg-red-50 transition-colors"
                                            >
                                                <span className="size-5 shrink-0 flex"><SignOutIconSVG /></span>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primaryColor/20 shrink-0">
                                <span className="text-primaryColor font-semibold text-sm">D.R</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        )
    }
}

export default Header;