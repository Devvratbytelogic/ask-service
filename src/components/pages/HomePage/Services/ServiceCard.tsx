import ImageComponent from "@/components/library/ImageComponent"
import { FiArrowRight } from "react-icons/fi"

interface IServiceCardProps{
    serviceImage:string,
    serviceName:string,
    serviceDescription:string
    onPostRequestClick?: () => void
}

const ServiceCard = ({serviceImage,serviceName,serviceDescription, onPostRequestClick}:IServiceCardProps) => {
  return (
    <div className="rounded-2xl p-4 xl:p-6 space-y-6.25 xl:space-y-8 shadow-[0px_0px_0px_1px_#EBEDEF] h-full">
        <div className="flex gap-3.75 items-center">
            <div className="size-12 xl:size-14 rounded-full shrink-0">
                <ImageComponent url={serviceImage} img_title={serviceName}/>
            </div>
            <span className=" text-fontBlack font-medium text-[22px]/[27.6px]">
                {serviceName}
            </span>
        </div>
        <div className=" space-y-3 xl:space-y-4">
            <p className="text-darkSilver text-sm/[22px] xl:text-lg/[24px]">
                {serviceDescription}
            </p>
            <div
                role="button"
                tabIndex={0}
                onClick={onPostRequestClick}
                onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && onPostRequestClick) { e.preventDefault(); onPostRequestClick(); } }}
                className="cursor-pointer text-fontBlack group flex gap-2 items-center"
            >
                <span className="group-hover:opacity-75">
                    Post a request
                </span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                    <FiArrowRight/>
                </span>
            </div>
        </div>
    </div>
  )
}

export default ServiceCard