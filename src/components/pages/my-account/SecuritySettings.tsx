'use client'

import React, { useState } from 'react'
import { Button, Input } from '@heroui/react'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { DeleteIconSVG, LockPrimaryColorSVG } from '@/components/library/AllSVG'
import { useFormik } from 'formik'
import { securitySettingsValidationSchema } from '@/utils/validation'



const inputClasses = {
    inputWrapper: 'account_input_design',
}

const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
}

export default function SecuritySettings() {
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const { values, errors, handleChange, handleBlur, handleSubmit, touched } = useFormik({
        initialValues,
        validationSchema: securitySettingsValidationSchema,
        onSubmit: (values) => {
            console.log(values)
        },
    })

    return (
        <>
            <h2 className="mb-6 text-lg font-bold text-fontBlack">Security Settings</h2>

            <div className="space-y-4">
                {/* Password Card */}
                <div className="rounded-xl border border-borderDark p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primaryColor/15">
                                <LockPrimaryColorSVG />
                            </div>
                            <div>
                                <h3 className="font-bold text-fontBlack">Password</h3>
                                <p className="mt-0.5 text-sm text-darkSilver">
                                    Last changed 3 months ago
                                </p>
                            </div>
                        </div>
                        {!isChangingPassword ? (
                            <Button className='btn_radius btn_bg_white' onPress={() => setIsChangingPassword(true)} >Change Password</Button>
                        ) : (
                            <Button className="btn_radius btn_bg_white shrink-0" onPress={() => setIsChangingPassword(false)}>Cancel</Button>
                        )}
                    </div>

                    {isChangingPassword && (
                        <div className="mt-6 space-y-4 border-t border-borderDark pt-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                    Current Password
                                </label>
                                <Input
                                    name="currentPassword"
                                    type={values.currentPassword ? 'text' : 'password'}
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}isInvalid={!!(touched.currentPassword && errors.currentPassword)}
                                    errorMessage={touched.currentPassword && errors.currentPassword}placeholder="Enter current password"
                                    classNames={inputClasses}
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                    New Password
                                </label>
                                <Input
                                    name="newPassword"
                                    type={values.newPassword ? 'text' : 'password'}
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!(touched.newPassword && errors.newPassword)}
                                    errorMessage={touched.newPassword && errors.newPassword}
                                    placeholder="Enter new password"
                                    classNames={inputClasses}
                                />
                                <p className="mt-1.5 text-xs text-darkSilver">
                                    Must be at least 8 characters with uppercase, lowercase, and
                                    numbers
                                </p>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                    Confirm New Password
                                </label>
                                <Input
                                    name="confirmNewPassword"
                                    type={values.confirmNewPassword ? 'text' : 'password'}
                                    value={values.confirmNewPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                        !!(touched.confirmNewPassword && errors.confirmNewPassword)
                                    }
                                    errorMessage={
                                        touched.confirmNewPassword && errors.confirmNewPassword
                                    }
                                    placeholder="Confirm new password"
                                    classNames={inputClasses}
                                />
                            </div>
                            <Button
                                className="btn_radius btn_bg_blue w-full"
                                onPress={() => handleSubmit()}
                            >
                                Update password
                            </Button>
                        </div>
                    )}
                </div>

                {/* Delete Account Card */}
                <div className="rounded-xl border border-borderDark p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-danger/15">
                                <DeleteIconSVG />
                            </div>
                            <div>
                                <h3 className="font-bold text-fontBlack">Delete Account</h3>
                                <p className="mt-0.5 text-sm text-darkSilver">
                                    Permanently delete your account and data
                                </p>
                            </div>
                        </div>
                        <Button className='btn_radius btn_bg_white text-red-500!'>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
