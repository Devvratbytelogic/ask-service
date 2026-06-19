'use client'

import ImageComponent from "@/components/library/ImageComponent"
import { Button } from "@heroui/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getHomeRoutePath, getLoginPageRoutePath, getRegistrationPageRoutePath, getServiceProviderRoutePath } from "@/routes/routes"
import { ArrowRightIconSVG } from "@/components/library/AllSVG"
import { usePathname } from "next/navigation"
import CustomerMenu from "./CustomerMenu"
import VendorMenu from "./VendorMenu"
import CustomerActions from "./CustomerActions"
import VendorActions from "./VendorActions"

export default function Header({ logoUrl, vendorLogoUrl, isVendor, isAuthenticated }: { logoUrl: string, vendorLogoUrl: string, isVendor: boolean, isAuthenticated: boolean }) {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()
    const isServiceProviderPage = pathname === getServiceProviderRoutePath()

    const logo = isServiceProviderPage ? vendorLogoUrl : logoUrl;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])


    return (
        <nav
            className={`sticky top-0 left-0 right-0 z-50 flex h-[68px] items-center justify-between px-[5%] backdrop-blur-md transition-shadow duration-300 ${isServiceProviderPage
                ? "border-b border-white/7 bg-slate-900/92"
                : `border-b border-slate-200/60 bg-white/90 ${scrolled ? "shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : "shadow-none"}`
                }`}
        >
            {/* Logo */}
            <Link href={getHomeRoutePath()} className="flex items-center gap-1.5 shrink-0">
                {logo ? (
                    <span className=" w-36 inline-flex items-center">
                        <ImageComponent url={logo} img_title={`logo image`} object_contain />
                    </span>
                ) : (
                    <>
                        <span className={`w-2 h-2 rounded-full ${isServiceProviderPage ? 'bg-amber' : 'bg-primaryColor'} shrink-0`} />
                        <span className={`font-extrabold text-[20px] tracking-tight ${isServiceProviderPage ? 'text-white' : 'text-fontBlack'} leading-none`}>
                            Ask<span className={`${isServiceProviderPage ? 'text-amber' : 'text-primaryColor'}`}>-Service</span>
                        </span>
                    </>
                )}
            </Link>

            {isAuthenticated && (isVendor ? <VendorMenu /> : <CustomerMenu />)}
            
            {/* Desktop right section */}
            {isAuthenticated && (isVendor ? <VendorActions isAuthenticated={isAuthenticated} /> : <CustomerActions isAuthenticated={isAuthenticated} />)}
            {!isAuthenticated && (
                <div className="hidden sm:flex gap-2 items-center">
                    <Button
                        className={isServiceProviderPage ? "outline_btn_vendor" : "outline_btn"}
                        as={Link}
                        href={getLoginPageRoutePath()}
                    >
                        Connexion / Inscription
                    </Button>

                    {!isServiceProviderPage && <Button
                        startContent={<ArrowRightIconSVG />}
                        className={`text-sm font-semibold ${isServiceProviderPage ? 'bg-amber ' : 'bg-primaryColor text-white'} rounded-[10px] px-5 h-[38px] min-w-0 hover:${isServiceProviderPage ? 'bg-amber-dark' : 'bg-primaryColor/90'} hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(64,124,233,0.35)] transition-all`}
                        as={Link}
                        href={getRegistrationPageRoutePath()}
                    >
                        Devenir Prestataire
                    </Button>}
                </div>
            )}

            {/* Mobile hamburger */}
            <button
                type="button"
                className={`sm:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-full transition-colors ${isServiceProviderPage ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Menu"
                aria-expanded={menuOpen}
            >
                <span className={`block h-0.5 w-5 rounded transition-all duration-300 ${isServiceProviderPage ? 'bg-white' : 'bg-fontBlack'} ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`block h-0.5 w-5 rounded transition-all duration-300 ${isServiceProviderPage ? 'bg-white' : 'bg-fontBlack'} ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 rounded transition-all duration-300 ${isServiceProviderPage ? 'bg-white' : 'bg-fontBlack'} ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>

            {/* Mobile dropdown */}
            {menuOpen && (
                <>
                    <div
                        className="sm:hidden fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div className={`sm:hidden absolute top-full right-4 mt-2 w-64 rounded-2xl shadow-lg z-50 py-2 px-2 border ${isServiceProviderPage ? 'bg-slate-800 border-white/10' : 'bg-white border-borderDark'}`}>
                        <Button
                            type="button"
                            as={Link}
                            href={getLoginPageRoutePath()}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isServiceProviderPage ? 'text-white hover:bg-white/10' : 'text-fontBlack hover:bg-borderDark/50'}`}
                        >
                            Connexion / Inscription
                        </Button>
                        {!isServiceProviderPage && (
                            <Button
                                type="button"
                                as={Link}
                                href={getRegistrationPageRoutePath()}
                                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-primaryColor text-sm font-medium hover:bg-primaryColor/10 transition-colors"
                            >
                                Devenir Prestataire →
                            </Button>
                        )}
                    </div>
                </>
            )}
        </nav>
    )
}
