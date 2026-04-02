"use client"
import { useGetGlobalSettingsQuery } from "@/redux/rtkQueries/clientSideGetApis"
import StepsToWorkCard from "./StepsToWorkCard"

const getYoutubeEmbedUrl = (url: string): string | null => {
    try {
        const parsed = new URL(url)
        let videoId: string | null = null
        if (parsed.hostname.includes("youtu.be")) {
            videoId = parsed.pathname.slice(1)
        } else if (parsed.hostname.includes("youtube.com")) {
            videoId = parsed.searchParams.get("v")
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null
    } catch {
        return null
    }
}

const HowDoesItWorkIndex = () => {
    const { data: globalSettings, isLoading } = useGetGlobalSettingsQuery()
    const youtubeLink = globalSettings?.data?.home_youtube_link
    const embedUrl = youtubeLink ? getYoutubeEmbedUrl(youtubeLink) : null

    return (
        <div className="space_y_header_body container_y_padding pt-0!">
            <h2 className="header_text text-center font-bold">
                <span className="text-fontBlack">Comment ça marche?</span>
            </h2>
            <div className="space-y-7.5">
                <div className="relative w-full rounded-xl overflow-hidden h-[40svh] md:h-[70svh]">
                    {isLoading ? (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
                    ) : embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title="How it works"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full border-0"
                        />
                    ) : null}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {
                        HowDoesItWorkData?.map((curr, index) => (
                            <div
                                key={`working_${index + 1}`}
                                className={`col-span-1 ${index % 2 === 1 ? 'border-x border-dashed border-borderColor' : ''}`}
                            >
                                <StepsToWorkCard {...curr} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default HowDoesItWorkIndex

const HowDoesItWorkData = [
    {
        stepImage:'/images/home/tell_us.png',
        stepHeading:'Indiquez votre besoin',
        stepDescription:'Partagez votre besoin de service, le lieu et la période souhaitée. Plus vous donnez de détails, meilleurs seront les devis.'
    },
    {
        stepImage:'/images/home/get_quotes.png',
        stepHeading:'Recevez des devis',
        stepDescription:'Des professionnels vérifiés étudient votre demande et vous envoient des devis. Vos coordonnées restent confidentielles jusqu\'à ce que vous soyez prêt à continuer.'
    },
    {
        stepImage:'/images/home/choose_prof.png',
        stepHeading:'Choisissez votre professionnel',
        stepDescription:'Comparez les tarifs, les détails des prestations et les profils. Sélectionnez le professionnel qui vous convient et échangez en toute sécurité sur la plateforme.'
    },
]