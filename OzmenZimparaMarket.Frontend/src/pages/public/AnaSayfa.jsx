import AnaSayfaHero from "../../components/public/ana-sayfa/AnaSayfaHero";
import AnaSayfaKategoriler from "../../components/public/ana-sayfa/AnaSayfaKategoriler";
import AnaSayfaNedenBiz from "../../components/public/ana-sayfa/AnaSayfaNedenBiz";
import AnaSayfaOneCikanUrunler from "../../components/public/ana-sayfa/AnaSayfaOneCikanUrunler";
import AnaSayfaKullanimAlanlari from "../../components/public/ana-sayfa/AnaSayfaKullanimAlanlari";
import AnaSayfaHakkimizda from "../../components/public/ana-sayfa/AnaSayfaHakkimizda";
import AnaSayfaIletisimCTA from "../../components/public/ana-sayfa/AnaSayfaIletisimCTA";

function AnaSayfa() {
  return (
    <>
      <AnaSayfaHero />
      <AnaSayfaKategoriler />
      <AnaSayfaNedenBiz />
      <AnaSayfaOneCikanUrunler />
      <AnaSayfaKullanimAlanlari />
      <AnaSayfaHakkimizda />
      <AnaSayfaIletisimCTA />
    </>
  );
}

export default AnaSayfa;
