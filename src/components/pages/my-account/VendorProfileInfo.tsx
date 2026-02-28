'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { addToast, Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { BriefcaseIconSVG, BusinessNameIconSVG, CameraIconSVG, CheckGreenIconSVG, DocumentIconSVG, EnvelopeIconSVG, LocationSVG, MyLocationIconSVG, PhoneIconSVG, ProfileIconSVG, TimeIconSVG, UsersIconSVG } from '@/components/library/AllSVG'
import { useFormik } from 'formik'
import { vendorProfileInfoValidationSchema } from '@/utils/validation'
import { useUpdateVendorProfileInfoMutation } from '@/redux/rtkQueries/allPostApi'
import { useGetVendorProfileInfoQuery } from '@/redux/rtkQueries/clientSideGetApis'

const COMPANY_SIZE_OPTIONS = [
    '1 - 10 employees',
    '2 - 10 employees',
    '11 - 50 employees',
    '51 - 200 employees',
    '201+ employees',
]


const defaultInitialValues = {
    businessName: '',
    ownerName: '',
    serviceCategory: '',
    email: '',
    phone: '',
    businessAddress: '',
    postcode: '',
    city: '',
    vatNumber: '',
    companyRegistrationNumber: '',
    yearsOfActivity: '',
    companySize: '',
    aboutCompany: '',
}

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function VendorProfileInfo() {
    const [isEditing, setIsEditing] = useState(false)
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
    const profilePicInputRef = useRef<HTMLInputElement>(null)
    const [updateVendorProfileInfo, { isLoading: isUpdating }] = useUpdateVendorProfileInfoMutation()
    const { data } = useGetVendorProfileInfoQuery()

    const profileData = data?.data
    const initialValues = {
        businessName: profileData?.business_name ?? defaultInitialValues.businessName,
        ownerName: [profileData?.first_name, profileData?.last_name].filter(Boolean).join(' '),
        serviceCategory: profileData?.service?.title ?? defaultInitialValues.serviceCategory,
        email: profileData?.email ?? defaultInitialValues.email,
        phone: profileData?.phone ?? defaultInitialValues.phone,
        businessAddress: profileData?.address ?? defaultInitialValues.businessAddress,
        postcode: profileData?.postal_code ?? defaultInitialValues.postcode,
        city: profileData?.city ?? defaultInitialValues.city,
        vatNumber: profileData?.vat_number ?? defaultInitialValues.vatNumber,
        companyRegistrationNumber: profileData?.company_registration_number ?? defaultInitialValues.companyRegistrationNumber,
        yearsOfActivity: profileData?.years_of_activity ?? defaultInitialValues.yearsOfActivity,
        companySize: profileData?.company_size ?? defaultInitialValues.companySize,
        aboutCompany: profileData?.about_company ?? defaultInitialValues.aboutCompany,
    }

    const { values, errors, handleChange, handleBlur, handleSubmit, touched, resetForm, setFieldValue } = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: vendorProfileInfoValidationSchema,
        onSubmit: async (formValues) => {
            const [firstName, ...lastNameParts] = (formValues.ownerName || '').trim().split(/\s+/)
            const lastName = lastNameParts.join(' ') || ''

            const formData = new FormData()
            formData.append('first_name', firstName)
            formData.append('last_name', lastName)
            formData.append('email', formValues.email)
            formData.append('phone', formValues.phone)
            formData.append('business_name', formValues.businessName)
            formData.append('address', formValues.businessAddress)
            formData.append('postal_code', formValues.postcode)
            formData.append('city', formValues.city)
            formData.append('vat_number', formValues.vatNumber)
            formData.append('company_registration_number', formValues.companyRegistrationNumber)
            formData.append('years_of_activity', formValues.yearsOfActivity)
            formData.append('company_size', formValues.companySize)
            formData.append('about_company', formValues.aboutCompany)

            if (profilePicFile) {
                formData.append('profile_pic', profilePicFile)
            }

            try {
                await updateVendorProfileInfo(formData).unwrap()
                addToast({ title: 'Profile updated successfully', color: 'success', timeout: 2000 })
                setProfilePicFile(null)
                setIsEditing(false)
            } catch {
                // Error is handled by RTK Query / toast
            }
        },
    })

    const handleCancel = () => {
        resetForm()
        setProfilePicFile(null)
        setIsEditing(false)
    }

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            setProfilePicFile(file)
        }
        e.target.value = ''
    }

    const profilePicPreviewUrl = useMemo(
        () => (profilePicFile ? URL.createObjectURL(profilePicFile) : null),
        [profilePicFile]
    )
    useEffect(() => {
        return () => {
            if (profilePicPreviewUrl) URL.revokeObjectURL(profilePicPreviewUrl)
        }
    }, [profilePicPreviewUrl])

    const existingProfilePicUrl =
        typeof profileData?.profile_pic === 'string' && profileData.profile_pic
            ? profileData.profile_pic
            : null
    const avatarSrc = profilePicPreviewUrl ?? existingProfilePicUrl

    const hasBusinessDetails = !!(
        profileData?.business_name ||
        profileData?.address ||
        profileData?.vat_number ||
        profileData?.about_company
    )

    const displayName = hasBusinessDetails
        ? (values.businessName || profileData?.business_name || '')
        : (values.ownerName || [profileData?.first_name, profileData?.last_name].filter(Boolean).join(' '))

    const avatarInitials = hasBusinessDetails
        ? (displayName?.charAt(0) || 'P').toUpperCase()
        : [
              profileData?.first_name?.charAt(0),
              profileData?.last_name?.charAt(0),
          ]
              .filter(Boolean)
              .join('')
              .toUpperCase() || 'U'

    const memberSinceDate = profileData?.createdAt
        ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : ''

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
                            isLoading={isUpdating}
                            isDisabled={isUpdating}
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* Business / User header / avatar section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="relative shrink-0">
                    <input
                        ref={profilePicInputRef}
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(',')}
                        onChange={handleProfilePicChange}
                        className="hidden"
                        aria-label="Upload profile picture"
                    />
                    {avatarSrc ? (
                        <img
                            src={avatarSrc}
                            alt="Profile"
                            className="size-16 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <div
                            className={`flex size-16 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                                hasBusinessDetails
                                    ? 'bg-primaryColor text-white'
                                    : 'bg-primaryColor/20 text-primaryColor'
                            }`}
                        >
                            {avatarInitials}
                        </div>
                    )}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => profilePicInputRef.current?.click()}
                            className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-darkSilver shadow-sm"
                        >
                            <CameraIconSVG />
                        </button>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-fontBlack">
                        {displayName || '—'}
                    </h3>
                    <p className="text-sm text-darkSilver">
                        {values.email || profileData?.email || '—'}
                    </p>
                    {memberSinceDate && (
                        <p className={`mt-0.5 text-xs text-darkSilver ${hasBusinessDetails ? 'flex items-center gap-1.5' : ''}`}>
                            {hasBusinessDetails && <CheckGreenIconSVG />}
                            {hasBusinessDetails ? 'Verified Vendor since ' : 'Member since '}
                            {memberSinceDate}
                        </p>
                    )}
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
                            endContent={
                                !profileData?.is_email_verified && isEditing ? (
                                    <Button size="sm" className="btn_radius btn_outline_blue">
                                        Verify
                                    </Button>
                                ) : undefined
                            }
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
