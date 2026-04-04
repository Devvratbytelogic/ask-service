"use client"
import Image from "next/image"
import { useState } from "react"
import { useGetGlobalSettingsQuery } from "@/redux/rtkQueries/clientSideGetApis"
import StepsToWorkCard from "./StepsToWorkCard"

const getYoutubeVideoId = (url: string): string | null => {
    try {
        const parsed = new URL(url)
        if (parsed.hostname.includes("youtu.be")) {
            const id = parsed.pathname.slice(1)
            return id || null
        }
        if (parsed.hostname.includes("youtube.com")) {
            return parsed.searchParams.get("v")
        }
        return null
    } catch {
        return null
    }
}

const getYoutubeEmbedUrl = (videoId: string, autoplay: boolean) =>
    `https://www.youtube.com/embed/${videoId}?rel=0${autoplay ? "&autoplay=1" : ""}`

const youtubePosterSrc = (videoId: string, quality: "max" | "hq") =>
    `https://i.ytimg.com/vi/${videoId}/${quality === "max" ? "maxresdefault" : "hqdefault"}.jpg`

const HowDoesItWorkIndex = () => {
    const { data: globalSettings, isLoading } = useGetGlobalSettingsQuery()
    const youtubeLink = globalSettings?.data?.home_youtube_link
    const videoId = youtubeLink ? getYoutubeVideoId(youtubeLink) : null
    const [isPlaying, setIsPlaying] = useState(false)
    const [posterQuality, setPosterQuality] = useState<"max" | "hq">("max")

    return (
        <div className="space_y_header_body container_y_padding pt-0!">
            <h2 className="header_text text-center font-bold">
                <span className="text-fontBlack">Comment ça marche?</span>
            </h2>
            <div className="space-y-7.5">
                <div className="relative w-full rounded-xl overflow-hidden h-[50vh] md:h-[80vh] bg-neutral-900">
                    {isLoading ? (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
                    ) : videoId ? (
                        isPlaying ? (
                            <iframe
                                src={getYoutubeEmbedUrl(videoId, true)}
                                title="Comment ça marche"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full border-0"
                            />
                        ) : (
                            <>
                                <Image
                                    src={youtubePosterSrc(videoId, posterQuality)}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                    onError={() => setPosterQuality("hq")}
                                />
                                <div
                                    className="absolute inset-0 bg-black/45"
                                    aria-hidden
                                />
                                <p className="pointer-events-none absolute bottom-5 left-5 z-20 max-w-[min(100%-2.5rem,28rem)] text-left text-base font-medium leading-snug text-white md:bottom-8 md:left-8 md:text-lg">
                                    Trouvez le bon professionnel en quelques étapes simples.
                                </p>
                                <button
                                    type="button"
                                    className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                                    onClick={() => setIsPlaying(true)}
                                    aria-label="Lire la vidéo"
                                >
                                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 backdrop-blur-[2px] transition-transform duration-200 hover:scale-105 md:h-20 md:w-20">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="ml-1 h-8 w-8 text-white md:h-9 md:w-9"
                                            fill="currentColor"
                                            aria-hidden
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </span>
                                </button>
                            </>
                        )
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