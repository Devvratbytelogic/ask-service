'use client'
import ImageComponent from "../../library/ImageComponent";
import NavbarComponent from "./NavbarComponent";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname()
    console.log(pathname)
    const isVendorPage = pathname.startsWith('/vendor');
    return (
        <div className={`navbar_x_axis_padding navbar_y_axis_padding ${isVendorPage ? 'sticky' : 'fixed'} top-0 left-0 right-0 z-9`} id="main_navbar">
            <div className="px-4 py-2 backdrop-blur-lg bg-navBgColor rounded-full flex justify-between items-center">
                <div className="h-12 w-50 shrink-0 inline-flex items-center justify-start">
                    <ImageComponent url="/images/navbar/ask_service_logo.png" img_title="ask service logo" object_contain />
                </div>
                <NavbarComponent />
            </div>
        </div>
    )
}

export default Header;