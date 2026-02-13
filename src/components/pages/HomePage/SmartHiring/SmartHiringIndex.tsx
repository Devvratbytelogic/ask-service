import SmartHiringCard from "./SmartHiringCard"

const SmartHiringIndex = () => {
    return (
        <div className="space_y_header_body container_y_padding">
            <div className="space_y_header_paragraph">
                <h2 className="header_text text-center font-bold w-11/12 md:w-1/2 2xl:w-1/3 mx-auto">
                    <span className="text-fontBlack">A smarter way to hire</span>
                    <span className="text-darkSilver mx-2">trusted professionals</span>
                </h2>
                <p className="text-darkSilver text-base xl:text-lg tracking-[-0.48px] text-center">No endless calls, no guesswork. Just clear requests and verified professionals competing for your job.</p>
            </div>
            <div className="relative px-0 xl:px-[120px]">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {
                        SmartHiringData?.map((curr, index) => (
                            <div
                                key={`hiring_${index + 1}`}
                                className={`col-span-1 relative z-10
                                    ${index % 2 === 0 ? 'md:border-r md:border-dashed md:border-borderColor' : ''}
                                    ${index < 4 ? 'border-b border-dashed border-borderColor' : ''}
                                `}
                            >
                                <SmartHiringCard {...curr} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default SmartHiringIndex

const SmartHiringData = [
    {
        image_url: '/images/home/saveTime.png',
        heading: 'Save Time on Every Request',
        description: 'Tell us what you need once and receive multiple quotes from relevant professionals. No need to contact providers individually or repeat yourself.',
    },
    {
        image_url: '/images/home/verified.png',
        heading: 'Verified Professionals Only',
        description: 'Every professional is reviewed and verified before joining. Documents, credentials, and compliance checks ensure higher quality and reliability.',
    },
    {
        image_url: '/images/home/noSpam.png',
        heading: 'No Spam, No Pressure',
        description: 'Your contact details stay private. Professionals can only reach out after unlocking your request, keeping communication relevant and controlled.',
    },
    {
        image_url: '/images/home/compareQuote.png',
        heading: 'Compare Quotes with Confidence',
        description: 'Receive structured quotes with pricing and service details. Compare responses easily and choose the professional that fits your needs best.',
    },
    {
        image_url: '/images/home/work.png',
        heading: 'Works for Homes and Businesses',
        description: 'Whether you need a one-time service or ongoing business support, the platform supports both individual and commercial service requests.',
    },
    {
        image_url: '/images/home/Built.png',
        heading: 'Built for Quality, Not Noise',
        description: 'Professionals invest to access leads, which means fewer low-quality responses and more serious service providers competing for your work.',
    },
]