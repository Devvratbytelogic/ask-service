import ImageComponent from "@/components/library/ImageComponent";
import Link from "next/link";
import { BiBuilding, BiShield } from "react-icons/bi";
import { BsFacebook, BsInstagram, BsMailbox } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { IoDocumentSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { PiPhone } from "react-icons/pi";

const Footer = () => {
    return (
        <div className="py-[27px] px-10 bg-pinkBlack space-y-[85px]">
            <div className="flex flex-col xl:flex-row justify-between items-start px-0 lg:px-7.5 pt-5 lg:pt-[65px] gap-y-10">
                <div className="space-y-8 max-w-full md:max-w-[30svh]">
                    <div className="h-[40px] w-fit">
                        <ImageComponent url="/images/footer/ask_service_white.png" object_contain />
                    </div>
                    <div className="space-y-6">
                        <p className="text-footerSilver text-sm xl:text-[15px]/[25.5px] font-normal">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        </p>
                        <div className="flex items-center gap-3">
                            <Link href={'/facebook'} className="footer_icons">
                                <BsFacebook />
                            </Link>
                            <Link href={'/twitter'} className="footer_icons">
                                <FaXTwitter />
                            </Link>
                            <Link href={'/instagram'} className="footer_icons">
                                <BsInstagram />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between xl:justify-end gap-auto lg:gap-[140px] w-full flex-wrap gap-y-10">
                    <div className="space-y-3 col-span-2">
                        <div className="footer_nav_heading text-nowrap">Services</div>
                        <div className="space-y-2 footer_nav_item">
                            <Link href={'/'}>Cleaning</Link>
                            <Link href={'/'}>Gardening</Link>
                            <Link href={'/'}>Private Security</Link>
                            <Link href={'/'}>Become a Professional</Link>

                        </div>
                    </div>

                    <div className="space-y-3 col-span-2">
                        <div className="footer_nav_heading text-nowrap">Support</div>
                        <div className="space-y-2 footer_nav_item">
                            <Link href={'/'}>Help Center</Link>
                            <Link href={'/'}>FAQ</Link>
                            <Link href={'/'}>Contact Us</Link>
                        </div>
                    </div>

                    <div className="space-y-3 col-span-2">
                        <div className="footer_nav_heading text-nowrap">Contact</div>
                        <div className="space-y-2 footer_nav_item">
                            <Link href={'/'} className="flex items-center gap-2"><span><MdEmail/></span>Connect@askservice.com</Link>
                            <Link href={'/'} className="flex items-center gap-2"><span><PiPhone/></span>01 987654321</Link>
                            <Link href={'/'} className="flex items-start gap-2"><span className="mt-1.5"><BiBuilding/></span>4517 Washington Ave. Manchester, Kentucky 39495</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t-1 border-[#8A8A8A66] pt-6 flex justify-between items-center flex-wrap gap-y-4">
                <p className="text-customWhite text-sm/[20px] text-wrap max-w-full md:max-w-1/2">
                    © 2026 Ask Service. All Rights Reserved.<br/> Designed & Developed by Bytelogic Technologies.
                </p>
                <div className="flex items-center justify-between gap-auto md:gap-[50px]">
                    <p className="text-customWhite flex items-center text-sm gap-2">
                        <span><IoDocumentSharp/></span>
                        Terms & Service
                    </p>
                    <p className="text-customWhite flex items-center text-sm gap-2">
                        <span><BiShield/></span>
                        Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer;