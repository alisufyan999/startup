import GrowthSlider from "./components/GrowthSlider/GrowthSlider";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import FAQ from "./components/FAQ/FAQ";
import Contact from "./components/Contact/Contact";
import Reviews from "./components/Reviews/Reviews";
import Technologies from "./components/Technologies/Technologies";
import { HERO_BANNER, FAQ_DATA, FAQ_SECTION, CALENDLY_SECTION, GROWTH_GUIDES } from "./constants";
import ProfessionalOnline from "./components/ProfessionalOnline/ProfessionalOnline";
import CTABanner from "./components/CTABanner/CTABanner";
import CalendlySection from "./components/CalendlySection/CalendlySection";
import AiTeamSection from "./components/AiTeamSection/AiTeamSection";
import CaseStudySection from "./components/CaseStudySection";

export default function Home() {
  return (
    <main className="relative">
      <HeroBanner {...HERO_BANNER} />
      <ProfessionalOnline/>
      <CTABanner/>
      <Technologies />
      {/* <AiTeamSection /> */}
      <CaseStudySection />
      <CalendlySection {...CALENDLY_SECTION}/>
      <Reviews />
      <GrowthSlider items={GROWTH_GUIDES} />
      <FAQ faqs={FAQ_DATA} sectionData={FAQ_SECTION} />
      <Contact />
    </main>
  );
}
