"use client"

import { FiCheck } from "react-icons/fi"
import FileUploadZone from "./FileUploadZone"

export interface DocumentUploadCardProps {
    /** Document type title (e.g. "Identity Proof") */
    title: string
    /** Show red REQUIRED badge */
    required?: boolean
    /** Short description of what to upload */
    description: string
    /** Allowed types text (e.g. "PDF, JPG, PNG (Max 5MB)") */
    allowedTypes: string
    /** Current file if uploaded */
    value: File | null
    /** Called when file is set or removed */
    onChange: (file: File | null) => void
    /** Optional max file size in bytes */
    maxSizeBytes?: number
    /** Accepted input accept attribute (e.g. ".pdf,.jpg,.png") */
    accept?: string
}

export default function DocumentUploadCard({
    title,
    required = true,
    description,
    allowedTypes,
    value,
    onChange,
    maxSizeBytes = 5 * 1024 * 1024,
    accept = ".pdf,.jpg,.jpeg,.png",
}: DocumentUploadCardProps) {
    const uploaded = value !== null

    return (
        <div className="rounded-2xl border border-borderDark bg-white p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-fontBlack text-base">
                        {title}
                    </h3>
                    {required && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-danger/10 text-danger">
                            REQUIRED
                        </span>
                    )}
                </div>
                {uploaded && (
                    <span className="flex items-center gap-1 text-success text-sm font-medium shrink-0">
                        <span className="size-4 rounded-full bg-success flex items-center justify-center">
                            <FiCheck className="size-2.5 text-white" />
                        </span>
                        Uploaded
                    </span>
                )}
            </div>

            <p className="text-darkSilver text-sm">{description}</p>
            <p className="text-placeHolderText text-xs">{allowedTypes}</p>

            <FileUploadZone
                value={value}
                onChange={onChange}
                accept={accept}
                maxSizeBytes={maxSizeBytes}
                dragLabel="Drag and drop your file here"
                browseLabel="Browse files"
                ariaLabel={`Upload ${title}`}
            />
        </div>
    )
}
