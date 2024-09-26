import { Hero } from "./hero";
import { Screens } from "./screens";
import { SectionOne } from "./section-one";
import { SectionTwo } from "./section-two";

export function StartPage() {
  return (
    <>
      <Hero />
      <Screens />
      <SectionOne />
      <SectionTwo />
    </>
  );
}
