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
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: yupRequiredEmail(),
    phone: Yup.string().required('Phone number is required'),
    streetAddress: Yup.string().required('Street address is required'),
    postcode: Yup.string().required('Postcode is required'),
    city: Yup.string().required('City is required'),
})
export const submitQuoteValidationSchema = Yup.object({
    quotePrice: Yup.string().required('Quote price is required'),
    serviceDescription: Yup.string().required('Service description is required'),
    availableStartDate: Yup.string().required('Available start date is required'),
})

export const securitySettingsValidationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string().required('New password is required'),
    confirmNewPassword: Yup.string()
        .required('Confirm new password is required')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
})

export const contactFormValidationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: yupRequiredEmail(),
    message: Yup.string().required('Message is required'),
})

export const vendorProfileInfoValidationSchema = Yup.object({
    businessName: Yup.string().required('Business name is required'),
    ownerName: Yup.string().required('Owner name is required'),
    serviceCategory: Yup.string().required('Service category is required'),
    email: yupRequiredEmail(),
    phone: Yup.string().required('Phone number is required'),
    businessAddress: Yup.string().required('Business address is required'),
    postcode: Yup.string().required('Postcode is required'),
    city: Yup.string().required('City is required'),
    vatNumber: Yup.string().required('VAT number is required'),
    companyRegistrationNumber: Yup.string().required('Company registration number is required'),
    yearsOfActivity: Yup.string().required('Years of activity is required'),
    // companySize: Yup.string().required('Company size is required'),
    aboutCompany: Yup.string().required('About company is required'),
})