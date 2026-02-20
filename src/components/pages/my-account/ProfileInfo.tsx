import React from 'react'
import { Button, Input } from '@heroui/react'
import { CameraIconSVG, EnvelopeIconSVG, LocationSVG, MyLocationIconSVG, PhoneIconSVG } from '@/components/library/AllSVG'
import { MdMyLocation } from 'react-icons/md'
import { useFormik } from 'formik'
import { profileInfoValidationSchema } from '@/utils/validation'


const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    postcode: '',
    city: '',
}
export default function ProfileInfo() {
    const { values, errors, handleChange, handleBlur, handleSubmit, touched } = useFormik({
        initialValues,
        validationSchema: profileInfoValidationSchema,
        onSubmit: (values) => {
            console.log(values)
        },
    })
    return (
        <>
            {/* Section header with actions */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-bold text-fontBlack">Profile Information</h2>
                <div className="flex shrink-0 gap-2">
                    <Button className='btn_radius btn_bg_white px-6'>Cancel</Button>
                    <Button className="btn_radius btn_bg_blue" onPress={() => handleSubmit()}>Save Changes</Button>
                </div>
            </div>

            {/* User header / avatar section */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <div className="relative shrink-0">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primaryColor/20 text-lg font-bold text-primaryColor">
                        SJ
                    </div>
                    <button type="button" className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border border-white bg-[#E5E7EB] text-darkSilver shadow-sm" >
                        <CameraIconSVG />
                    </button>
                </div>
                <div>
                    <h3 className="font-bold text-fontBlack">Sarah Johnson</h3>
                    <p className="text-sm text-darkSilver">sarah.johnson@example.com</p>
                    <p className="mt-0.5 text-xs text-darkSilver">Member since January 2024</p>
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
                            value={values.firstName}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                            value={values.lastName}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                        value={values.streetAddress}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                            value={values.postcode}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                            value={values.city}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
                    className='btn_radius btn_bg_white text-primaryColor!'
                    startContent={<MyLocationIconSVG />}
                >
                    Use my current location
                </Button>
            </form>
        </>
    )
}
