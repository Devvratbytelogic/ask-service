'use client'
import { useDispatch } from 'react-redux'
import { openModal } from '@/redux/slices/allModalSlice'
import { FlagIconSVG, LocationSVG, ShieldSecurityIconSVG, StarRatingIconSVG, VerifiedGreenShieldIconSVG } from '@/components/library/AllSVG'
import { Button } from '@heroui/react'
import ImageComponent from '@/components/library/ImageComponent'
import { IVendorDetailsAPIResponseDataReview, IVendorDetailsAPIResponseDataVendor } from '@/types/vendorDetails'

interface VendorProfileSidebarProps {
    profile?: IVendorDetailsAPIResponseDataVendor | null
    review?: IVendorDetailsAPIResponseDataReview | null
}

export default function VendorProfileSidebar({ profile, review }: VendorProfileSidebarProps) {
    const dispatch = useDispatch()
    const averageRating = review?.averageRating ?? 0
    const totalReviews = review?.totalReviews ?? 0
    const businessName = profile?.business_name || 'Securatim Security Services'
    const displayAddress = profile?.address || (profile?.city ? [profile.city, profile.postal_code].filter(Boolean).join(', ') : null) || '9-11 Avenue Michelet, Saint-Ouen-sur-Seine'
    const serviceTitle = profile?.service?.title

    return (
        <>
            <div className="rounded-2xl border border-borderDark p-6">
                {/* Logo */}
                <div className="mb-4 flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FB2C36] m-auto">
                    {profile?.profile_pic ? (
                        <ImageComponent url={profile.profile_pic} img_title="profile_pic" object_cover={true} />
                    ) : (
                        <ShieldSecurityIconSVG className="size-full" />
                    )}
                </div>

                {/* Company Name + Verified */}
                <div className="mb-2 text-center">
                    <h1 className="text-xl font-bold text-fontBlack">
                        {businessName}  <span><VerifiedGreenShieldIconSVG /></span>
                    </h1>
                </div>

                {/* Location */}
                <div className="mb-3 gap-1.5 text-fontBlack text-center">
                    <p className="text-sm">
                        <span><LocationSVG /></span> {displayAddress}
                    </p>
                </div>

                {/* Rating */}
                <div className="mb-4 flex items-center justify-center gap-1.5">
                    <StarRatingIconSVG />
                    {averageRating ? <span className="text-sm font-bold text-fontBlack">{averageRating}</span> : null}
                    {totalReviews ? <span className="text-sm text-darkSilver">({totalReviews} notes)</span> : null}
                </div>

                {/* Services */}
                <div className="mb-4 w-full border-t border-borderDark pt-4 text-left">
                    <h2 className="mb-2 text-sm font-bold text-fontBlack">Services</h2>
                    <div className="flex flex-wrap gap-2">
                        {serviceTitle ? (
                            <Button className='btn_radius btn_bg_white'>
                                {serviceTitle}
                            </Button>
                        ) : (
                            <Button className='btn_radius btn_bg_white'>
                                Services de sécurité
                            </Button>
                        )}
                    </div>
                </div>

                {/* Report */}
                <div className='border-t border-borderDark'>
                    <button
                        type="button"
                        onClick={() =>
                            dispatch(
                                openModal({
                                    componentName: 'ReportProfileModal',
                                    modalSize: 'lg',
                                    modalPadding: 'px-6 py-6',
                                    data: { vendorId: profile?._id },
                                })
                            )
                        }
                        className="mt-6 w-full cursor-pointer flex items-center justify-center gap-2 text-sm text-[#6A7282] hover:text-fontBlack transition-colors"
                    >
                        <FlagIconSVG />
                        <span>Signaler ce profil</span>
                    </button>
                </div>
            </div>
        </>
    )
}
