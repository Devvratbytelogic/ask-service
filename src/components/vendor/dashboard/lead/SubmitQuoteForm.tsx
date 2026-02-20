'use client'

import { InfoBlueIconSVG } from '@/components/library/AllSVG'
import { submitQuoteValidationSchema } from '@/utils/validation'
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useFormik } from 'formik'
import { useRef } from 'react'
import { FiUploadCloud } from 'react-icons/fi'

const QUOTE_VALID_OPTIONS = [
    { key: '7', label: '7 days' },
    { key: '14', label: '14 days' },
    { key: '30', label: '30 days' },
]

const initialValues = {
    quotePrice: '',
    serviceDescription: '',
    availableStartDate: '',
    quoteValidFor: '7',
}

interface SubmitQuoteFormProps {
    onCancel: () => void
}

export default function SubmitQuoteForm({ onCancel }: SubmitQuoteFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: submitQuoteValidationSchema,
            onSubmit: (vals) => {
                console.log('Submit quote:', vals)
            },
        })

    const handleUploadClick = () => fileInputRef.current?.click()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // TODO: handle file upload
        }
        e.target.value = ''
    }

    return (
        <div className="rounded-2xl border border-borderDark bg-white p-5 mt-4">
            <h3 className="font-bold text-xl text-fontBlack mb-4">Submit Your Quote</h3>

            {/* Info box */}
            <div className="flex gap-3 p-4 rounded-xl bg-[#E8F4FD] border border-[#BEDBFF] mb-6">
                <InfoBlueIconSVG />

                <div>
                    <p className="font-bold text-fontBlack text-sm">Make your quote competitive</p>
                    <p className="text-xs text-darkSilver mt-0.5">
                        Be clear, detailed, and professional. The customer will compare multiple
                        quotes.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Quote Price */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                        Quote Price <span className="text-danger">*</span>
                    </label>
                    <Input
                        name="quotePrice"
                        value={values.quotePrice}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="€ 0.00"
                        isInvalid={!!(touched.quotePrice && errors.quotePrice)}
                        errorMessage={touched.quotePrice && errors.quotePrice}
                        classNames={{ inputWrapper: 'account_input_design' }}
                    />
                    <p className="mt-1 text-xs text-darkSilver">
                        Enter your total price per visit or per service
                    </p>
                </div>

                {/* Service Description */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                        Service Description <span className="text-danger">*</span>
                    </label>
                    <Textarea
                        name="serviceDescription"
                        value={values.serviceDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Describe what your service includes, materials you'll use, your approach, and any guarantees you offer..."
                        isInvalid={!!(touched.serviceDescription && errors.serviceDescription)}
                        errorMessage={touched.serviceDescription && errors.serviceDescription}
                        minRows={4}
                        classNames={{
                            inputWrapper: 'account_input_design rounded-xl min-h-[100px]',
                            input: 'placeholder:text-placeHolderText',
                        }}
                    />
                    <p className="mt-1 text-xs text-darkSilver">
                        Be specific about what&apos;s included and not included
                    </p>
                </div>

                {/* Date and Quote Valid For */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Available Start Date <span className="text-danger">*</span>
                        </label>
                        <Input
                            name="availableStartDate"
                            value={values.availableStartDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="dd / mm / yyyy"
                            isInvalid={!!(touched.availableStartDate && errors.availableStartDate)}
                            errorMessage={touched.availableStartDate && errors.availableStartDate}
                            classNames={{ inputWrapper: 'account_input_design' }}
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                            Quote Valid For
                        </label>
                        <Select
                            selectedKeys={[values.quoteValidFor]}
                            onSelectionChange={(keys) => {
                                const key = Array.from(keys as Set<string>)[0]
                                setFieldValue('quoteValidFor', key ?? '7')
                            }}
                            classNames={{
                                trigger: 'account_input_design rounded-xl',
                                value: 'text-fontBlack',
                            }}
                            aria-label="Quote valid for"
                        >
                            {QUOTE_VALID_OPTIONS.map((opt) => (
                                <SelectItem key={opt.key}>{opt.label}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Attach Document */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-fontBlack">
                        Attach Document
                    </label>
                    <p className="mb-2 text-xs text-darkSilver">
                        Only support .jpg, .png and .svg and zip files. Upto 5MB
                    </p>
                    <Button
                        type="button"
                        onPress={handleUploadClick}
                        className='btn_radius btn_bg_white text-primary!'
                        startContent={<FiUploadCloud className="size-5 text-primaryColor" />}
                    >
                        Tap to Upload Document
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.svg,.zip"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-center pt-2">
                    <Button
                        type="button"
                        className="btn_radius btn_bg_white w-full"
                        onPress={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="btn_radius btn_bg_blue w-full"
                    >
                        Submit Quote
                    </Button>
                </div>
            </form>
        </div>
    )
}
