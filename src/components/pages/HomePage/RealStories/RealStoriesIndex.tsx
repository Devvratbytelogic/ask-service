import TestimonialCard from "./TestimonialCard"

const RealStoriesIndex = () => {
    return (
        <div className="space_y_header_body container_y_padding bg-[#F9FAFB] rounded-[52px]">
            <div className="space_y_header_paragraph">
                <h2 className="header_text text-center font-bold w-11/12 md:w-1/3 mx-auto">
                    <span className="text-fontBlack">Real stories.</span>
                    <span className="text-darkSilver mx-2">Real results.</span>
                </h2>
                <p className="text-darkSilver text-base xl:text-lg tracking-[-0.48px] text-center w-11/12 md:w-2/3 mx-auto">Customers and verified professionals share how the platform helps them work better together.</p>
            </div>
            <div className="relative w-11/12 mx-auto overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 pb-10 md:pb-20 w-full">
                    {[0, 1, 2].map((colIndex) => {
                        const itemsPerCol = Math.ceil((RealStoriesData?.length ?? 0) / 3)
                        const start = colIndex * itemsPerCol
                        const end = Math.min(start + itemsPerCol, RealStoriesData?.length ?? 0)
                        const colData = RealStoriesData?.slice(start, end) ?? []
                        return (
                            <div key={`col_${colIndex}`} className="flex-1 min-w-0 flex flex-col gap-4">
                                {colData.map((curr, index) => (
                                    <TestimonialCard key={`testimonial_${start + index + 1}`} {...curr} />
                                ))}
                            </div>
                        )
                    })}
                </div>
                {/* Bottom gradient overlay */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-200 pointer-events-none"
                    style={{
                        background: "linear-gradient(to top, #F9FAFB 0%, transparent 100%)",
                    }}
                />
            </div>
        </div>
    )
}

export default RealStoriesIndex

const RealStoriesData = [
    {
        quote: "Saved me so much time on a home renovation project. Found three verified plumbers within hours, compared quotes easily, and the best one was at my door the next day. Highly recommend. I've used several service platforms. This one stands out for quality and ease of use. The verification process gives me confidence",
        authorName: "David Keith",
        authorRole: "Homeowner",
    },
    
    {
        quote: "Envision completely changed how fast we onboard vendors. The platform is intuitive and the quality of professionals is outstanding. Our team saves hours every week.",
        authorName: "Michelle Park",
        authorRole: "Operations Director",
    },
    {
        quote: "I used to waste so much time calling multiple contractors. Now I post once and compare. Game changer for my renovation business.",
        authorName: "Brian Moore",
        authorRole: "Property Manager",
    },
    {
        quote: "Ask Service has been a lifesaver for our property management company. Before, our vendor list was a mess.",
        authorName: "Sarah Chen",
        authorRole: "Electrician",
    },
    {
        quote: "Saved me days on a client project. Got verified quotes and hired within 48 hours.",
        authorName: "Alex Rivera",
        authorRole: "Product Designer",
    },
    {
        quote: "This platform is a must-have for anyone managing home or business services. Clean, professional, and it just works.",
        authorName: "James Rodriguez",
        authorRole: "Office Manager",
    },
    {
        quote: "I wasn't sure if I really needed it. Within a week I had two jobs booked. Worth every penny and This platform is a must-have for anyone managing home or business services. Clean, professional, and it just works, I've used several service platforms. This one stands out for quality and ease of use. The verification process gives me confidence",
        authorName: "Emma Wilson",
        authorRole: "Small Business Owner",
    },
    {
        quote: "I've used several service platforms. This one stands out for quality and ease of use. The verification process gives me confidence.",
        authorName: "Thomas Kim",
        authorRole: "Freelance Consultant",
    },
    {
        quote: "Ask Service became my go-to for finding professionals. Fast, reliable, and the quotes are always structured clearly.",
        authorName: "Priya Patel",
        authorRole: "UI/UX Designer",
    }
]