import ImageComponent from "@/components/library/ImageComponent"
import { RootState } from "@/redux/appStore"
import { closeModal, openModal } from "@/redux/slices/allModalSlice"
import { setAuthCookies, type AuthResponseData } from "@/utils/authCookies"
import { loginWithGoogle } from "@/firebase/GoogleLogin"
import { addToast, Button } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BiArrowBack, BiPhone } from "react-icons/bi"
import { CgMail } from "react-icons/cg"
import { useDispatch, useSelector } from "react-redux"

const CustomerSignupIndex = () => {

    const { data } = useSelector((state: RootState) => state.allCommonModal);
    const dispatch = useDispatch();
    const router = useRouter();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const userType = data?.userData?.userType as string | undefined;
    const roleType = userType === "service" ? "Vendor" : "User";

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            const res = await loginWithGoogle(roleType);
            const responseData = res?.data;
            if (responseData && typeof responseData === "object") {
                const authData = responseData as AuthResponseData;
                if (authData.token ?? authData.access_token) {
                    setAuthCookies(authData);
                    router.refresh();
                    addToast({ title: "Account created successfully", color: "success", timeout: 2000 });
                    dispatch(closeModal());
                    return;
                }
            }
            addToast({ title: "Sign up completed", color: "success", timeout: 2000 });
            dispatch(closeModal());
        } catch (err: unknown) {
            const message = (err as Error & { responseData?: { message?: string } })?.responseData?.message ?? (err as Error)?.message ?? "Google sign up failed";
            addToast({ title: message, color: "danger", timeout: 3000 });
        } finally {
            setIsGoogleLoading(false);
        }
    };

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
                    <Button
                        className="btn_bg_white btn_radius btn_padding w-full font-medium"
                        onPress={handleGoogleLogin}
                        isLoading={isGoogleLoading}
                        isDisabled={isGoogleLoading}
                    >
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
            <div className="w-11/12 space-y-6.25">
                <p className="text-base text-fontBlack text-center">
                    Already have an account? <span className="text-primaryColor cursor-pointer underline underline-offset-2" onClick={() => dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignInIndex' }, modalSize: 'full' }))} onKeyDown={(e) => e.key === 'Enter' && dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignInIndex' }, modalSize: 'full' }))} role="button" tabIndex={0}>Sign In</span>
                </p>
            </div>
        </>
    )
}

export default CustomerSignupIndex