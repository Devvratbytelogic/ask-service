import ImageComponent from "@/components/library/ImageComponent"
import { RootState } from "@/redux/appStore";
import { useSelector } from "react-redux";
import SelectUserType from "./SelectUserType";
import CustomerSignupIndex from "./CustomerSignupFlow/CustomerSignupIndex";
import CustomerSignupDetails from "./CustomerSignupFlow/CustomerSignupDetails";
import VerifyEmailPhoneNumberWithOtp from "./CustomerSignupFlow/VerifyEmailPhoneNumberWithOtp";
import CustomerSignInIndex from "./CustomerSignInFlow/CustomerSignInIndex";
import CustomerSignInDetails from "./CustomerSignInFlow/CustomerSignInDetails";
import VendorSignupDetails from "./VendorSignupFlow/VendorSignupDetails";
import VendorOtpVerification from "./VendorSignupFlow/VendorOtpVerification";
import VendorServiceListPage from "./VendorSignupFlow/VendorServiceListPage";
import ApplicationSuccessfull from "./VendorSignupFlow/ApplicationSuccessfull";
import ForgotPasswordEnterIdentifier from "./ForgotPasswordFlow/ForgotPasswordEnterIdentifier";
import ForgotPasswordOtpVerify from "./ForgotPasswordFlow/ForgotPasswordOtpVerify";
import ForgotPasswordSetNew from "./ForgotPasswordFlow/ForgotPasswordSetNew";

const LoginSignupIndex = () => {

    const { data } = useSelector((state: RootState) => state.allCommonModal);

    const renderComponent = () => {

        switch (data?.componentName) {

            case "SelectUserType":
                return <SelectUserType />
            case "CustomerSignupIndex":
                return <CustomerSignupIndex />
            case "CustomerSignupDetails":
                return <CustomerSignupDetails />
            case "VerifyEmailPhoneNumberWithOtp":
                return <VerifyEmailPhoneNumberWithOtp />
            case "CustomerSignInIndex":
                return <CustomerSignInIndex />
            case "CustomerSignInDetails":
                return <CustomerSignInDetails />
            case "VendorSignupDetails":
                return <VendorSignupDetails />
            case "VendorOtpVerification":
                return <VendorOtpVerification />
            case "VendorServiceListPage":
                return <VendorServiceListPage />
            case "ApplicationSuccessfull":
                return <ApplicationSuccessfull />
            case "ForgotPasswordEnterIdentifier":
                return <ForgotPasswordEnterIdentifier />
            case "ForgotPasswordOtpVerify":
                return <ForgotPasswordOtpVerify />
            case "ForgotPasswordSetNew":
                return <ForgotPasswordSetNew />

            default:
                return <SelectUserType />;
        }
    }

    return (
        <div className="relative flex flex-col md:flex-row h-full p-0 md:p-6">
            <div className="flex flex-col h-full items-start justify-between w-full md:w-[45%] mt-0 gap-10 xl:gap-auto max-h-[95svh] overflow-y-auto pe-10">
                <div className="h-12 w-50 shrink-0 inline-flex items-center justify-start">
                    <ImageComponent url="/images/navbar/ask_service_logo.png" img_title="ask service logo" />
                </div>
                {
                    renderComponent()
                }
            </div>
            <div
                className="hidden md:block relative flex-1 h-25 md:h-full overflow-hidden rounded-[40px] bg-[#F2F3F4] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url(/images/signup/SignupModal_bg.png)" }}
            >
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <div
                        className="relative overflow-hidden rounded-[30px] border border-white/20 py-5 px-6 space-y-5 shadow-lg"
                        style={{
                            background: "linear-gradient(to bottom left, rgba(64, 124, 233, 0.35) 0%, rgba(64, 124, 233, 0.22) 5%, rgba(64, 124, 233, 0.08) 20%, transparent 70%, transparent 100%), rgba(255, 255, 255, 0.25)",
                            backdropFilter: "blur(24px)",
                            WebkitBackdropFilter: "blur(24px)",
                        }}
                    >
                        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[10.67px] bg-primaryColor/10 p-2">
                            <ImageComponent url="/images/signup/logo.png" img_title="logo" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-fontBlack text-[22px]/[26.4px] leading-[-0.44px]">
                                Increased productivity
                            </h3>
                            <p className="text-base/[22.4px] leading-[-0.32px] text-darkSilver">
                                Enhance group performance and output by automating redundant tasks, refining processes, and speeding up business functions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginSignupIndex