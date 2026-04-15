'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToast, Button, Input, Modal, ModalBody, ModalContent } from '@heroui/react'
import { DeleteIconSVG, LockPrimaryColorSVG } from '@/components/library/AllSVG'
import { useFormik } from 'formik'
import { securitySettingsValidationSchema } from '@/utils/validation'
import {
    useChangeVendorPasswordMutation,
    useChangeUserPasswordMutation,
    useDeleteVendorAccountMutation,
    useDeleteUserAccountMutation,
} from '@/redux/rtkQueries/allPostApi'
import { clearAllCookiesAndReload } from '@/utils/authCookies'
import { getHomeRoutePath } from '@/routes/routes'

const inputClasses = {
    inputWrapper: 'account_input_design',
}

const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
}

interface SecuritySettingsProps {
    variant?: 'default' | 'vendor'
}

export default function SecuritySettings({ variant = 'default' }: SecuritySettingsProps) {
    const router = useRouter()
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [changeVendorPassword, { isLoading: isChangingVendor }] = useChangeVendorPasswordMutation()
    const [changeUserPassword, { isLoading: isChangingUser }] = useChangeUserPasswordMutation()
    const [deleteVendorAccount, { isLoading: isDeletingVendor }] = useDeleteVendorAccountMutation()
    const [deleteUserAccount, { isLoading: isDeletingUser }] = useDeleteUserAccountMutation()

    const isChanging = variant === 'vendor' ? isChangingVendor : isChangingUser
    const isDeleting = variant === 'vendor' ? isDeletingVendor : isDeletingUser
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDeleteAccountClick = () => setShowDeleteConfirm(true)

    const handleDeleteAccountConfirm = async () => {
        setShowDeleteConfirm(false)
        try {
            if (variant === 'vendor') {
                await deleteVendorAccount({}).unwrap()
            } else {
                await deleteUserAccount({}).unwrap()
            }
            addToast({ title: 'Compte supprimé avec succès', color: 'success', timeout: 2000 })
            clearAllCookiesAndReload(getHomeRoutePath())
        } catch {
            // Error is handled by RTK Query / toast
        }
    }

    const { values, errors, handleChange, handleBlur, handleSubmit, touched, resetForm } = useFormik({
        initialValues,
        validationSchema: securitySettingsValidationSchema,
        onSubmit: async (formValues) => {
            const payload = { old_password: formValues.currentPassword, new_password: formValues.newPassword }
            try {
                if (variant === 'vendor') {
                    await changeVendorPassword(payload).unwrap()
                } else {
                    await changeUserPassword(payload).unwrap()
                }
                addToast({ title: 'Mot de passe mis à jour avec succès', color: 'success', timeout: 2000 })
                resetForm()
                setIsChangingPassword(false)
            } catch {
                // Error is handled by RTK Query / toast
            }
        },
    })

    return (
        <>
            <h2 className="mb-6 text-lg font-bold text-fontBlack">Paramètres de sécurité</h2>

            <div className="space-y-4">
                {/* Password Card */}
                <div className="rounded-xl border border-borderDark p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primaryColor/15">
                                <LockPrimaryColorSVG />
                            </div>
                            <div>
                                <h3 className="font-bold text-fontBlack">Mot de passe</h3>
                                <p className="mt-0.5 text-sm text-darkSilver">
                                    Modifié il y a 3 mois
                                </p>
                            </div>
                        </div>
                        {!isChangingPassword ? (
                            <Button className='btn_radius btn_bg_white' onPress={() => setIsChangingPassword(true)} >Changer le mot de passe</Button>
                        ) : (
                            <Button className="btn_radius btn_bg_white shrink-0" onPress={() => setIsChangingPassword(false)}>Annuler</Button>
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
                                isLoading={isChanging}
                                isDisabled={isChanging}
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
                                <h3 className="font-bold text-fontBlack">Supprimer le compte</h3>
                                <p className="mt-0.5 text-sm text-darkSilver">
                                    Cette action est permanente et supprimera définitivement votre compte et toutes vos données.
                                </p>
                            </div>
                        </div>
                        <Button
                            className="btn_radius btn_bg_white text-red-500!"
                            onPress={handleDeleteAccountClick}
                            isLoading={isDeleting}
                            isDisabled={isDeleting}
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete account confirmation modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                placement="center"
                size="md"
                classNames={{ base: 'rounded-3xl' }}
            >
                <ModalContent>
                    <ModalBody className="bg-white px-6 py-6 rounded-3xl">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-danger/15">
                                <DeleteIconSVG />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-fontBlack">
                                    Supprimer le compte ?
                                </h3>
                                <p className="mt-2 text-sm text-darkSilver">
                                    Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et toutes vos données seront perdues.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                            <Button
                                className="btn_radius btn_bg_white"
                                onPress={() => setShowDeleteConfirm(false)}
                                isDisabled={isDeleting}
                            >
                                Annuler
                            </Button>
                            <Button
                                className="btn_radius bg-danger text-white font-medium"
                                onPress={handleDeleteAccountConfirm}
                                isLoading={isDeleting}
                                isDisabled={isDeleting}
                                startContent={!isDeleting ? <span className="inline-flex text-white"><DeleteIconSVG /></span> : null}
                            >
                                Supprimer définitivement
                            </Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
