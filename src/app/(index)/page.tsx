import CTAsectionsIndex from "@/components/pages/HomePage/CTAsections/CTAsectionsIndex";
import HomeBanner from "@/components/pages/HomePage/HomeBanner";
import HowDoesItWorkIndex from "@/components/pages/HomePage/HowDoesItWork/HowDoesItWorkIndex";
import RealStoriesIndex from "@/components/pages/HomePage/RealStories/RealStoriesIndex";
import ServicesWeOfferIndex from "@/components/pages/HomePage/Services/ServicesWeOfferIndex";
import SmartHiringIndex from "@/components/pages/HomePage/SmartHiring/SmartHiringIndex";

export default function Home() {
  return (
    <>
      <main>
        <HomeBanner/>
        <div className="body_x_axis_padding">
          <ServicesWeOfferIndex/>
          <HowDoesItWorkIndex/>
          <SmartHiringIndex/>
          <RealStoriesIndex/>
          <CTAsectionsIndex/>
        </div>
      </main>
    </>
  );
}
