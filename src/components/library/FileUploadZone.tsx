"use client"

import { useRef, useState } from "react"
import { Button } from "@heroui/react"
import { FiUploadCloud } from "react-icons/fi"
import { IoDocumentTextOutline } from "react-icons/io5"
import { RiDeleteBinLine } from "react-icons/ri"

export interface FileUploadZoneProps {
    /** Current file if uploaded */
    value: File | null
    /** Called when file is set or removed */
    onChange: (file: File | null) => void
    /** Accepted input accept attribute (e.g. ".pdf,.jpg,.png") */
    accept?: string
    /** Max file size in bytes; files over this are ignored */
    maxSizeBytes?: number
    /** Label for drag area */
    dragLabel?: string
    /** Label for browse button */
    browseLabel?: string
    /** Aria label for file input */
    ariaLabel?: string
}

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
}

export default function FileUploadZone({
    value,
    onChange,
    accept = ".pdf,.jpg,.jpeg,.png",
    maxSizeBytes = 5 * 1024 * 1024,
    dragLabel = "Drag and drop your file here",
    browseLabel = "Browse files",
    ariaLabel = "Upload file",
}: FileUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    const handleFile = (file: File | null) => {
        if (!file) {
            onChange(null)
            return
        }
        if (file.size > maxSizeBytes) return
        onChange(file)
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        handleFile(file)
        e.target.value = ""
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0] ?? null
        handleFile(file)
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = () => setIsDragging(false)

    const uploaded = value !== null

    if (uploaded) {
        return (
            <div
                className={`
                    flex items-center gap-3 p-3 rounded-xl border min-h-[56px]
                    ${isDragging ? "border-primaryColor border-dashed bg-primaryColor/5" : "border-borderDark"}
                `}
            >
                <IoDocumentTextOutline className="size-8 text-darkSilver shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-fontBlack text-sm truncate">
                        {value.name}
                    </p>
                    <p className="text-darkSilver text-xs">
                        {formatFileSize(value.size)}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="p-2 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                    aria-label="Remove file"
                >
                    <RiDeleteBinLine className="size-5" />
                </button>
            </div>
        )
    }

    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`
                flex flex-col items-center justify-center gap-2 py-8 px-4 rounded-xl border-2 border-dashed min-h-[140px] transition-colors
                ${isDragging ? "border-primaryColor bg-primaryColor/5" : "border-borderDark bg-customWhite"}
            `}
        >
            <FiUploadCloud className="size-12 text-placeHolderText" />
            <p className="text-darkSilver text-sm text-center">{dragLabel}</p>
            <p className="text-placeHolderText text-xs">or</p>
            <Button
                type="button"
                variant="bordered"
                className="rounded-xl border-borderDark text-fontBlack bg-white"
                onPress={() => inputRef.current?.click()}
            >
                {browseLabel}
            </Button>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={onInputChange}
                className="hidden"
                aria-label={ariaLabel}
            />
        </div>
    )
}
