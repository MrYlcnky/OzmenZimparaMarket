import FinalCtaSection from "../../components/public/ana-sayfa/FinalCtaSection";
import FirmaTanitimSection from "../../components/public/ana-sayfa/FirmaTanitimSection";
import HeroSection from "../../components/public/ana-sayfa/HeroSection";
import KategorilerSection from "../../components/public/ana-sayfa/KategorilerSection";
import NedenBizSection from "../../components/public/ana-sayfa/NedenBizSection";
import OneCikanUrunlerSection from "../../components/public/ana-sayfa/OneCikanUrunlerSection";
import YuzeyIslemeSection from "../../components/public/ana-sayfa/YuzeyIslemeSection";

function AnaSayfa() {
  return (
    <>
      <HeroSection />
      <KategorilerSection />
      <OneCikanUrunlerSection />
      <YuzeyIslemeSection />
      <FirmaTanitimSection />
      <NedenBizSection />
      <FinalCtaSection />
    </>
  );
}

export default AnaSayfa;
