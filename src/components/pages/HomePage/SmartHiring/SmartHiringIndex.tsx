import SmartHiringCard from "./SmartHiringCard"

const SmartHiringIndex = () => {
    return (
        <div className="space_y_header_body container_y_padding">
            <div className="space_y_header_paragraph">
                <h2 className="header_text text-center font-bold w-11/12 md:w-1/2 2xl:w-1/3 mx-auto">
                    <span className="text-fontBlack">Une façon plus simple d'embaucher</span>
                    <span className="text-darkSilver mx-2">des professionnels de confiance</span>
                </h2>
                <p className="text-darkSilver text-base xl:text-lg tracking-[-0.48px] text-center">Pas d'appels interminables, pas de suppositions. Des demandes claires et des professionnels vérifiés pour votre projet.</p>
            </div>
            <div className="relative px-0 xl:px-30">
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
        heading: 'Gagnez du temps sur chaque demande',
        description: 'Dites-nous ce dont vous avez besoin une seule fois et recevez plusieurs devis de professionnels qualifiés. Inutile de contacter chaque prestataire individuellement.',
    },
    {
        image_url: '/images/home/verified.png',
        heading: 'Uniquement des professionnels vérifiés',
        description: 'Chaque professionnel est examiné et vérifié avant de rejoindre la plateforme. Documents, certifications et contrôles de conformité garantissent qualité et fiabilité.',
    },
    {
        image_url: '/images/home/noSpam.png',
        heading: 'Pas de spam, pas de pression',
        description: 'Vos coordonnées restent privées. Les professionnels ne peuvent vous contacter qu\'après avoir déverrouillé votre demande, assurant des échanges pertinents et maîtrisés.',
    },
    {
        image_url: '/images/home/compareQuote.png',
        heading: 'Comparez les devis en toute confiance',
        description: 'Recevez des devis structurés avec tarifs et détails de prestation. Comparez facilement les réponses et choisissez le professionnel qui correspond le mieux à vos besoins.',
    },
    {
        image_url: '/images/home/work.png',
        heading: 'Pour les particuliers et les entreprises',
        description: 'Que vous ayez besoin d\'un service ponctuel ou d\'un accompagnement professionnel régulier, la plateforme prend en charge les demandes individuelles et commerciales.',
    },
    {
        image_url: '/images/home/Built.png',
        heading: 'Conçu pour la qualité, pas pour le volume',
        description: 'Les professionnels investissent pour accéder aux demandes, ce qui signifie moins de réponses médiocres et plus de prestataires sérieux en compétition pour votre projet.',
    },
]