'use client'

import ImageComponent from "@/components/library/ImageComponent"
import { Button } from "@heroui/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
    getHomeRoutePath,
    getLoginPageRoutePath,
    getRegistrationPageRoutePath,
    getRequestAServiceRoutePath,
    getServiceProviderRoutePath,
    getCreditsRoutePath,
} from "@/routes/routes"
import { ArrowRightIconSVG } from "@/components/library/AllSVG"
import { usePathname } from "next/navigation"
import CustomerMenu, { CUSTOMER_NAV_LINKS } from "./CustomerMenu"
import VendorMenu from "./VendorMenu"
import CustomerActions from "./CustomerActions"
import VendorActions from "./VendorActions"
import ThemeToggle from "@/components/common/ThemeToggle"
import type { RootState } from "@/redux/appStore"
import { getIsClient } from "@/utils/authCookies"

export default function Header({ logoUrl, logoDarkUrl, vendorLogoUrl, vendorLogoDarkUrl, isVendor, isAuthenticated }: { logoUrl: string, logoDarkUrl: string, vendorLogoUrl: string, vendorLogoDarkUrl: string, isVendor: boolean, isAuthenticated: boolean }) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()
    const isServiceProviderPage = pathname === getServiceProviderRoutePath()

    const isClientAuthenticated = useSelector((state: RootState) => state.auth.isClientAuthenticated)
    const clientUserRole = useSelector((state: RootState) => state.auth.userRole)
    const isAuth = isAuthenticated || isClientAuthenticated
    // Role may stay Vendor while is_client toggles client vs prestataire view
    const isVendorUser =
        getIsClient() === true
            ? false
            : isVendor || clientUserRole?.toLowerCase() === 'vendor'
    const showVendorLogo = isServiceProviderPage || isVendorUser

    const lightLogo = showVendorLogo ? vendorLogoUrl : logoUrl
    const darkLogo = showVendorLogo ? vendorLogoDarkUrl : logoDarkUrl
    const mobileMenuBreakpoint = isAuth ? 'lg' : 'sm'

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
    }, [pathname])

    const closeMenu = () => setMenuOpen(false)

    return (
        <nav
            className={`sticky top-0 left-0 right-0 z-50 flex h-17 items-center gap-2 sm:gap-3 px-4 sm:px-[5%] backdrop-blur-md transition-shadow duration-300 border-b border-appBorder/60 dark:border-white/7 bg-appNav ${scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : "shadow-none"}`}
        >
            <Link href={getHomeRoutePath()} className="flex items-center gap-1.5 shrink-0 min-w-0">
                {lightLogo || darkLogo ? (
                    <>
                        <span className="w-28 sm:w-36 inline-flex items-center dark:hidden">
                            <ImageComponent url={lightLogo} img_title="logo image" object_contain />
                        </span>
                        <span className="w-28 sm:w-36 hidden dark:inline-flex items-center">
                            <ImageComponent url={darkLogo} img_title="logo image" object_contain />
                        </span>
                    </>
                ) : (
                    <>
                        <span className={`w-2 h-2 rounded-full ${showVendorLogo ? 'bg-amber' : 'bg-primaryColor'} shrink-0`} />
                        <span className="font-extrabold text-[18px] sm:text-[20px] tracking-tight text-appText leading-none">
                            Ask<span className={`${showVendorLogo ? 'text-amber' : 'text-primaryColor'}`}>-Service</span>
                        </span>
                    </>
                )}
            </Link>

            {isAuth && (
                <div className="hidden lg:flex flex-1 min-w-0 justify-center px-1 xl:px-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {isVendorUser ? <VendorMenu /> : <CustomerMenu />}
                </div>
            )}

            <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
                {isAuth && (isVendorUser ? <VendorActions isAuthenticated={isAuth} /> : <CustomerActions isAuthenticated={isAuth} />)}
                {!isAuth && (
                    <div className="hidden sm:flex gap-2 items-center">
                        <ThemeToggle />
                        <Button
                            className={isServiceProviderPage ? "outline_btn_vendor" : "outline_btn"}
                            as={Link}
                            href={getLoginPageRoutePath()}
                        >
                            Connexion / Inscription
                        </Button>

                        {!isServiceProviderPage && <Button
                            startContent={<ArrowRightIconSVG />}
                            className={`text-sm font-semibold ${isServiceProviderPage ? 'bg-amber ' : 'bg-primaryColor text-white'} rounded-[10px] px-5 h-9.5 min-w-0 hover:${isServiceProviderPage ? 'bg-amber-dark' : 'bg-primaryColor/90'} hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(64,124,233,0.35)] transition-all`}
                            as={Link}
                            href={getRegistrationPageRoutePath({ role: 'vendor' })}
                        >
                            Devenir Prestataire
                        </Button>}
                    </div>
                )}

                <button
                    type="button"
                    className={`${isAuth ? 'lg:hidden' : 'sm:hidden'} flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-appOverlay-5 shrink-0`}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Menu"
                    aria-expanded={menuOpen}
                >
                    <span className={`block h-0.5 w-5 rounded transition-all duration-300 bg-fontBlack dark:bg-appBorder ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                    <span className={`block h-0.5 w-5 rounded transition-all duration-300 bg-fontBlack dark:bg-appBorder ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block h-0.5 w-5 rounded transition-all duration-300 bg-fontBlack dark:bg-appBorder ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
                </button>
            </div>

            {menuOpen && (
                <>
                    <div
                        className={`${mobileMenuBreakpoint}:hidden fixed inset-0 z-40`}
                        onClick={closeMenu}
                        aria-hidden="true"
                    />
                    <div className={`${mobileMenuBreakpoint}:hidden absolute top-full right-4 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-2xl shadow-lg z-50 py-2 px-2 border bg-appCard border-appBorder dark:border-white/10 max-h-[calc(100vh-5rem)] overflow-y-auto`}>
                        {isAuth ? (
                            <>
                                <div className="px-2 py-1">
                                    <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-appTextSec">
                                        Navigation
                                    </p>
                                    {isVendorUser ? (
                                        <VendorMenu onNavigate={closeMenu} layout="stack" />
                                    ) : (
                                        CUSTOMER_NAV_LINKS.map(({ label, href }) => {
                                            const isActive = pathname === href || pathname.startsWith(href + '/')
                                            return (
                                                <Link
                                                    key={href}
                                                    href={href}
                                                    onClick={closeMenu}
                                                    className={`flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                                        ? 'text-primaryColor bg-primaryColor/10'
                                                        : 'text-appText hover:bg-appOverlay-5'
                                                        }`}
                                                >
                                                    {label}
                                                </Link>
                                            )
                                        })
                                    )}
                                </div>

                                {isVendorUser && (
                                    <Link
                                        href={getCreditsRoutePath()}
                                        onClick={closeMenu}
                                        className="mx-2 mb-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber/12 border border-amber/30 hover:bg-amber/20 transition-all md:hidden"
                                    >
                                        <span aria-hidden="true">🪙</span>
                                        <span className="text-sm font-bold text-amber">
                                            Mes crédits
                                        </span>
                                    </Link>
                                )}

                                {!isVendorUser && (
                                    <Link
                                        href={getRequestAServiceRoutePath()}
                                        onClick={closeMenu}
                                        className="mx-2 mb-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primaryColor text-white text-sm font-bold hover:bg-blue-dark transition-colors lg:hidden"
                                    >
                                        Nouvelle demande
                                    </Link>
                                )}

                                <div className="my-1 border-t border-appBorder/60 dark:border-white/10" />

                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-xs font-semibold text-appTextSec">Thème</span>
                                    <ThemeToggle />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-xs font-semibold text-appTextSec">Thème</span>
                                    <ThemeToggle />
                                </div>

                                <div className="my-1 border-t border-appBorder/60 dark:border-white/10" />

                                <div className="flex flex-col gap-1 px-2 py-1">
                                    <Link
                                        href={getLoginPageRoutePath()}
                                        onClick={closeMenu}
                                        className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-appText hover:bg-appOverlay-5"
                                    >
                                        Connexion / Inscription
                                    </Link>
                                    {!isServiceProviderPage && (
                                        <Link
                                            href={getRegistrationPageRoutePath({ role: 'vendor' })}
                                            onClick={closeMenu}
                                            className="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-primaryColor hover:bg-primaryColor/10"
                                        >
                                            Devenir Prestataire →
                                        </Link>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </nav>
    )
}
