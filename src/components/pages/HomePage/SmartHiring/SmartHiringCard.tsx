import ImageComponent from "@/components/library/ImageComponent"

interface ISmartHiringCardProps {
    image_url: string,
    heading: string,
    description: string,
}

const SmartHiringCard = ({ image_url, heading, description }: ISmartHiringCardProps) => {
    return (
        <div className="p-4 lg:p-11 flex gap-8">
            <div className="w-7 h-7 shrink-0">
                <ImageComponent url={image_url} img_title={heading} />
            </div>
            <div className="space-y-2">
                <h2 className="text-fontBlack font-bold text-[18.8px]/[28px] xl:text-xl leading-[-0.6px]">
                    {heading}
                </h2>
                <h3 className="text-darkSilver text-sm/[20px] xl:text-lg leading-[-0.42px] w-11/12">
                    {description}
                </h3>
            </div>
        </div>
    )
}

export default SmartHiringCard