'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import ImageComponent from "../../library/ImageComponent"
import NavbarComponent from "./NavbarComponent"
import { BellIconSVG, ChevronDownIconSVG, LightningIconSVG } from "@/components/library/AllSVG"
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react"

const SCROLL_THRESHOLD = 24
const TRANSITION_DURATION_MS = 250

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(typeof window !== "undefined" ? window.scrollY > SCROLL_THRESHOLD : false)
        }
        handleScroll()
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const transitionStyle = {
        transition: `opacity ${TRANSITION_DURATION_MS}ms ease-out`,
    }

    return (
        <div
            className="fixed top-0 left-0 right-0 z-9 min-h-18 md:min-h-20 pointer-events-none"
            id="main_navbar"
        >
            {/* Default header (visible when at top) */}
            <div
                className="navbar_x_axis_padding navbar_y_axis_padding absolute inset-x-0 top-0 pointer-events-auto"
                style={{
                    ...transitionStyle,
                    opacity: isScrolled ? 0 : 1,
                    pointerEvents: isScrolled ? "none" : "auto",
                }}
            >
                <div className="px-4 py-2 backdrop-blur-lg bg-navBgColor rounded-full flex justify-between items-center">
                    <div className="h-12 w-50 shrink-0 inline-flex items-center justify-start">
                        <ImageComponent url="/images/navbar/ask_service_logo.png" img_title="ask service logo" object_contain />
                    </div>
                    <NavbarComponent />
                </div>
            </div>

            {/* Scrolled header (visible when scrolled) */}
            <header
                className="navbar_x_axis_padding py-2! absolute inset-x-0 top-0 bg-white border-b border-borderDark pointer-events-auto"
                style={{
                    ...transitionStyle,
                    opacity: isScrolled ? 1 : 0,
                    pointerEvents: isScrolled ? "auto" : "none",
                }}
            >
                <div className="flex items-center justify-between h-14 ">
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <span className="h-9 w-9 rounded-full bg-primaryColor flex items-center justify-center shrink-0">
                            <LightningIconSVG />
                        </span>
                        <span className="font-bold text-lg text-fontBlack hidden sm:inline">Ask Service</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/my-request"
                            className="text-sm font-medium text-fontBlack hover:text-primaryColor transition-colors"
                        >
                            My Requests
                        </Link>
                        <Link
                            href="/vendor/message"
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
                        <Dropdown>
                            <DropdownTrigger>
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
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User menu">
                                <DropdownItem key="profile">Profile</DropdownItem>
                                <DropdownItem key="settings">Settings</DropdownItem>
                                <DropdownItem key="logout" color="danger">Log out</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </nav>
                    <div className="flex md:hidden items-center gap-2">
                        <Link href="/vendor/message" className="relative p-2">
                            <BellIconSVG />
                            <span className="absolute top-1 right-1 min-w-3.5 h-3.5 rounded-full bg-primaryColor text-white text-[10px] font-medium flex items-center justify-center">
                                2
                            </span>
                        </Link>
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="light" isIconOnly className="min-w-0 w-10 h-10 rounded-full bg-primaryColor/20">
                                    <span className="text-primaryColor font-semibold text-sm">D.R</span>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User menu">
                                <DropdownItem key="my-requests" href="/my-request">My Requests</DropdownItem>
                                <DropdownItem key="messages" href="/vendor/message">Messages</DropdownItem>
                                <DropdownItem key="profile">Profile</DropdownItem>
                                <DropdownItem key="logout" color="danger">Log out</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header
