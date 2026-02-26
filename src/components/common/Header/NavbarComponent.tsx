'use client'

import ImageComponent from "@/components/library/ImageComponent"
import { openModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import { useDispatch } from "react-redux"

const NavbarComponent = () => {

    const dispatch = useDispatch()

    const signupSiginModal = () => {
        dispatch(openModal({
            componentName: 'LoginSignupIndex',
            data: {
                singupModal: 'SelectUserType'
            },
            modalSize: 'full'
        }))
    }

    return (
        <div className="hidden md:flex gap-2 items-center">
            <Button startContent={
                <span className="h-3.5 w-3.5">
                    <ImageComponent url="/images/navbar/login_logout_icon.png" img_title="login_logout" />
                </span>
            }
                className="text-base/[22px] font-medium btn_bg_whiteSilver btn_radius btn_padding"
                onPress={() => signupSiginModal()}
            >
                Login/ Register
            </Button>

            <Button endContent={
                <span className="h-3.5 w-3.5">
                    <ImageComponent url="/images/navbar/arrow.png" img_title="login_logout" />
                </span>
            }
                className="text-base/[22px] font-medium btn_bg_blue btn_radius btn_padding">
                Become a Professional
            </Button>
        </div>
    )
}

export default NavbarComponent