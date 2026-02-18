import { Button, Avatar } from '@heroui/react'
import { useDispatch } from 'react-redux'
import { openModal } from '@/redux/slices/allModalSlice'
import { StarRatingIconSVG, StarOutlineIconSVG, ThumbUpIconSVG, RequestNumberSVG } from '@/components/library/AllSVG'

const AVERAGE_RATING = 4.9
const TOTAL_REVIEWS = 5
const DISTRIBUTION = [
    { stars: 5, count: 4 },
    { stars: 4, count: 1 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
]

const REVIEWS = [
    {
        name: 'Sarah Johnson',
        requestId: 'REQ-A7X9K2',
        rating: 4.5,
        date: '12 Jan 2026',
        text: 'Excellent service from start to finish. The team was professional, arrived on time, and handled everything with great care. Would definitely recommend to others looking for reliable security solutions.',
        helpfulCount: 12,
    },
    {
        name: 'Michael Chen',
        requestId: 'REQ-B2K4M8',
        rating: 5,
        date: '08 Jan 2026',
        text: 'Outstanding experience. Communication was clear throughout, and the level of professionalism exceeded our expectations. Will be using their services again for future events.',
        helpfulCount: 8,
    },
    {
        name: 'Emma Thomas',
        requestId: 'REQ-C9P1L3',
        rating: 3.5,
        date: '03 Jan 2026',
        text: 'Good overall service. There were a few minor delays on the day, but the staff were courteous and the outcome was satisfactory. Would consider using again.',
        helpfulCount: 3,
    },
]

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

export default function VendorReviews() {
    const dispatch = useDispatch()
    const fullStars = Math.floor(AVERAGE_RATING)

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-fontBlack">Reviews</h2>
                <div className="flex items-center gap-2">
                    <Button
                        className="btn_radius btn_bg_blue"
                        onPress={() =>
                            dispatch(
                                openModal({
                                    componentName: 'LeaveReviewModal',
                                    modalSize: 'xl',
                                    modalPadding: 'px-6 py-6',
                                })
                            )
                        }
                    >
                        Leave a review
                    </Button>
                </div>
            </div>

            {/* Review summary card */}
            <div className="flex flex-col sm:flex-row rounded-2xl border border-borderDark bg-[#F9FAFB] overflow-hidden">
                <div className="flex flex-col items-center justify-center gap-2 p-6 sm:my-8 sm:min-w-50 border-b sm:border-b-0 sm:border-r border-borderDark">
                    <span className="text-4xl font-bold text-fontBlack">{AVERAGE_RATING}</span>
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: fullStars }).map((_, i) => (
                            <StarRatingIconSVG key={i} />
                        ))}
                        {Array.from({ length: 5 - fullStars }).map((_, i) => (
                            <StarOutlineIconSVG key={i} />
                        ))}
                    </div>
                    <span className="text-sm font-medium text-fontBlack">
                        {TOTAL_REVIEWS} reviews
                    </span>
                </div>
                <div className="flex-1 p-6 sm:p-8">
                    <div className="space-y-3">
                        {DISTRIBUTION.map(({ stars, count }) => {
                            const percentage = TOTAL_REVIEWS > 0 ? (count / TOTAL_REVIEWS) * 100 : 0
                            return (
                                <div key={stars} className="flex items-center gap-3">
                                    <span className="w-12 shrink-0 text-sm text-fontBlack">
                                        {stars} star
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
                {REVIEWS.map((review) => (
                    <article
                        key={review.requestId}
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
                        <Button
                           className='btn_radius btn_bg_white mt-3'
                           >
                            <ThumbUpIconSVG />
                            <span>Helpful ({review.helpfulCount})</span>
                        </Button>
                    </article>
                ))}
            </div>

            <div className="flex justify-center pt-2">
                <Button className='btn_radius btn_bg_white min-w-32'>
                    View More
                </Button>
            </div>
        </div>
    )
}
