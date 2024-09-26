import { Hero } from "./hero";
import { Screens } from "./screens";
import { SectionFour } from "./section-four";
import { SectionOne } from "./section-one";
import { SectionSeven } from "./section-seven";
import { SectionSix } from "./section-six";
import { SectionThree } from "./section-three";
import { SectionTwo } from "./section-two";

export function StartPage() {
  return (
    <>
      <Hero />
      <Screens />
      <SectionOne />
      <SectionTwo />
      <SectionFour />
      <SectionThree />
      <SectionSeven />
      <SectionSix />
      {/* <SectionFive /> */}
    </>
  );
}
