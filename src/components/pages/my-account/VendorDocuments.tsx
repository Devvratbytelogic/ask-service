'use client'

import React, { useState } from 'react'
import { Button } from '@heroui/react'
import {
  ActionRequiredIconSVG,
  CheckGreenIconSVG,
  DocumentIconSVG,
  UploadFileIconSVG,
  VerificationPendingIconSVG,
} from '@/components/library/AllSVG'
import FileUploadZone from '@/components/library/FileUploadZone'
import SupportAlert from '@/components/vendor/dashboard/SupportAlert'

type DocStatus = 'verified' | 'pending' | 'action_required'

interface DocumentItem {
  id: string
  title: string
  description: string
  status: DocStatus
  uploadedOn?: string
  fileName?: string
  fileSizeBytes?: number
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(2)} MB`
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: 'identity',
    title: 'Identity Proof',
    description: 'Valid passport, driver\'s license, or national ID card',
    status: 'verified',
    uploadedOn: '15 Jan 2024',
    fileName: 'Identity proof.pdf',
    fileSizeBytes: 419430,
  },
  {
    id: 'trade-license',
    title: 'Trade License',
    description: 'Relevant professional licenses for your service category',
    status: 'verified',
    uploadedOn: '15 Jan 2024',
    fileName: 'Trade License.pdf',
    fileSizeBytes: 419430,
  },
  {
    id: 'compliance',
    title: 'Compliance Declaration',
    description: 'Relevant professional licenses for your service category',
    status: 'verified',
    uploadedOn: '15 Jan 2024',
    fileName: 'Compliance Declaration.pdf',
    fileSizeBytes: 419430,
  },
  {
    id: 'insurance',
    title: 'Insurance Documents',
    description: 'Relevant professional licenses for your service category',
    status: 'pending',
    uploadedOn: '15 Jan 2024',
    fileName: 'Insurance Doc.pdf',
    fileSizeBytes: 419430,
  },
  {
    id: 'business-registration',
    title: 'Business Registration Certificate',
    description: 'Certificate of incorporation or business registration',
    status: 'action_required',
  },
]

function DownloadIconSVG({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M10 12.5V2.5M10 12.5L6.66667 9.16667M10 12.5L13.3333 9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 17.5H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StatusBadge({ status }: { status: DocStatus }) {
  if (status === 'verified') {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-[#008236] rounded-full px-3 py-1 bg-[#F0FDF4]">
        <CheckGreenIconSVG />
        Verified
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="flex items-center gap-1.5 text-sm font-medium text-[#EFB261] rounded-full px-3 py-1 bg-[#FFFBEB]">
        <VerificationPendingIconSVG />
        Verification pending
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-sm font-medium text-[#E7000B] rounded-full px-3 py-1 bg-[#FEF2F2]">
      <ActionRequiredIconSVG />
      Action Required
    </span>
  )
}

export default function VendorDocuments() {
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-fontBlack">Verification Documents</h2>
        <p className="mt-1 text-sm text-darkSilver">
          Manage your uploaded documents and verification status
        </p>
      </div>

      <div className="space-y-4">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            className="rounded-2xl border border-borderDark bg-white p-4 sm:p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-fontBlack">{doc.title}</h3>
                  <StatusBadge status={doc.status} />
                </div>
                <p className="mt-1 text-sm text-darkSilver">{doc.description}</p>
                {doc.status === 'action_required' && (
                  <p className="mt-0.5 text-xs text-darkSilver">
                    PDF, JPG, PNG (Max 5MB)
                  </p>
                )}
                {doc.uploadedOn && doc.status !== 'action_required' && (
                  <p className="mt-1 text-xs text-darkSilver">
                    Uploaded on {doc.uploadedOn}
                  </p>
                )}
              </div>
            </div>

            {doc.status !== 'action_required' && doc.fileName && (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#F9FAFB] px-4 py-3">
                <div className='flex items-center gap-3'>
                  <span className="p-2 rounded-xl border border-borderDark bg-white [&_svg]:size-6">
                    <UploadFileIconSVG />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {doc.fileName}
                    </p>
                    {doc.fileSizeBytes != null && (
                      <p className="text-xs text-darkSilver">
                        {formatFileSize(doc.fileSizeBytes)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 sm:flex-row-reverse">
                  <Button
                    className="btn_bg_white border-none"
                    startContent={<DownloadIconSVG />}
                    onPress={() => { }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            )}

            {doc.status === 'action_required' && doc.id === 'business-registration' && (
              <div className="mt-4">
                <FileUploadZone
                  value={uploadFile}
                  onChange={setUploadFile}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSizeBytes={5 * 1024 * 1024}
                  dragLabel="Drag and drop your file here"
                  browseLabel="Re-upload Document"
                  ariaLabel="Upload Business Registration Certificate"
                  buttonClassName="btn_radius btn_bg_blue text-white"
                />
              </div>
            )}
          </div>
        ))}

        <SupportAlert title="Need help with document verification?" content={`If you have questions about document requirements or need assistance, please contact our vendor support team.`} />
      </div>
      
    </>
  )
}
