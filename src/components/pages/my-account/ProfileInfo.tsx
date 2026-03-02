'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { addToast, Button, Input } from '@heroui/react'
import { CameraIconSVG, EnvelopeIconSVG, LocationSVG, MyLocationIconSVG, PhoneIconSVG } from '@/components/library/AllSVG'
import { useFormik } from 'formik'
import { profileInfoValidationSchema } from '@/utils/validation'
import { useGetUserProfileInfoQuery } from '@/redux/rtkQueries/clientSideGetApis'
import { useUpdateUserProfileInfoMutation } from '@/redux/rtkQueries/allPostApi'

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const defaultInitialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    postcode: '',
    city: '',
}

export default function ProfileInfo() {
    const [isEditing, setIsEditing] = useState(false)
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
    const profilePicInputRef = useRef<HTMLInputElement>(null)
    const { data, isLoading } = useGetUserProfileInfoQuery()
    const [updateUserProfileInfo, { isLoading: isUpdating }] = useUpdateUserProfileInfoMutation()

    const profileData = data?.data
    const initialValues = {
        firstName: profileData?.first_name ?? defaultInitialValues.firstName,
        lastName: profileData?.last_name ?? defaultInitialValues.lastName,
        email: profileData?.email ?? defaultInitialValues.email,
        phone: profileData?.phone ?? defaultInitialValues.phone,
        streetAddress: profileData?.address ?? profileData?.street_address ?? defaultInitialValues.streetAddress,
        postcode: profileData?.postal_code ?? profileData?.postcode ?? defaultInitialValues.postcode,
        city: profileData?.city ?? defaultInitialValues.city,
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
        typeof profileData?.profile_pic === 'string' && profileData.profile_pic ? profileData.profile_pic : null
    const avatarSrc = profilePicPreviewUrl ?? existingProfilePicUrl

    const { values, errors, handleChange, handleBlur, handleSubmit, touched, resetForm } = useFormik({
        initialValues,
        enableReinitialize: true,
        validationSchema: profileInfoValidationSchema,
        onSubmit: async (formValues) => {
            try {
                if (profilePicFile) {
                    const formData = new FormData()
                    formData.append('first_name', formValues.firstName)
                    formData.append('last_name', formValues.lastName)
                    formData.append('email', formValues.email)
                    formData.append('phone', formValues.phone)
                    formData.append('address', formValues.streetAddress)
                    formData.append('postal_code', formValues.postcode)
                    formData.append('city', formValues.city)
                    formData.append('profile_pic', profilePicFile)
                    await updateUserProfileInfo(formData).unwrap()
                } else {
                    await updateUserProfileInfo({
                        first_name: formValues.firstName,
                        last_name: formValues.lastName,
                        email: formValues.email,
                        phone: formValues.phone,
                        address: formValues.streetAddress,
                        postal_code: formValues.postcode,
                        city: formValues.city,
                    }).unwrap()
                }
                addToast({ title: 'Profile updated successfully', color: 'success', timeout: 2000 })
                setProfilePicFile(null)
                setIsEditing(false)
            } catch {
                addToast({ title: 'Failed to update profile', color: 'danger', timeout: 2000 })
            }
        },
    })
    return (
        <>
            {/* Section header with actions */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-fontBlack">Profile Information</h2>
                {!isEditing ? (
                    <Button className="btn_radius btn_bg_blue px-6" onPress={() => setIsEditing(true)}>
                        Edit Profile
                    </Button>
                ) : (
                    <div className="flex shrink-0 gap-2">
                        <Button className="btn_radius btn_bg_white px-6" onPress={() => { resetForm(); setProfilePicFile(null); setIsEditing(false) }}>Cancel</Button>
                        <Button
                            className="btn_radius btn_bg_blue"
                            isLoading={isUpdating}
                            isDisabled={isLoading}
                            onPress={() => handleSubmit()}
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </div>

            {/* User header / avatar section */}
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
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primaryColor/20 text-lg font-bold text-primaryColor">
                            {[profileData?.first_name?.charAt(0), profileData?.last_name?.charAt(0)].filter(Boolean).join('').toUpperCase() || 'U'}
                        </div>
                    )}
                    {isEditing && (
                        <button
                            type="button"
                            onClick={() => profilePicInputRef.current?.click()}
                            className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-darkSilver shadow-sm"
                            aria-label="Change profile picture"
                        >
                            <CameraIconSVG />
                        </button>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-fontBlack">
                        {isLoading ? '...' : [profileData?.first_name, profileData?.last_name].filter(Boolean).join(' ') || 'User'}
                    </h3>
                    <p className="text-sm text-darkSilver">{profileData?.email ?? '—'}</p>
                    {profileData?.createdAt && (
                        <p className="mt-0.5 text-xs text-darkSilver">
                            Member since {new Date(profileData.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                        </p>
                    )}
                </div>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            First Name
                        </label>
                        <Input
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isReadOnly={!isEditing}
                            isInvalid={!!(touched.firstName && errors.firstName)}
                            errorMessage={touched.firstName && errors.firstName}
                            classNames={{
                                inputWrapper: 'account_input_design',
                            }}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Last Name
                        </label>
                        <Input
                            name="lastName"
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isReadOnly={!isEditing}
                            isInvalid={!!(touched.lastName && errors.lastName)}
                            errorMessage={touched.lastName && errors.lastName}
                            classNames={{
                                inputWrapper: 'account_input_design',
                            }}
                        />
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Email Address
                        </label>
                        <Input
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isReadOnly={!isEditing}
                            isInvalid={!!(touched.email && errors.email)}
                            errorMessage={touched.email && errors.email}
                            startContent={<EnvelopeIconSVG />}
                            classNames={{
                                inputWrapper: 'account_input_design',
                            }}
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
                            isReadOnly={!isEditing}
                            isInvalid={!!(touched.phone && errors.phone)}
                            errorMessage={touched.phone && errors.phone}
                            startContent={<PhoneIconSVG />}
                            classNames={{
                                inputWrapper: 'account_input_design',
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                        Street Address
                    </label>
                    <Input
                        name="streetAddress"
                        value={values.streetAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isReadOnly={!isEditing}
                        isInvalid={!!(touched.streetAddress && errors.streetAddress)}
                        errorMessage={touched.streetAddress && errors.streetAddress}
                        startContent={<LocationSVG />}
                        classNames={{
                            inputWrapper: 'account_input_design',
                        }}
                    />
                </div>

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
                            isReadOnly={!isEditing}
                            isInvalid={!!(touched.postcode && errors.postcode)}
                            errorMessage={touched.postcode && errors.postcode}
                            classNames={{
                                inputWrapper: 'account_input_design',
                            }}
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
                            isReadOnly={!isEditing}
                            isInvalid={!!(touched.city && errors.city)}
                            errorMessage={touched.city && errors.city}
                            classNames={{
                                inputWrapper: 'account_input_design',
                            }}
                        />
                    </div>
                </div>

                <Button
                    type="button"
                    className="btn_radius btn_bg_white text-primaryColor!"
                    startContent={<MyLocationIconSVG />}
                    isDisabled={!isEditing}
                >
                    Use my current location
                </Button>
            </form>
        </>
    )
}
