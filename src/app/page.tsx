import Preloader from "@/components/Preloader";
import Hero3D from "@/components/Hero3D";
import Services from "@/components/home/Services";
import InteractiveAssembly from "../../components/sections/InteractiveAssembly";
import Stats from "@/components/home/Stats";
import TeamSection from "@/components/TeamSection";
import DentalAnatomy from "../../components/sections/DentalAnatomy";
import PixelAssembleText from "../../components/sections/PixelAssembleText";
import HeroReveal from "../../components/sections/HeroReveal";
import CaseStudiesBento from "../../components/sections/CaseStudiesBento";
import Testimonials from "../../components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Preloader />
      <Hero3D />
      <Services />
      <InteractiveAssembly />
      <Stats />
      <TeamSection />
      <DentalAnatomy />
      <PixelAssembleText text="PRECISION DENTAL" />
      <HeroReveal />
      <CaseStudiesBento />
      <Testimonials />
    </>
  );
}
