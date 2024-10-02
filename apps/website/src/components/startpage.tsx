import { Hero } from "./hero";
import { Screens } from "./screens";
import { SectionFour } from "./section-four";
import { SectionOne } from "./section-one";
import { SectionSeven } from "./section-seven";
import { SectionTwo } from "./section-two";

export function StartPage() {
  return (
    <>
      <Hero />
      <Screens />
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
