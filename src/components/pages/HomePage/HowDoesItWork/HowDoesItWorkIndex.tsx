import ImageComponent from "@/components/library/ImageComponent"
import { FaPlay } from "react-icons/fa6"
import StepsToWorkCard from "./StepsToWorkCard"

const HowDoesItWorkIndex = () => {
    return (
        <div className="space_y_header_body container_y_padding pt-0!">
            <h2 className="header_text text-center font-bold">
                <span className="text-fontBlack">Comment ça marche?</span>
            </h2>
            <div className="space-y-7.5">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden group cursor-pointer h-[40svh] md:h-[70svh]">
                    {/* Background image */}
                    <div className="absolute inset-0">
                        <ImageComponent
                            url="/images/home/howWork.jpg"
                            img_title="How it works video thumbnail"
                        />
                    </div>
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-linear-to-r from-fontBlack/95 to-fontBlack/35" />
                    {/* Centered play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                            <FaPlay className="text-xl md:text-2xl ml-1" />
                        </span>
                    </div>
                    {/* Bottom-left text */}
                    <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
                        <p className="text-lg md:text-[36px]/[43.2px] leading-tight w-2/3">
                            Trouvez le bon professionnel en quelques étapes simples.
                        </p>
                    </div>
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