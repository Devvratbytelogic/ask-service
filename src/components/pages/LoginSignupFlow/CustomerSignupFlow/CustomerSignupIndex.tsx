import ImageComponent from "@/components/library/ImageComponent"
import { RootState } from "@/redux/appStore"
import { openModal } from "@/redux/slices/allModalSlice"
import { Button } from "@heroui/react"
import { BiArrowBack, BiPhone } from "react-icons/bi"
import { CgMail } from "react-icons/cg"
import { useDispatch, useSelector } from "react-redux"

const CustomerSignupIndex = () => {

    const { data } = useSelector((state: RootState) => state.allCommonModal);

    const dispatch = useDispatch();

    const signupForUserWith = (userSignupType: string) => {
        dispatch(openModal({
            componentName: 'LoginSignupIndex',
            data: {
                componentName: 'CustomerSignupDetails',
                userData: {
                    ...data?.userData,
                    userSignupType,
                }
            },
            modalSize: 'full'
        }))
    }

    return (
        <>
            <div className="space-y-3 xl:space-y-6">
                <h1 className="header_text flex items-center gap-0.5">
                    <BiArrowBack
                        className="modal_back_icon"
                        onClick={() => dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'SelectUserType' }, modalSize: 'full' }))}
                        role="button"
                        aria-label="Go back"
                    />
                    Sign up <span className="text-darkSilver ml-1"> now</span>
                </h1>
                <p className="text-fontBlack text-base">
                    By creating an account, I am also consenting to receive SMS messages and emails.
                </p>
            </div>
            <div className="w-full space-y-4.5">
                {/* Continue with Google */}
                <section className="w-11/12">
                    <Button className="btn_bg_white btn_radius btn_padding w-full font-medium">
                        <span className="size-4.5"><ImageComponent url="/images/signup/google_icon.png" img_title="google login icon" /></span>Continue with Google
                    </Button>
                </section>

                {/* Divider */}
                <div className="flex items-center gap-3 w-11/12">
                    <span className="flex-1 h-px bg-borderDark" aria-hidden="true" />
                    <span className="text-darkSilver text-sm font-medium">or</span>
                    <span className="flex-1 h-px bg-borderDark" aria-hidden="true" />
                </div>

                {/* Email & Mobile options */}
                <section className="space-y-2.5 w-11/12">
                    <Button className="btn_bg_whiteSilver btn_radius btn_padding custom_border_1px w-full font-medium text-[15px]/[22.5px]" onPress={() => signupForUserWith('email')}>
                        <span><CgMail className="text-lg" /></span>Email
                    </Button>
                    <Button className="btn_bg_whiteSilver btn_radius btn_padding custom_border_1px w-full font-medium text-[15px]/[22.5px]" onPress={() => signupForUserWith('phoneNumber')}>
                        <span><BiPhone className="text-lg" /></span>Mobile Number
                    </Button>
                </section>
            </div>
            <div className="w-11/12 space-y-[25px]">
                <p className="text-base text-fontBlack text-center">
                    Already have an account? <span className="text-primaryColor cursor-pointer underline underline-offset-2">Sign In</span>
                </p>
            </div>
        </>
    )
}

export default CustomerSignupIndex