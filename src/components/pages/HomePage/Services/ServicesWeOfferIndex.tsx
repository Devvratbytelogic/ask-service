import ServiceCard from "./ServiceCard"

const ServicesWeOfferIndex = () => {
    return (
        <>
            <div className="space_y_header_body container_y_padding">
                <div className="space_y_header_paragraph">
                    <h2 className="header_text text-center font-bold">
                        <span className="text-fontBlack">Services</span>
                        <span className="text-darkSilver mx-2">We Offer</span>
                    </h2>
                    <p className="text-darkSilver text-base xl:text-lg tracking-[-0.48px] text-center">Choose from a wide range of professionally delivered services, tailored to your needs.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {
                        ServicesDataList?.map((curr,index)=>
                        <div className="col-span-1" key={`service_${index+1}`}><ServiceCard {...curr}/></div>
                    )
                    }
                </div>
            </div>
        </>
    )
}

export default ServicesWeOfferIndex

const ServicesDataList = [
    {
        serviceImage:'/images/home/Security.png',
        serviceName:'Security',
        serviceDescription:'Trained and verified security professionals for residential, commercial, and event requirements.'
    },
    {
        serviceImage:'/images/home/Gardening.png',
        serviceName:'Gardening',
        serviceDescription:'From regular garden maintenance to one-time landscaping work by experienced professionals.'
    },
    {
        serviceImage:'/images/home/house_cleaning.png',
        serviceName:'House Cleaning',
        serviceDescription:'Reliable home and office cleaning services, available for one-time or recurring needs.'
    },
]