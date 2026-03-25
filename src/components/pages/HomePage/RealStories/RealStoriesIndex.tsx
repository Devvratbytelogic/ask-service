'use client'
import TestimonialCard from "./TestimonialCard"
import { useGetTestimonialsQuery } from "@/redux/rtkQueries/clientSideGetApis"

const TestimonialCardSkeleton = () => (
    <div className="bg-white rounded-4xl p-6 xl:p-8 flex flex-col h-fit gap-6 xl:gap-8 testimonial-card-shadow animate-pulse">
        <div>
            <div className="w-8 h-6 bg-gray-200 rounded" />
            <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-4/5" />
            </div>
        </div>
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
            </div>
            <div className="flex gap-0.5 shrink-0">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-4 h-4 rounded bg-gray-200" />
                ))}
            </div>
        </div>
    </div>
)

const RealStoriesIndex = () => {
    const { data: testimonialsResponse, isLoading } = useGetTestimonialsQuery()

    const displayData =
        testimonialsResponse?.data?.length
            ? testimonialsResponse.data.map((t) => ({
                  quote: t.message,
                  authorName: t.name,
                  authorRole: t.designation,
                  rating: t.rating,
              }))
            : []

    return (
        <div className="space_y_header_body container_y_padding bg-[#F9FAFB] rounded-[52px]">
            <div className="space_y_header_paragraph">
                <h2 className="header_text text-center font-bold w-11/12 md:w-1/3 mx-auto">
                    <span className="text-fontBlack">Des témoignages réels.</span>
                    <span className="text-darkSilver mx-2">Des résultats concrets.</span>
                </h2>
                <p className="text-darkSilver text-base xl:text-lg tracking-[-0.48px] text-center w-11/12 md:w-2/3 mx-auto">Des clients et des professionnels vérifiés expliquent comment la plateforme les aide à mieux travailler ensemble.</p>
            </div>
            <div className="relative w-11/12 mx-auto overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 pb-10 md:pb-20 w-full">
                    {isLoading ? (
                        [0, 1, 2].map((colIndex) => (
                            <div key={`skeleton_col_${colIndex}`} className="flex-1 min-w-0 flex flex-col gap-4">
                                {[0, 1, 2].map((rowIndex) => (
                                    <TestimonialCardSkeleton key={`skeleton_${colIndex}_${rowIndex}`} />
                                ))}
                            </div>
                        ))
                    ) : (
                        [0, 1, 2].map((colIndex) => {
                            const itemsPerCol = Math.ceil((displayData?.length ?? 0) / 3)
                            const start = colIndex * itemsPerCol
                            const end = Math.min(start + itemsPerCol, displayData?.length ?? 0)
                            const colData = displayData?.slice(start, end) ?? []
                            return (
                                <div key={`col_${colIndex}`} className="flex-1 min-w-0 flex flex-col gap-4">
                                    {colData.map((curr, index) => (
                                        <TestimonialCard key={`testimonial_${start + index + 1}`} {...curr} />
                                    ))}
                                </div>
                            )
                        })
                    )}
                </div>
                {/* Bottom gradient overlay */}
                {/* <div
                    className="absolute bottom-0 left-0 right-0 h-200 pointer-events-none"
                    style={{
                        background: "linear-gradient(to top, #F9FAFB 0%, transparent 100%)",
                    }}
                /> */}
            </div>
        </div>
    )
}

export default RealStoriesIndex