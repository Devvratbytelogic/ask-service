'use client'

import React, { useState } from 'react'
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { BriefcaseIconSVG, BusinessNameIconSVG, CameraIconSVG, CheckGreenIconSVG, DocumentIconSVG, EnvelopeIconSVG, LocationSVG, MyLocationIconSVG, PhoneIconSVG, ProfileIconSVG, TimeIconSVG, UsersIconSVG } from '@/components/library/AllSVG'
import { useFormik } from 'formik'
import { vendorProfileInfoValidationSchema } from '@/utils/validation'

const COMPANY_SIZE_OPTIONS = [
    '1 - 10 employees',
    '2 - 10 employees',
    '11 - 50 employees',
    '51 - 200 employees',
    '201+ employees',
]

const initialValues = {
    businessName: 'Premium Home Service Ltd',
    ownerName: 'John Smith',
    serviceCategory: 'House Cleaning',
    email: 'sarah.johnson@example.com',
    phone: '07700 900123',
    businessAddress: '12 Rue de la République',
    postcode: '75001',
    city: 'Paris',
    vatNumber: 'GB123456789',
    companyRegistrationNumber: '12345678',
    yearsOfActivity: '2 years',
    companySize: '2 - 10 employees',
    aboutCompany:
        'Securatim is a leading private security and guarding company, offering a full range of security services for businesses. Our security officers are trained to handle all emergency situations, and we are committed to providing our clients with superior security solutions.',
}

export default function VendorProfileInfo() {
    const [isEditing, setIsEditing] = useState(false)

    const { values, errors, handleChange, handleBlur, handleSubmit, touched, resetForm, setFieldValue } = useFormik({
        initialValues,
        validationSchema: vendorProfileInfoValidationSchema,
        onSubmit: (values) => {
            console.log(values)
            setIsEditing(false)
        },
    })

    const handleCancel = () => {
        resetForm()
        setIsEditing(false)
    }

    return (
        <>
            {/* Section header with actions */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-fontBlack">Business Information</h2>
                {!isEditing ? (
                    <Button
                        className="btn_radius btn_bg_blue px-6"
                        onPress={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex shrink-0 gap-2">
                        <Button className="btn_radius btn_bg_white px-6" onPress={handleCancel}>
                            Cancel
                        </Button>
                        <Button
                            className="btn_radius btn_bg_blue px-6"
                            onPress={() => handleSubmit()}
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* Business header / avatar section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="relative shrink-0">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primaryColor text-lg font-bold text-white">
                        P
                    </div>
                    {isEditing && (
                        <button
                            type="button"
                            className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-darkSilver shadow-sm"
                        >
                            <CameraIconSVG />
                        </button>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-fontBlack">Premium Home Services Ltd</h3>
                    <p className="text-sm text-darkSilver">sarah.johnson@example.com</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-darkSilver">
                        <CheckGreenIconSVG />
                        Verified Vendor since January 2024
                    </p>
                </div>
            </div>

            {/* Form / view content */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                        Business Name
                    </label>
                    <Input
                        name="businessName"
                        value={values.businessName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.businessName && errors.businessName)}
                        errorMessage={touched.businessName && errors.businessName}
                        classNames={{ inputWrapper: 'account_input_design flex-1' }}
                        isDisabled={!isEditing}
                        startContent={<BusinessNameIconSVG />}
                    />
                </div>


                {/* Owner Name | Service Category */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Owner Name
                        </label>
                        <Input
                            name="ownerName"
                            value={values.ownerName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.ownerName && errors.ownerName)}
                            errorMessage={touched.ownerName && errors.ownerName}
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                            startContent={<ProfileIconSVG />}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Service Category
                        </label>
                        <Input
                            name="serviceCategory"
                            value={values.serviceCategory}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.serviceCategory && errors.serviceCategory)}
                            errorMessage={touched.serviceCategory && errors.serviceCategory}
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                            startContent={<BriefcaseIconSVG />}
                        />
                    </div>
                </div>

                {/* Email | Phone */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Email Address
                        </label>
                        <Input
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.email && errors.email)}
                            errorMessage={touched.email && errors.email}
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                            startContent={<EnvelopeIconSVG />}
                            endContent={<Button size='sm' className='btn_radius btn_outline_blue'>Verify</Button>}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Phone Number
                        </label>
                        <Input
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.phone && errors.phone)}
                            errorMessage={touched.phone && errors.phone}
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                            startContent={<PhoneIconSVG />}
                        />
                    </div>
                </div>

                {/* Business Address - full width */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                        Business Address
                    </label>
                    <Input
                        name="businessAddress"
                        value={values.businessAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.businessAddress && errors.businessAddress)}
                        errorMessage={touched.businessAddress && errors.businessAddress}
                        classNames={{ inputWrapper: 'account_input_design flex-1' }}
                        isDisabled={!isEditing}
                        startContent={<LocationSVG />}
                    />
                </div>

                {/* Postcode | City */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Postcode
                        </label>
                        <Input
                            name="postcode"
                            value={values.postcode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.postcode && errors.postcode)}
                            errorMessage={touched.postcode && errors.postcode}
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            City
                        </label>
                        <Input
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.city && errors.city)}
                            errorMessage={touched.city && errors.city}
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                        />
                    </div>
                </div>

                {/* VAT Number | Company Registration Number */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            VAT Number
                        </label>
                        <Input
                            name="vatNumber"
                            value={values.vatNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.vatNumber && errors.vatNumber)}
                            errorMessage={touched.vatNumber && errors.vatNumber}
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                            startContent={<DocumentIconSVG />}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Company Registration Number
                        </label>
                        <Input
                            name="companyRegistrationNumber"
                            value={values.companyRegistrationNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={
                                !!(touched.companyRegistrationNumber && errors.companyRegistrationNumber)
                            }
                            errorMessage={
                                touched.companyRegistrationNumber && errors.companyRegistrationNumber
                            }
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                            startContent={<DocumentIconSVG />}
                        />
                    </div>
                </div>

                {/* Years of activity | Company size */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Years of activity
                        </label>
                        <Input
                            name="yearsOfActivity"
                            value={values.yearsOfActivity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!(touched.yearsOfActivity && errors.yearsOfActivity)}
                            errorMessage={touched.yearsOfActivity && errors.yearsOfActivity}
                            classNames={{ inputWrapper: 'account_input_design flex-1' }}
                            isDisabled={!isEditing}
                            startContent={<TimeIconSVG />}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Company size
                        </label>
                        <Select
                            name="companySize"
                            selectedKeys={values.companySize ? [values.companySize] : []}
                            onSelectionChange={(keys) => {
                                const key = Array.from(keys)[0]
                                if (key) setFieldValue('companySize', key)
                            }}
                            classNames={{ trigger: 'account_input_design flex-1 min-h-10' }}
                            aria-label="Company size"
                            isDisabled={!isEditing}
                            startContent={<UsersIconSVG />}
                        >
                            {COMPANY_SIZE_OPTIONS.map((opt) => (
                                <SelectItem key={opt}>{opt}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* About company */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                        About company
                    </label>
                    <Textarea
                        name="aboutCompany"
                        value={values.aboutCompany}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={!!(touched.aboutCompany && errors.aboutCompany)}
                        errorMessage={touched.aboutCompany && errors.aboutCompany}
                        classNames={{ inputWrapper: 'account_input_design rounded-xl min-h-[100px]' }}
                        minRows={4}
                        isDisabled={!isEditing}
                    />
                </div>
            </form>
        </>
    )
}
