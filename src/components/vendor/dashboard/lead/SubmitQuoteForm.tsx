'use client'

import { InfoBlueIconSVG } from '@/components/library/AllSVG'
import { useSubmitQuoteMutation } from '@/redux/rtkQueries/allPostApi'
import { submitQuoteValidationSchema } from '@/utils/validation'
import { addToast, Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { useFormik } from 'formik'
import { useState, useRef } from 'react'
import { FiCalendar, FiUploadCloud } from 'react-icons/fi'

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.svg']
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

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

function toApiDate(dateStr: string): string {
    if (!dateStr.trim()) return ''
    const trimmed = dateStr.trim()
    const match = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
    if (match) {
        const [, d, m, y] = match
        return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`
    }
    return trimmed
}

interface SubmitQuoteFormProps {
    leadId: string
    onCancel: () => void
}

export default function SubmitQuoteForm({ leadId, onCancel }: SubmitQuoteFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [attachment, setAttachment] = useState<File | null>(null)
    const [submitQuote, { isLoading }] = useSubmitQuoteMutation()

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
        useFormik({
            initialValues,
            validationSchema: submitQuoteValidationSchema,
            onSubmit: async (vals) => {
                const formData = new FormData()
                formData.append('quote_price', vals.quotePrice)
                formData.append('service_description', vals.serviceDescription)
                formData.append('available_start_date', toApiDate(vals.availableStartDate))
                formData.append('quote_valid_days', vals.quoteValidFor)
                if (attachment) {
                    formData.append('attachment', attachment)
                }

                try {
                    await submitQuote({ leadId, formData }).unwrap()
                    addToast({ title: 'Devis soumis avec succès', color: 'success', timeout: 2000 })
                    onCancel()
                } catch {
                    // Error toast handled by base query
                }
            },
        })

    const handleUploadClick = () => fileInputRef.current?.click()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return

        const ext = '.' + file.name.split('.').pop()?.toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            addToast({
                title: `Type de fichier invalide. Autorisés : ${ALLOWED_EXTENSIONS.join(', ')}`,
                color: 'danger',
            })
            return
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            addToast({ title: 'Le fichier doit faire 5 Mo ou moins', color: 'danger' })
            return
        }
        setAttachment(file)
    }

    return (
        <div className="rounded-2xl border border-borderDark bg-white p-5 mt-4">
            <h3 className="font-bold text-xl text-fontBlack mb-4">Envoyer un devis</h3>

            {/* Info box */}
            <div className="flex gap-3 p-4 rounded-xl bg-[#E8F4FD] border border-[#BEDBFF] mb-6">
                <InfoBlueIconSVG />

                <div>
                    <p className="font-bold text-fontBlack text-sm">Conseils pour remporter la mission</p>
                    <p className="text-xs text-darkSilver mt-0.5">
                        Soyez clair sur ce qui est inclus dans le prix. Présentez votre expérience et vos qualifications. Répondez aux exigences spécifiques mentionnées. Proposez un prix compétitif tout en restant juste.
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
                            type="date"
                            value={values.availableStartDate}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            min={new Date().toISOString().slice(0, 10)}
                            isInvalid={!!(touched.availableStartDate && errors.availableStartDate)}
                            errorMessage={touched.availableStartDate && errors.availableStartDate}
                            classNames={{ inputWrapper: 'account_input_design' }}
                            // endContent={<FiCalendar className="size-5 text-darkSilver shrink-0 pointer-events-none" aria-hidden />}
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
                        Only support .jpg, .png, .doc, .docx, .pdf and .svg and upto 5MB
                    </p>
                    <Button
                        type="button"
                        onPress={handleUploadClick}
                        className='btn_radius btn_bg_white text-primary!'
                        startContent={<FiUploadCloud className="size-5 text-primaryColor" />}
                    >
                        Tap to Upload Document
                    </Button>
                    {attachment && (
                        <p className="mt-1.5 text-sm text-fontBlack">{attachment.name}</p>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.doc,.docx,.pdf,.svg"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-center pt-2">
                    <Button
                        type="button"
                        className="btn_radius btn_bg_white w-full hover:bg-gray-300!"
                        onPress={onCancel}
                        isDisabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="btn_radius btn_bg_blue w-full"
                        isLoading={isLoading}
                        isDisabled={isLoading}
                    >
                        Envoyer un devis
                    </Button>
                </div>
            </form>
        </div>
    )
}
