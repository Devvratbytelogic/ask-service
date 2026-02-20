import * as Yup from 'yup'

export const profileInfoValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
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
    confirmNewPassword: Yup.string().required('Confirm new password is required'),
})