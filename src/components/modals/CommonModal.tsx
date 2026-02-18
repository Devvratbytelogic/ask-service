import { RootState } from "@/redux/appStore";
import { closeModal } from "@/redux/slices/allModalSlice";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import RequestServiceFlowIndex from "../pages/RequestServiceFlow/RequestServiceFlowIndex";
import LoginSignupIndex from "../pages/LoginSignupFlow/LoginSignupIndex";
import MobileOtpVerification from "./MobileOtpVerification";
import VendorDocumentVerification from "../pages/LoginSignupFlow/VendorSignupFlow/VendorDocumentVerification";
import SubmissionSuccess from "../pages/RequestServiceFlow/SubmissionSuccess";
import ViewQuoteModal from "../pages/my-request/ViewQuoteModal";
import QuoteDetailModal from "../pages/my-request/QuoteDetailModal";
import CloseRequestModal from "../pages/my-request/CloseRequestModal";
import LeaveReviewModal from "../vendor/profile/LeaveReviewModal";
import ReportProfileModal from "../vendor/profile/ReportProfileModal";
import ReportSubmittedModal from "../vendor/profile/ReportSubmittedModal";

const CommonModal = () => {

    const dispatch = useDispatch();
    const { isOpen, componentName, modalSize, modalPadding, data, hideCloseButton } = useSelector((state: RootState) => state.allCommonModal);

    const onOpenChange = (open: boolean) => {
        if (!open) dispatch(closeModal());
    };

    const renderComponent = () => {

        switch (componentName) {

            case "RequestServiceFlowIndex":
                return <RequestServiceFlowIndex />

            case "LoginSignupIndex":
                return <LoginSignupIndex />

            case "MobileOtpVerification":
                return <MobileOtpVerification />

            case "VendorDocumentVerification":
                return <VendorDocumentVerification />

            case "SubmissionSuccess":
                return <SubmissionSuccess />

            case "ViewQuoteModal":
                return <ViewQuoteModal />

            case "QuoteDetailModal":
                return <QuoteDetailModal />

            case "CloseRequestModal":
                return <CloseRequestModal />

            case "LeaveReviewModal":
                return <LeaveReviewModal />

            case "ReportProfileModal":
                return <ReportProfileModal />

            case "ReportSubmittedModal":
                return <ReportSubmittedModal />

            default:
                return null;
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size={modalSize || '3xl'}
                onClose={() => dispatch(closeModal())}
                placement="center"
                isDismissable={false}
                hideCloseButton={hideCloseButton}
                classNames={{
                    closeButton: `
                        top-2 right-2 
                        w-9 h-9 flex items-center justify-center
                        rounded-full 
                        bg-[#F3F4F6] shadow-md
                        active:scale-95 hover:rotate-90
                        transition-all
                        text-fontBlack
                        font-bold
                        cursor-pointer
                        z-9999
                    `,
                }}
                scrollBehavior="inside"
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalBody className={`bg-white ${modalPadding || 'px-8 py-6.5'} rounded-3xl`}>
                                {renderComponent()}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default CommonModal