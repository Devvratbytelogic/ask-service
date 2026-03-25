import { CustomerIconSVG, ServiceProviderIconSVG } from '@/components/library/AllSVG'
import { RootState } from '@/redux/appStore'
import { openModal } from '@/redux/slices/allModalSlice'
import { Button } from '@heroui/react'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'

const SelectUserType = () => {
    const { data } = useSelector((state: RootState) => state.allCommonModal);
    const [userType, setUserType] = useState<string | null>(data?.preselectedUserType ?? null);

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
                    Inscrivez-vous en tant que client ou
                    <span className="text-darkSilver"> prestataire</span>
                </h1>
                <p className="text-fontBlack text-base">
                    En créant un compte, j'accepte également de recevoir des SMS et des emails.
                </p>
            </div>
            <div className="w-full space-y-3.5">
                <div className="border border-borderDark rounded-3xl p-3 md:p-5 space-y-3.5 w-full cursor-pointer hover:border-darkSilver" onClick={() => setUserType("customer")}>
                    <div className="flex justify-between items-start">
                        <div className='flex gap-5'>
                            <div className="flex items-center justify-center size-8 md:size-11 rounded-[10px] bg-customWhite overflow-hidden">
                                <CustomerIconSVG />
                            </div>
                            <div>
                                <p className="text-base/[21px] text-fontBlack font-semibold">Je suis un client et je cherche un <br /><span className="text-darkSilver">professionnel</span> </p>
                            </div>
                        </div>

                        {(userType === 'customer') ?
                            <div className="border border-borderDark h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 p-1">
                                <FaCheck className="text-white" />
                            </div>
                            : <div className="border border-borderDark h-5 w-5 rounded-full" />}

                    </div>

                </div>
                <div className="border border-borderDark rounded-3xl p-5 space-y-3.5 w-full cursor-pointer hover:border-darkSilver" onClick={() => setUserType("service")}>
                    <div className="flex justify-between items-start">
                        <div className='flex gap-5'>
                            <div className="flex items-center justify-center size-8 md:size-11 rounded-[10px] bg-customWhite overflow-hidden">
                                <ServiceProviderIconSVG />
                            </div>
                            <div>
                                <p className="text-base/[21px] text-fontBlack font-semibold">Je suis un prestataire et je recherche des <br /><span className="text-darkSilver">missions</span> </p>
                            </div>
                        </div>
                        {(userType === 'service') ?
                            <div className="border border-borderDark h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0 p-1">
                                <FaCheck className="text-white" />
                            </div>
                            : <div className="border border-borderDark h-5 w-5 rounded-full" />}
                    </div>

                </div>
            </div>
            <div className="w-full space-y-6.25">
                <Button className="btn_bg_blue btn_radius btn_padding font-medium text-sm w-full" onPress={() => startSignupForUser()}>
                    Continuer
                </Button>
                <p className="text-base text-fontBlack text-center">
                    Vous avez déjà un compte ? <span className="text-primaryColor cursor-pointer underline underline-offset-2" onClick={openSignIn} onKeyDown={(e) => e.key === 'Enter' && openSignIn()} role="button" tabIndex={0}>Connectez-vous</span>
                </p>
            </div>
        </>
    )
}

export default SelectUserType