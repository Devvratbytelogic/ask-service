import ImageComponent from "@/components/library/ImageComponent"

interface IStepsToWorkCard {
    stepImage:string,
    stepHeading:string,
    stepDescription:string
}

const StepsToWorkCard = ({stepImage,stepHeading,stepDescription}:IStepsToWorkCard) => {
  return (
    <div className="p-11 space-y-10">
        <div className="h-7 w-7 shrink-0">
            <ImageComponent url={stepImage} img_title={stepHeading}/>
        </div>
        <div className="space-y-2">
            <h2 className="text-fontBlack font-bold text-[18.8px]/[28px] xl:text-xl leading-[-0.6px]">{stepHeading}</h2>
            <h3 className="text-darkSilver text-sm/[20px] xl:text-lg leading-[-0.42px] w-11/12">
                {stepDescription}
            </h3>
        </div>
    </div>
  )
}

export default StepsToWorkCard