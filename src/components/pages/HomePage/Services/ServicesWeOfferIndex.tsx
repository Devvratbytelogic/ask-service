"use client"
import { useRef, useState } from "react";
import { useGetServiceCategoriesQuery } from "@/redux/rtkQueries/clientSideGetApis";
import { useDispatch } from "react-redux";
import { openModal } from "@/redux/slices/allModalSlice";
import type { IAllServiceCategoriesDataEntity } from "@/types/services";
import ServiceCard from "./ServiceCard"
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Pagination, Autoplay } from "swiper/modules";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";

const ServicesWeOfferIndex = () => {
    const { data } = useGetServiceCategoriesQuery();
    const grandParentServicesList = data?.data ?? [];
    const dispatch = useDispatch();
    const swiperRef = useRef<SwiperType | null>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

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
            <div className="space_y_header_paragraph">
                <h2 className="header_text text-center font-bold">
                    <span className="text-fontBlack">Nos services</span>
                </h2>
                <p className="text-darkSilver text-base xl:text-lg tracking-[-0.48px] text-center">Choisissez parmi une large gamme de services professionnels, adaptés à vos besoins.</p>
            </div>
            <div className="services-carousel-wrapper relative">
                <button
                    type="button"
                    aria-label="Previous slide"
                    className="absolute top-1/2 -translate-y-1/2 z-50 cursor-pointer -left-2 sm:-left-4 border border-borderDark rounded-full p-1.5 services-carousel-btn--prev"
                    onClick={() => swiperRef.current?.slidePrev()}
                    disabled={isBeginning}
                >
                    <FiChevronLeft className="size-6" />
                </button>
                <button
                    type="button"
                    aria-label="Next slide"
                    className="absolute top-1/2 -translate-y-1/2 z-50 cursor-pointer -right-2 sm:-right-4 border border-borderDark rounded-full p-1.5 services-carousel-btn--next"
                    onClick={() => swiperRef.current?.slideNext()}
                    disabled={isEnd}
                >
                    <FiChevronRight className="size-6" />
                </button>
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    onSlideChange={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    modules={[Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                        el: ".services-pagination",
                        bulletClass: "services-pagination-bullet",
                        bulletActiveClass: "services-pagination-bullet--active",
                    }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1280: { slidesPerView: 3 },
                    }}
                    className="services-swiper py-12! px-1!"
                >
                    {grandParentServicesList && grandParentServicesList.length > 0 && grandParentServicesList.map((curr, index) => (
                        <SwiperSlide key={`service_${index + 1} relative`}>
                            <ServiceCard
                                serviceImage={curr.image}
                                serviceName={curr.title}
                                serviceDescription={curr.description}
                                onPostRequestClick={() => openRequestFlowWithService(curr)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="services-pagination" />
            </div>
        </>
    )
}

export default ServicesWeOfferIndex