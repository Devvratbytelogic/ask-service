import { InfoBlueIconSVG } from '@/components/library/AllSVG'
import { Button } from '@heroui/react'
import React from 'react'

export default function SupportAlert({ title, content }: { title: string, content: string }) {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-[#EFF6FF] border border-[#BEDBFF] p-5">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full  text-primaryColor">
                        <InfoBlueIconSVG />
                    </span>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-fontBlack">{title}</p>
                        <p className="text-sm text-fontBlack">{content}</p>
                    </div>
                </div>
                <Button className="btn_radius btn_bg_blue shrink-0">Contact Support</Button>
            </div>
        </>
    )
}
