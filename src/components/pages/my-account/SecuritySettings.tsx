'use client'

import React, { useState } from 'react'
import { addToast, Button, Input, Modal, ModalBody, ModalContent } from '@heroui/react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
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
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
                setShowCurrentPassword(false)
                setShowNewPassword(false)
                setShowConfirmPassword(false)
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
                            <Button
                                className="btn_radius btn_bg_white shrink-0"
                                onPress={() => {
                                    resetForm()
                                    setShowCurrentPassword(false)
                                    setShowNewPassword(false)
                                    setShowConfirmPassword(false)
                                    setIsChangingPassword(false)
                                }}
                            >
                                Annuler
                            </Button>
                        )}
                    </div>

                    {isChangingPassword && (
                        <div className="mt-6 space-y-4 border-t border-borderDark pt-6">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                    Mot de passe actuel
                                </label>
                                <Input
                                    name="currentPassword"
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!(touched.currentPassword && errors.currentPassword)}
                                    errorMessage={touched.currentPassword && errors.currentPassword}
                                    placeholder="Entrez votre mot de passe actuel"
                                    classNames={inputClasses}
                                    endContent={
                                        <button
                                            type="button"
                                            className="text-lg text-placeHolderText focus:outline-none"
                                            onClick={() => setShowCurrentPassword((prev) => !prev)}
                                            aria-label={showCurrentPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                        >
                                            {showCurrentPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                        </button>
                                    }
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                    Nouveau mot de passe
                                </label>
                                <Input
                                    name="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={!!(touched.newPassword && errors.newPassword)}
                                    errorMessage={touched.newPassword && errors.newPassword}
                                    placeholder="Entrez votre nouveau mot de passe"
                                    classNames={inputClasses}
                                    endContent={
                                        <button
                                            type="button"
                                            className="text-lg text-placeHolderText focus:outline-none"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            aria-label={showNewPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                        >
                                            {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                        </button>
                                    }
                                />
                                <p className="mt-1.5 text-xs text-darkSilver">
                                    Doit contenir au moins 8 caractères avec des majuscules, minuscules et chiffres
                                </p>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                                    Confirmer le nouveau mot de passe
                                </label>
                                <Input
                                    name="confirmNewPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={values.confirmNewPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={
                                        !!(touched.confirmNewPassword && errors.confirmNewPassword)
                                    }
                                    errorMessage={
                                        touched.confirmNewPassword && errors.confirmNewPassword
                                    }
                                    placeholder="Confirmez le nouveau mot de passe"
                                    classNames={inputClasses}
                                    endContent={
                                        <button
                                            type="button"
                                            className="text-lg text-placeHolderText focus:outline-none"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                                        >
                                            {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                        </button>
                                    }
                                />
                            </div>
                            <Button
                                className="btn_radius btn_bg_blue w-full"
                                onPress={() => handleSubmit()}
                                isLoading={isChanging}
                                isDisabled={isChanging}
                            >
                                Mettre à jour le mot de passe
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
