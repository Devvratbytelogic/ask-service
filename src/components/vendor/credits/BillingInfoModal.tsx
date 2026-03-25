'use client'

import { DocumentIconSVG, LocationSVG } from '@/components/library/AllSVG'
import { useUpdateVendorProfileInfoMutation } from '@/redux/rtkQueries/allPostApi'
import { addToast, Button, Input, Modal, ModalBody, ModalContent } from '@heroui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const billingValidationSchema = Yup.object({
    businessAddress: Yup.string().required('Business address is required'),
    postcode: Yup.string().required('Postcode is required'),
    city: Yup.string().required('City is required'),
    vatNumber: Yup.string().required('VAT number is required'),
    companyRegistrationNumber: Yup.string().required('Company registration number is required'),
})

type BillingInfoModalProps = {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    initialValues: {
        businessAddress: string
        postcode: string
        city: string
        vatNumber: string
        companyRegistrationNumber: string
    }
}

export default function BillingInfoModal({ isOpen, onClose, onConfirm, initialValues }: BillingInfoModalProps) {
    const [updateVendorProfileInfo, { isLoading: isSaving }] = useUpdateVendorProfileInfoMutation()

    const { values, errors, handleChange, handleBlur, handleSubmit, touched, resetForm } = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: billingValidationSchema,
        onSubmit: async (formValues) => {
            const formData = new FormData()
            formData.append('address', formValues.businessAddress)
            formData.append('postal_code', formValues.postcode)
            formData.append('city', formValues.city)
            formData.append('vat_number', formValues.vatNumber)
            formData.append('company_registration_number', formValues.companyRegistrationNumber)

            try {
                await updateVendorProfileInfo(formData).unwrap()
                addToast({ title: 'Billing information saved', color: 'success', timeout: 2000 })
                resetForm()
                onConfirm()
            } catch {
                addToast({ title: 'Failed to save billing information. Please try again.', color: 'danger', timeout: 3000 })
            }
        },
    })

    const handleClose = () => {
        resetForm()
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={(open) => { if (!open) handleClose() }}
            size="lg"
            placement="center"
            isDismissable={false}
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
                    <ModalBody className="bg-white px-8 py-6 rounded-3xl">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-fontBlack">Billing Information Required</h2>
                            <p className="text-sm text-darkSilver mt-1">
                                Please fill in your billing details before proceeding to payment.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Business Address */}
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                    Adresse de l'entreprise <span className="text-danger">*</span>
                                </label>
                                <Input
                                    name="businessAddress"
                                    value={values.businessAddress}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!(touched.businessAddress && errors.businessAddress)}
                                    errorMessage={touched.businessAddress && errors.businessAddress}
                                    classNames={{ inputWrapper: 'account_input_design' }}
                                    startContent={<LocationSVG />}
                                    placeholder="Entrez votre adresse"
                                />
                            </div>

                            {/* Code Postal | Ville */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                        Code Postal <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        name="postcode"
                                        value={values.postcode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={!!(touched.postcode && errors.postcode)}
                                        errorMessage={touched.postcode && errors.postcode}
                                        classNames={{ inputWrapper: 'account_input_design' }}
                                        placeholder="75001"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                        Ville <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={!!(touched.city && errors.city)}
                                        errorMessage={touched.city && errors.city}
                                        classNames={{ inputWrapper: 'account_input_design' }}
                                        placeholder="Paris"
                                    />
                                </div>
                            </div>

                            {/* VAT Number | SIREN */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                        Numéro de TVA <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        name="vatNumber"
                                        value={values.vatNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={!!(touched.vatNumber && errors.vatNumber)}
                                        errorMessage={touched.vatNumber && errors.vatNumber}
                                        classNames={{ inputWrapper: 'account_input_design' }}
                                        startContent={<DocumentIconSVG />}
                                        placeholder="FR12345678901"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                        Numéro de SIREN <span className="text-danger">*</span>
                                    </label>
                                    <Input
                                        name="companyRegistrationNumber"
                                        value={values.companyRegistrationNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={!!(touched.companyRegistrationNumber && errors.companyRegistrationNumber)}
                                        errorMessage={touched.companyRegistrationNumber && errors.companyRegistrationNumber}
                                        classNames={{ inputWrapper: 'account_input_design' }}
                                        startContent={<DocumentIconSVG />}
                                        placeholder="123456789"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    onPress={handleClose}
                                    isDisabled={isSaving}
                                    className="btn_radius min-w-25 border border-[#E5E7EB] bg-white text-fontBlack font-medium"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isSaving}
                                    isDisabled={isSaving}
                                    className="btn_radius btn_bg_blue min-w-35 font-medium"
                                >
                                    Sauvegarder et payer
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                )}
            </ModalContent>
        </Modal>
    )
}
