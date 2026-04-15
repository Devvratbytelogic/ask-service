'use client'

import { Button, Avatar } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { openModal } from '@/redux/slices/allModalSlice'
import { StarRatingIconSVG, StarOutlineIconSVG, ThumbUpIconSVG, RequestNumberSVG } from '@/components/library/AllSVG'
import type { IAllVendorReviewsReviewsEntity, RatingDistribution } from '@/types/review'
import { IVendorDetailsAPIResponseDataReview } from '@/types/vendorDetails'

function formatReviewDate(createdAt: string) {
    try {
        return new Date(createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
        return createdAt
    }
}

function mapDistribution(dist: RatingDistribution): { stars: number; count: number }[] {
    return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: dist[stars as keyof RatingDistribution] ?? 0 }))
}

function mapReviewToDisplay(entity: IAllVendorReviewsReviewsEntity | null) {
    return {
        id: entity?._id,
        name: entity?.user?.first_name + ' ' + entity?.user?.last_name,
        requestId: entity?.service_request_id ?? entity?._id,
        rating: entity?.rating ?? 0,
        date: formatReviewDate(entity?.createdAt ?? ''),
        text: entity?.review ?? '',
        helpfulCount: entity?.likes_count ?? 0,
    }
}

function ReviewStars({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating)
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: fullStars }).map((_, i) => (
                <StarRatingIconSVG key={i} />
            ))}
            {Array.from({ length: 5 - fullStars }).map((_, i) => (
                <StarOutlineIconSVG key={i} />
            ))}
        </div>
    )
}

interface VendorReviewsProps {
    /** When true (e.g. vendor viewing own account), hide "Leave a review" button */
    hideLeaveReviewButton?: boolean
    review?: IVendorDetailsAPIResponseDataReview | null
    /** Vendor Mongo id for submit-review API */
    vendorId?: string
}

export default function VendorReviews({ hideLeaveReviewButton = false, review, vendorId }: VendorReviewsProps) {
    const dispatch = useDispatch()
    const averageRating = review?.averageRating ?? 0
    const totalReviews = review?.totalReviews ?? 0
    const distribution = review?.ratingDistribution
        ? mapDistribution(review.ratingDistribution)
        : [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0 }))
    const reviews = review?.reviews?.map(mapReviewToDisplay) ?? []

    const fullStars = Math.floor(averageRating)

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-fontBlack">Mes Avis</h2>
                {!hideLeaveReviewButton && (
                    <div className="flex items-center gap-2">
                        <Button
                            className="btn_radius btn_bg_blue"
                            onPress={() =>
                                dispatch(
                                    openModal({
                                        componentName: 'LeaveReviewModal',
                                        modalSize: 'xl',
                                        modalPadding: 'px-6 py-6',
                                        data: vendorId ? { vendorId } : undefined,
                                    })
                                )
                            }
                        >
                            Leave a review
                        </Button>
                    </div>
                )}
            </div>


            {/* Review summary card */}
            <div className="grid grid-cols-3 rounded-2xl border border-borderDark bg-[#F9FAFB] overflow-hidden">
                <div className="col-span-full sm:col-span-1 flex flex-col items-center justify-center gap-2 p-6 sm:my-8 sm:min-w-50 border-b sm:border-b-0 sm:border-r border-borderDark">
                    <span className="text-4xl font-bold text-fontBlack">{averageRating}</span>
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: fullStars }).map((_, i) => (
                            <StarRatingIconSVG key={i} />
                        ))}
                        {Array.from({ length: 5 - fullStars }).map((_, i) => (
                            <StarOutlineIconSVG key={i} />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-fontBlack">
                        {totalReviews} avis
                    </span>
                </div>
                <div className="col-span-full sm:col-span-2 p-6 sm:p-8">
                    <div className="space-y-3">
                        {distribution.map(({ stars, count }) => {
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                            return (
                                <div key={stars} className="flex items-center gap-3">
                                    <span className="min-w-16 whitespace-nowrap shrink-0 text-sm text-fontBlack">
                                        {stars} étoiles
                                    </span>
                                    <div className="flex-1 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-[#FFB900] transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="w-6 shrink-0 text-sm font-medium text-fontBlack text-right">
                                        {count}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Review cards list */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <article
                        key={review.id}
                        className="rounded-xl border border-[#E5E7EB] bg-white p-5 "
                    >
                        <div className="flex items-start gap-3">
                            <Avatar
                                name={review.name}
                                size="sm"
                                className="h-10 w-10 shrink-0 bg-[#E0F2FE] text-sm font-semibold text-[#0369A1]"
                                showFallback
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-bold text-fontBlack">{review.name}</span>
                                    <span className="flex items-center gap-1 text-sm font-medium text-fontBlack">
                                        <RequestNumberSVG />
                                        {review.requestId}
                                    </span>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-darkSilver">
                                    <ReviewStars rating={review.rating} />
                                    <span className="text-darkSilver">•</span>
                                    <span>{review.date}</span>
                                </div>
                            </div>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-fontBlack/90">
                            {review.text}
                        </p>
                        {!hideLeaveReviewButton && (<Button className="btn_radius btn_bg_white mt-3">
                            <ThumbUpIconSVG />
                            <span>Helpful ({review.helpfulCount})</span>
                        </Button>)}
                    </article>
                ))}
            </div>

            {reviews.length > 0 && (
                <div className="flex justify-center pt-2">
                    <Button className="btn_radius btn_bg_white min-w-32">
                        View More
                    </Button>
                </div>
            )}

        </div>
    )
}
