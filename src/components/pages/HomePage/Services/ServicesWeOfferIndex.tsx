"use client"
import { useGetServiceCategoriesQuery } from "@/redux/rtkQueries/clientSideGetApis";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/slices/allModalSlice";
import type { IAllServiceCategoriesDataEntity } from "@/types/services";
import ServiceCard from "./ServiceCard"

const ServicesWeOfferIndex = () => {
    const { data } = useGetServiceCategoriesQuery();
    const grandParentServicesList = data?.data ?? [];
    const dispatch = useDispatch();

    const openRequestFlowWithService = (service: IAllServiceCategoriesDataEntity) => {
        dispatch(openModal({
            componentName: "RequestServiceFlowIndex",
            data: {
                grandParentServiceId: service._id ?? "",
                grandParentServiceName: service.title ?? "",
                child_services: service.child_categories ?? [],
            },
            modalSize: "lg",
        }));
    };

    return (
        <>
            <div className="space_y_header_body container_y_padding">
                <div className="space_y_header_paragraph">
                    <h2 className="header_text text-center font-bold">
                        <span className="text-fontBlack">Nos services</span>
                    </h2>
                    <p className="text-darkSilver text-base xl:text-lg tracking-[-0.48px] text-center">Choisissez parmi une large gamme de services professionnels, adaptés à vos besoins.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {
                        grandParentServicesList && grandParentServicesList?.length > 0 && grandParentServicesList?.map((curr, index) =>
                            <div className="col-span-1" key={`service_${index + 1}`}>
                                <ServiceCard
                                    serviceImage={curr.image}
                                    serviceName={curr.title}
                                    serviceDescription={curr.description}
                                    onPostRequestClick={() => openRequestFlowWithService(curr)}
                                />
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default ServicesWeOfferIndex