import * as Yup from 'yup'

// Email validation regex: local part + @ + domain + TLD (2+ letters)
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

export function validateEmail(email: string): boolean {
    return EMAIL_REGEX.test(email)
}

const EMAIL_VALIDATION_MESSAGE = 'Please enter a valid email address'

/** Yup field for required email (Formik + Yup). Use in schemas: email: yupRequiredEmail() */
export const yupRequiredEmail = (requiredMessage = 'Email is required') =>
    Yup.string()
        .trim()
        .required(requiredMessage)
        .matches(EMAIL_REGEX, EMAIL_VALIDATION_MESSAGE)

/** Yup field for optional email. Valid only when value is empty or matches regex. */
export const yupOptionalEmail = () =>
    Yup.string()
        .trim()
        .test('email', EMAIL_VALIDATION_MESSAGE, (value) => !value || EMAIL_REGEX.test(value))

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
    companySize: Yup.string().required('Company size is required'),
    aboutCompany: Yup.string().required('About company is required'),
})