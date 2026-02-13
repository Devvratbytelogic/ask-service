import ImageComponent from "@/components/library/ImageComponent"
import { BsQuote } from "react-icons/bs"
import { FaStar } from "react-icons/fa6"

interface ITestimonialCardProps {
    quote: string
    authorName: string
    authorRole: string
    authorImage?: string
    rating?: number
}


const TestimonialCard = ({ quote, authorName, authorRole, authorImage, rating = 5 }: ITestimonialCardProps) => {
    const initials = authorName.split(' ').map(n => n[0]).join('').slice(0, 2)

    return (
        <div className="bg-white rounded-[32px] p-6 xl:p-8 flex flex-col h-fit gap-6 xl:gap-8 testimonial-card-shadow">
            <div>
                {/* Decorative quote mark */}
                <span className="select-none">
                    <BsQuote className="text-placeHolderText text-2xl"/>
                </span>
                {/* Testimonial text */}
                <p className="text-[#555A68] text-sm xl:text-base flex-1 mt-4 leading-[-0.42px] line-clamp-5">
                    "{quote}"
                </p>
            </div>

            {/* Author info and rating */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {authorImage ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                            <ImageComponent url={authorImage} img_title={authorName} />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-primaryColor/20 flex items-center justify-center text-primaryColor font-semibold text-sm shrink-0">
                            {initials}
                        </div>
                    )}
                    <div>
                        <p className="text-fontBlack font-medium text-sm xl:text-base leading-[-0.42px]">{authorName}</p>
                        <p className="text-[#6D7383] text-xs xl:text-sm font-medium leading-[-0.24px]">{authorRole}</p>
                    </div>
                </div>
                <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: rating }).map((_, i) => (
                        <FaStar key={`star_${i+1}`} className="text-amber-400 text-sm xl:text-base" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TestimonialCard
