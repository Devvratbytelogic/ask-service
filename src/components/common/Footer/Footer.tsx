"use client"
import ImageComponent from "@/components/library/ImageComponent";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getContactUsRoutePath, getHelpCenterRoutePath, getFaqRoutePath, getTermsRoutePath, getPrivacyRoutePath, getFacebookUrl, getTwitterUrl, getInstagramUrl, getMessageRoutePath, getVendorMessageRoutePath } from "@/routes/routes";
import { BiBuilding, BiShield } from "react-icons/bi";
import { BsFacebook, BsInstagram } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { IoDocumentSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { PiPhone } from "react-icons/pi";

const MESSAGE_PATHS = [getMessageRoutePath(), getVendorMessageRoutePath()];

const Footer = () => {
    const pathname = usePathname();
    if (MESSAGE_PATHS.some((path) => pathname === path)) {
        return null;
    }

    return (
        <div className="py-6.75 px-10 bg-pinkBlack space-y-21.25">
            <div className="flex flex-col xl:flex-row justify-between items-start px-0 lg:px-7.5 pt-5 lg:pt-16.25 gap-y-10">
                <div className="space-y-8 max-w-full md:max-w-[30svh]">
                    <div className="h-10 w-fit">
                        <ImageComponent url="/images/footer/ask_service_white.png" object_contain />
                    </div>
                    <div className="space-y-6">
                        <p className="text-footerSilver text-sm xl:text-[15px]/[25.5px] font-normal">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href={getFacebookUrl()} className="footer_icons" target="_blank" rel="noopener noreferrer">
                                <BsFacebook />
                            </Link>
                            <Link href={getTwitterUrl()} className="footer_icons" target="_blank" rel="noopener noreferrer">
                                <FaXTwitter />
                            </Link>
                            <Link href={getInstagramUrl()} className="footer_icons" target="_blank" rel="noopener noreferrer">
                                <BsInstagram />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between xl:justify-end gap-auto lg:gap-35 w-full flex-wrap gap-y-10">
                    <div className="space-y-3 col-span-2">
                        <div className="footer_nav_heading text-nowrap">Assistance</div>
                        <div className="space-y-2 footer_nav_item">
                            <Link href={getHelpCenterRoutePath()} className="text-footerSilver hover:text-customWhite hover:underline cursor-pointer transition-colors">Centre d'aide</Link>
                            <Link href={getFaqRoutePath()} className="text-footerSilver hover:text-customWhite hover:underline cursor-pointer transition-colors">Foire aux questions</Link>
                            <Link href={getContactUsRoutePath()} className="text-footerSilver hover:text-customWhite hover:underline cursor-pointer transition-colors">Contactez-nous</Link>
                        </div>
                    </div>

                    <div className="space-y-3 col-span-2">
                        <div className="footer_nav_heading text-nowrap">Contact</div>
                        <div className="space-y-2 footer_nav_item">
                            <Link href="mailto:Connect@askservice.com" className="flex items-center gap-2"><span><MdEmail /></span>connect@askservice.com</Link>
                            <Link href="tel:01987654321" className="flex items-center gap-2"><span><PiPhone /></span>01 987654321</Link>
                            <Link href={getContactUsRoutePath()} className="flex items-start gap-2"><span className="mt-1.5"><BiBuilding /></span>4517 Washington Ave. Manchester, Kentucky 39495</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-1 border-[#8A8A8A66] pt-6 flex justify-between items-center flex-wrap gap-y-4">
                <p className="text-customWhite text-sm/[20px] text-wrap max-w-full md:max-w-1/2">
                    © 2026 Ask Service. All Rights Reserved.<br /> Designed & Developed by Bytelogic Technologies.
                </p>
                <div className="flex items-center justify-between gap-auto md:gap-12.5">
                    <Link href={getTermsRoutePath()} className="text-customWhite flex items-center text-sm gap-2 hover:underline cursor-pointer transition-colors">
                        <span><IoDocumentSharp /></span>
                        Terms & Service
                    </Link>
                    <Link href={getPrivacyRoutePath()} className="text-customWhite flex items-center text-sm gap-2 hover:underline cursor-pointer transition-colors">
                        <span><BiShield /></span>
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Footer;