import AboutPage from "./about";
import FAQsection from "./faqsection";
import { Footer } from "./footer";
import { Hero } from "./hero";

export function StartPage() {
  return (
    <>
      <header />
      <Hero />
      <AboutPage />
      {/* <Screens />  */}
      <FAQsection />
      <Footer />
    </>
  );
}
