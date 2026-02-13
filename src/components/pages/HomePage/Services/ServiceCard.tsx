import ImageComponent from "@/components/library/ImageComponent"
import { FiArrowRight } from "react-icons/fi"

interface IServiceCardProps{
    serviceImage:string,
    serviceName:string,
    serviceDescription:string
}

const ServiceCard = ({serviceImage,serviceName,serviceDescription}:IServiceCardProps) => {
  return (
    <div className="rounded-2xl p-4 xl:p-6 space-y-[25px] xl:space-y-[28px] shadow-[0px_0px_0px_1px_#EBEDEF]">
        <div className="flex gap-[15px] items-center">
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
            <div className="cursor-pointer text-fontBlack text-[15px]/[25.6px] xl:text-base/[27.6px] group flex gap-2 items-center px-4">
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