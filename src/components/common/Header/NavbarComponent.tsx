'use client'

import ImageComponent from "@/components/library/ImageComponent"
import { openModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import { useState } from "react"
import { useDispatch } from "react-redux"

const NavbarComponent = () => {
    const dispatch = useDispatch()
    const [menuOpen, setMenuOpen] = useState(false)

    const signupSiginModal = () => {
        setMenuOpen(false)
        dispatch(openModal({
            componentName: 'LoginSignupIndex',
            data: {
                componentName: 'CustomerSignInIndex',
            },
            modalSize: 'full'
        }))
    }

    const becomeAProfessionalModal = () => {
        setMenuOpen(false)
        dispatch(openModal({
            componentName: 'LoginSignupIndex',
            data: {
                componentName: 'SelectUserType',
                preselectedUserType: 'service'
            },
            modalSize: 'full'
        }))
    }

    return (
        <>
            {/* Desktop nav */}
            <div className="hidden md:flex gap-2 items-center">
                <Button
                    startContent={
                        <span className="h-3.5 w-3.5 shrink-0">
                            <ImageComponent url="/images/navbar/login_logout_icon.png" img_title="login_logout" />
                        </span>
                    }
                    className="text-base/[22px] font-medium btn_bg_whiteSilver btn_radius btn_padding"
                    onPress={signupSiginModal}
                >
                    Connexion / Inscription
                </Button>

                <Button
                    endContent={
                        <span className="h-3.5 w-3.5 shrink-0">
                            <ImageComponent url="/images/navbar/arrow.png" img_title="login_logout" />
                        </span>
                    }
                    className="text-base/[22px] font-medium btn_bg_blue btn_radius btn_padding"
                    onPress={becomeAProfessionalModal}
                >
                    Devenir prestataire
                </Button>
            </div>

            {/* Mobile hamburger button */}
            <button
                type="button"
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Menu"
            >
                <span className={`block h-0.5 w-5 bg-fontBlack rounded transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`block h-0.5 w-5 bg-fontBlack rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-5 bg-fontBlack rounded transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="md:hidden fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                    />
                    {/* Menu panel */}
                    <div className="md:hidden absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-borderDark z-50 py-2 px-2">
                        <button
                            type="button"
                            onClick={signupSiginModal}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-fontBlack text-sm font-medium hover:bg-borderDark/50 transition-colors"
                        >
                            <span className="h-4 w-4 shrink-0">
                                <ImageComponent url="/images/navbar/login_logout_icon.png" img_title="login" />
                            </span>
                            Connexion / Inscription
                        </button>
                        <button
                            type="button"
                            onClick={becomeAProfessionalModal}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-primaryColor text-sm font-medium hover:bg-primaryColor/10 transition-colors"
                        >
                            <span className="h-4 w-4 shrink-0">
                                <ImageComponent url="/images/navbar/arrow.png" img_title="arrow" />
                            </span>
                            Devenir prestataire
                        </button>
                    </div>
                </>
            )}
        </>
    )
}

export default NavbarComponent
