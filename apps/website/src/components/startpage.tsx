import { DiscolaireSection } from "./discolaire-section";
import { DiscolaireSection2 } from "./discolaire-section2";
import { DiscolaireSection3 } from "./discolaire-section3";
import { DiscolaireSection4 } from "./discolaire-section4";
import { FeaturesSection } from "./features-section";
import { FeaturesSection2 } from "./features-section2";
import { FeaturesSection3 } from "./features-section3";
import { FeaturesSection4 } from "./features-section4";
import { FeaturesSection5 } from "./features-section5";
import { Hero } from "./hero";
import { ImagesSection } from "./images-section";
import { ImagesSection2 } from "./images-section2";
import { Screens } from "./screens";
import { ScrollSection } from "./scroll-section";
import { SectionFour } from "./section-four";
import { SectionOne } from "./section-one";
import { SectionSeven } from "./section-seven";
import { SectionTwo } from "./section-two";

export function StartPage() {
  return (
    <>
      <Hero />
      <Screens />
      <FeaturesSection />
      <FeaturesSection2 />
      <FeaturesSection3 />
      <FeaturesSection4 />
      <FeaturesSection5 />
      <DiscolaireSection />
      <DiscolaireSection4 />
      <div className="grid flex-row gap-4 md:flex">
        <DiscolaireSection2 />
        <ScrollSection />
      </div>
      <DiscolaireSection3 />
      <ImagesSection />
      <ImagesSection2 />
      <SectionOne />
      <SectionTwo />
      <SectionFour />
      {/* <SectionThree /> */}
      <SectionSeven />
      {/* <SectionSix /> */}
      {/* <SectionFive /> */}
      <div className="my-8"></div>
    </>
  );
}
