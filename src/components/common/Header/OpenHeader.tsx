'use client'

import ImageComponent from "@/components/library/ImageComponent"
import { openModal } from "@/redux/slices/allModalSlice"
import { useGetGlobalSettingsQuery } from "@/redux/rtkQueries/clientSideGetApis"
import { Button } from "@heroui/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getHomeRoutePath } from "@/routes/routes"
import { ArrowRightIconSVG } from "@/components/library/AllSVG"

const OpenHeader = ({ logoUrl }: { logoUrl: string }) => {
    const dispatch = useDispatch()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const openSignInModal = () => {
        setMenuOpen(false)
        dispatch(openModal({
            componentName: 'LoginSignupIndex',
            data: { componentName: 'CustomerSignInIndex' },
            modalSize: 'full',
        }))
    }

    const openVendorSignupModal = () => {
        setMenuOpen(false)
        dispatch(openModal({
            componentName: 'LoginSignupIndex',
            data: {
                componentName: 'SelectUserType',
                preselectedUserType: 'service',
            },
            modalSize: 'full',
        }))
    }

    return (
        <nav
            className={`sticky top-0 left-0 right-0 z-50 px-[5%] h-[68px] flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-slate-200/60 transition-shadow duration-300 ${scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.08)]' : 'shadow-none'}`}
        >
            {/* Logo */}
            <Link href={getHomeRoutePath()} className="flex items-center gap-1.5 shrink-0">
                {logoUrl ? (
                    <span className=" w-36 inline-flex items-center">
                        <ImageComponent url={logoUrl} img_title={`logo image`} object_contain />
                    </span>
                ) : (
                    <>
                        <span className="w-2 h-2 rounded-full bg-primaryColor shrink-0" />
                        <span className="font-extrabold text-[20px] tracking-tight text-fontBlack leading-none">
                            Ask<span className="text-primaryColor">-Service</span>
                        </span>
                    </>
                )}
            </Link>

            {/* Desktop CTAs */}
            <div className="hidden sm:flex gap-2 items-center">
                <Button
                    className="outline_btn"
                    onPress={openSignInModal}
                >
                    Connexion / Inscription
                </Button>

                <Button
                    startContent={<ArrowRightIconSVG />}
                    className="text-sm font-semibold bg-primaryColor text-white rounded-[10px] px-5 h-[38px] min-w-0 hover:bg-primaryColor/90 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(64,124,233,0.35)] transition-all"
                    onPress={openVendorSignupModal}
                >
                    Devenir Prestataire
                </Button>
            </div>

            {/* Mobile hamburger */}
            <button
                type="button"
                className="sm:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Menu"
                aria-expanded={menuOpen}
            >
                <span className={`block h-0.5 w-5 bg-fontBlack rounded transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`block h-0.5 w-5 bg-fontBlack rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 bg-fontBlack rounded transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>

            {/* Mobile dropdown */}
            {menuOpen && (
                <>
                    <div
                        className="sm:hidden fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                        aria-hidden="true"
                    />
                    <div className="sm:hidden absolute top-full right-4 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-borderDark z-50 py-2 px-2">
                        <button
                            type="button"
                            onClick={openSignInModal}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-medium hover:bg-borderDark/50 transition-colors"
                        >
                            Connexion / Inscription
                        </button>
                        <button
                            type="button"
                            onClick={openVendorSignupModal}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-primaryColor text-sm font-medium hover:bg-primaryColor/10 transition-colors"
                        >
                            Devenir Prestataire →
                        </button>
                    </div>
                </>
            )}
        </nav>
    )
}

export default OpenHeader
