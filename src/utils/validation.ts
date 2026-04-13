import * as Yup from 'yup'

// Basic email shape: local + @ + domain with TLD (used for initial format check)
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

/**
 * Validates email with strict rules:
 * - Local: no leading/trailing dot or hyphen; no consecutive dots
 * - Domain: no label starting/ending with hyphen; no consecutive hyphens
 */
export function validateEmail(email: string): boolean {
    const trimmed = email.trim()
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) return false

    const atIndex = trimmed.indexOf('@')
    const local = trimmed.slice(0, atIndex)
    const domain = trimmed.slice(atIndex + 1)

    // Local part: no leading/trailing dot or hyphen, no consecutive dots
    if (local.startsWith('.') || local.endsWith('.')) return false
    if (local.startsWith('-') || local.endsWith('-')) return false
    if (/\.\./.test(local)) return false

    // Domain: no consecutive dots (no empty labels)
    const labels = domain.split('.')
    if (labels.some((label) => label.length === 0)) return false

    // Each domain label: no leading/trailing hyphen, no consecutive hyphens
    for (const label of labels) {
        if (label.startsWith('-') || label.endsWith('-')) return false
        if (/--/.test(label)) return false
    }

    return true
}

const EMAIL_VALIDATION_MESSAGE = 'Please enter a valid email address'

/** Yup field for required email (Formik + Yup). Use in schemas: email: yupRequiredEmail() */
export const yupRequiredEmail = (requiredMessage = 'Email is required') =>
    Yup.string()
        .trim()
        .required(requiredMessage)
        .test('email', EMAIL_VALIDATION_MESSAGE, (value) => !!value && validateEmail(value))

/** Yup field for optional email. Valid only when value is empty or passes full email validation. */
export const yupOptionalEmail = () =>
    Yup.string()
        .trim()
        .test('email', EMAIL_VALIDATION_MESSAGE, (value) => !value || validateEmail(value))

export const profileInfoValidationSchema = Yup.object({
    firstName: Yup.string().required('Ce champ est obligatoire'),
    lastName: Yup.string().required('Ce champ est obligatoired'),
    email: yupRequiredEmail(),
    phone: Yup.string().required('Ce champ est obligatoire'),
    streetAddress: Yup.string().required('Ce champ est obligatoire'),
    postcode: Yup.string().required('Ce champ est obligatoire'),
    city: Yup.string().required('Ce champ est obligatoire'),
})
export const submitQuoteValidationSchema = Yup.object({
    quotePrice: Yup.string().required('Ce champ est obligatoire'),
    serviceDescription: Yup.string().required('Ce champ est obligatoire'),
    availableStartDate: Yup.string().required('Ce champ est obligatoire'),
})

export const securitySettingsValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Ce champ est obligatoire'),
    newPassword: Yup.string().required('Ce champ est obligatoire'),
    confirmNewPassword: Yup.string()
        .required('Ce champ est obligatoire')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
})

export const contactFormValidationSchema = Yup.object({
    name: Yup.string().required('Ce champ est obligatoire'),
    email: yupRequiredEmail(),
    message: Yup.string().required('Ce champ est obligatoire'),
})

export const vendorProfileInfoValidationSchema = Yup.object({
    businessName: Yup.string().required('Ce champ est obligatoire'),
    ownerName: Yup.string().required('Ce champ est obligatoire'),
    // serviceCategory: Yup.string().required('Service category is required'),
    email: yupRequiredEmail(),
    phone: Yup.string().required('Ce champ est obligatoire'),
    businessAddress: Yup.string().required('Ce champ est obligatoire'),
    postcode: Yup.string().required('Ce champ est obligatoire'),
    city: Yup.string().required('Ce champ est obligatoire'),
    vatNumber: Yup.string().required('Ce champ est obligatoire'),
    companyRegistrationNumber: Yup.string().required('Ce champ est obligatoire'),
    yearsOfActivity: Yup.string().required("Ce champ est obligatoire"),
    // companySize: Yup.string().required('La taille de l\'entreprise est requise'),
    aboutCompany: Yup.string().required("Ce champ est obligatoire"),
    websiteLink: Yup.string()
        .trim()
        .test('empty-or-url', 'URL invalide', (value) => {
            if (!value) return true
            try {
                const u = new URL(value)
                return u.protocol === 'http:' || u.protocol === 'https:'
            } catch {
                return false
            }
        }),
})