import CTA from "~/components/page2/cta";
import Features from "~/components/page2/features";
import Footer from "~/components/page2/footer";
import Hero from "~/components/page2/hero";
import Navbar from "~/components/page2/navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="from-background via-background/90 to-background absolute inset-0 bg-gradient-to-b" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
