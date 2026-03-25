import MyAccount from '@/components/pages/my-account/MyAccount'
import React from 'react'

export default function VendorAccountPage() {
    return (
        <>
            <div className="min-h-screen body_x_axis_padding ">
                {/* Header - centered */}
                <div className="text-center mb-10 lg:mb-12">
                    <h1 className="text-2xl md:text-5xl font-bold text-fontBlack mb-2">
                        Paramètres <span className="text-darkSilver">du compte</span>
                    </h1>
                    <p className="text-sm md:text-base text-darkSilver">
                        Gérez votre profil, votre sécurité et vos préférences
                    </p>
                </div>

                {/* Two-column layout */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <MyAccount variant="vendor" />
                </div>
            </div>
        </>
    )
}
