import { CustomerIconSVG, ServiceProviderIconSVG } from '@/components/library/AllSVG'
import { openModal } from '@/redux/slices/allModalSlice'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { useDispatch } from 'react-redux'

const SelectUserType = () => {

    const [userType, setUserType] = useState<string | null>(null);

    const dispatch = useDispatch();

    const openSignIn = () => {
        dispatch(openModal({ componentName: 'LoginSignupIndex', data: { componentName: 'CustomerSignInIndex' }, modalSize: 'full' }))
    }

    const startSignupForUser = () => {
        dispatch(openModal({
            componentName: 'LoginSignupIndex',
            data: {
                componentName: (userType === 'service') ? 'VendorSignupDetails' : 'CustomerSignupIndex',
                userData: {
                    userType: userType
                }
            },
            modalSize: 'full'
        }))
    }

    return (
        <>
            <div className="space-y-3 xl:space-y-6">
                <h1 className="header_text">
                    Join as a Customer or <br />
                    <span className="text-darkSilver"> Service provider</span>
                </h1>
                <p className="text-fontBlack text-base">
                    By creating an account, I am also consenting to receive SMS messages and emails.
                </p>
            </div>
            <div className="w-full space-y-3.5">
                <div className="border border-borderDark rounded-3xl p-3 md:p-5 space-y-3.5 w-11/12 cursor-pointer hover:border-darkSilver" onClick={() => setUserType("customer")}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center justify-center size-8 md:size-11 rounded-[10px] bg-customWhite overflow-hidden">
                            <CustomerIconSVG />
                        </div>
                        {(userType === 'customer') ?
                            <div className="border border-borderDark h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 p-1">
                                <FaCheck className="text-white" />
                            </div>
                            : <div className="border border-borderDark h-5 w-5 rounded-full" />}
                    </div>

                    <div>
                        <p className="text-base/[21px] text-fontBlack font-semibold">I'm a Customer, hiring for a <br /><span className="text-darkSilver">Work</span> </p>
                    </div>
                </div>
                <div className="border border-borderDark rounded-3xl p-5 space-y-3.5 w-11/12 cursor-pointer hover:border-darkSilver" onClick={() => setUserType("service")}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center justify-center size-8 md:size-11 rounded-[10px] bg-customWhite overflow-hidden">
                            <ServiceProviderIconSVG />
                        </div>
                        {(userType === 'service') ?
                            <div className="border border-borderDark h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 p-1">
                                <FaCheck className="text-white" />
                            </div>
                            : <div className="border border-borderDark h-5 w-5 rounded-full" />}
                    </div>

                    <div>
                        <p className="text-base/[21px] text-fontBlack font-semibold">I'm a Service provider, looking for a <br /><span className="text-darkSilver">Job</span> </p>
                    </div>
                </div>
            </div>
            <div className="w-11/12 space-y-6.25">
                <Button className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full" onPress={() => startSignupForUser()}>
                    Continue
                </Button>
                <p className="text-base text-fontBlack text-center">
                    Already have an account? <span className="text-primaryColor cursor-pointer underline underline-offset-2" onClick={openSignIn} onKeyDown={(e) => e.key === 'Enter' && openSignIn()} role="button" tabIndex={0}>Sign In</span>
                </p>
            </div>
        </>
    )
}

export default SelectUserType