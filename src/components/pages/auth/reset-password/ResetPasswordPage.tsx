'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi'
import { addToast } from '@heroui/react'
import { getForgotPasswordRoutePath, getLoginPageRoutePath } from '@/routes/routes'
import LeftPanel from '@/components/pages/auth/login/LeftPanel'
import AuthMobileHeader from '@/components/common/AuthMobileHeader'
import AuthThemeToggle from '@/components/common/AuthThemeToggle'
import { useSetPasswordMutation } from '@/redux/rtkQueries/authApi'
import { useRouter, useSearchParams } from 'next/navigation'

interface PasswordFormValues {
  password: string
  confirmPassword: string
}

const passwordSchema = Yup.object<PasswordFormValues>({
  password: Yup.string()
    .trim()
    .min(8, 'Votre nouveau mot de passe doit avoir au moins 8 caractères pour sécuriser votre compte.')
    .required('Ce champ est obligatoire'),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas.')
    .required('Ce champ est obligatoire'),
})

function parseResetToken(raw: string | null): string {
  if (!raw) return ''
  return raw.trim().replace(/^["']+|["']+$/g, '').trim()
}

function getRtkErrorMessage(error: unknown): string {
  const err = error as { data?: { message?: string }; message?: string }
  return err?.data?.message ?? err?.message ?? "Une erreur inattendue s'est produite"
}

interface ResetPasswordPageProps {
  logoUrl?: string | null
  logoDarkUrl?: string | null
  activeVendorsCount?: number
  activeClientsCount?: number
  averageRating?: number
}

export default function ResetPasswordPage({
  logoUrl,
  logoDarkUrl,
  activeVendorsCount,
  activeClientsCount,
  averageRating,
}: ResetPasswordPageProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetToken = parseResetToken(searchParams.get('token'))

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [setPassword, { isLoading: isSubmittingPassword }] = useSetPasswordMutation()

  const accentColor = 'var(--color-primaryColor)'
  const accentTextColor = 'white'
  const accentShadow = 'rgba(27,79,255,0.28)'

  const passwordForm = useFormik<PasswordFormValues>({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      setServerError('')
      try {
        await setPassword({
          token: resetToken,
          password: values.password,
          confirm_password: values.confirmPassword,
        }).unwrap()
        addToast({
          title: 'Mot de passe mis à jour',
          description: 'Vous pouvez vous connecter avec votre nouveau mot de passe.',
          color: 'success',
          timeout: 3000,
        })
        router.push(getLoginPageRoutePath({ role: 'customer' }))
      } catch (error: unknown) {
        const message = getRtkErrorMessage(error)
        setServerError(message)
       console.error('Error setting password:', message)
      }
    },
  })

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-x-hidden min-[901px]:grid-cols-[420px_1fr]">
      <LeftPanel
        role="customer"
        logoUrl={logoDarkUrl}
        activeVendorsCount={activeVendorsCount}
        activeClientsCount={activeClientsCount}
        averageRating={averageRating}
      />

      <div className="relative flex min-h-screen flex-col items-center bg-appSurface px-4 py-6 min-[901px]:justify-center min-[901px]:px-[5%] min-[901px]:py-12">
        <AuthThemeToggle />
        <div className="w-full max-w-110">
          <AuthMobileHeader logoUrl={logoUrl} accentColor={accentColor} />
          <div className="mb-8 text-center">
            <h3 className="mb-1.5 text-[22px] font-extrabold tracking-tight text-appText min-[901px]:text-[26px]">
              Nouveau mot de passe
            </h3>
            <p className="text-[13px] text-appTextSec min-[901px]:text-[14px]">
              {resetToken
                ? 'Votre mot de passe doit contenir au moins 8 caractères'
                : 'Le lien de réinitialisation est invalide ou a expiré'}
            </p>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-appBorder bg-appCard p-5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] min-[901px]:p-8">
            {resetToken ? (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault()
                  passwordForm.handleSubmit()
                }}
              >
                {serverError && (
                  <div
                    className="mb-5 flex animate-inscription-fade-up items-center gap-2.5 rounded-[10px] border px-4 py-3 text-[13px] font-medium text-red-600"
                    style={{ background: 'var(--color-red-light)', borderColor: 'rgba(239,68,68,0.2)' }}
                  >
                    <FiAlertCircle size={15} className="shrink-0" />
                    {serverError}
                  </div>
                )}

                <div className="mb-4">
                  <label className="mb-1.5 block text-[13px] font-semibold text-appText">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={passwordForm.values.password}
                      onChange={(e) => { passwordForm.handleChange(e); setServerError('') }}
                      onBlur={passwordForm.handleBlur}
                      className={[
                        'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-appText outline-none transition-all placeholder:text-placeHolderText',
                        passwordForm.touched.password && passwordForm.errors.password
                          ? 'border-red-500 bg-red-light'
                          : 'border-appBorder bg-appSurface hover:border-appBorder',
                      ].join(' ')}
                      style={{ fontFamily: 'inherit' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-appTextMuted transition-colors hover:text-appText"
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {passwordForm.touched.password && passwordForm.errors.password && (
                    <p className="mt-1 text-[11px] text-red-500">{passwordForm.errors.password}</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-1.5 block text-[13px] font-semibold text-appText">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      value={passwordForm.values.confirmPassword}
                      onChange={(e) => { passwordForm.handleChange(e); setServerError('') }}
                      onBlur={passwordForm.handleBlur}
                      className={[
                        'w-full rounded-[10px] border-[1.5px] py-3 pl-4 pr-11 text-[14px] text-appText outline-none transition-all placeholder:text-placeHolderText',
                        passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword
                          ? 'border-red-500 bg-red-light'
                          : 'border-appBorder bg-appSurface hover:border-appBorder',
                      ].join(' ')}
                      style={{ fontFamily: 'inherit' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-appTextMuted transition-colors hover:text-appText"
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                  {passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-red-500">{passwordForm.errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3.5 text-[15px] font-semibold transition-all hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                  style={{
                    background: accentColor,
                    color: accentTextColor,
                    boxShadow: `0 5px 16px ${accentShadow}`,
                    fontFamily: 'inherit',
                  }}
                >
                  {isSubmittingPassword ? (
                    <>
                      <span
                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
                        style={{ opacity: 0.6 }}
                      />
                      Mise à jour…
                    </>
                  ) : (
                    <>
                      Réinitialiser mon mot de passe
                      <FiArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <p className="mb-6 text-[13px] text-appTextSec">
                  Demandez un nouveau lien pour réinitialiser votre mot de passe.
                </p>
                <Link
                  href={getForgotPasswordRoutePath({ role: 'customer' })}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border-none py-3.5 text-[15px] font-semibold no-underline transition-all hover:-translate-y-px"
                  style={{
                    background: accentColor,
                    color: accentTextColor,
                    boxShadow: `0 5px 16px ${accentShadow}`,
                  }}
                >
                  Mot de passe oublié
                  <FiArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-[13px] text-appTextSec">
            Mot de passe retrouvé ?{' '}
            <Link
              href={getLoginPageRoutePath({ role: 'customer' })}
              className="font-semibold no-underline hover:underline"
              style={{ color: accentColor }}
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
