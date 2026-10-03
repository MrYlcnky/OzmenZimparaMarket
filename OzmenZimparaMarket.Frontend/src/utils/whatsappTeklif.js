function metniTemizle(deger) {
  return String(deger ?? "").trim();
}

function miktariFormatla(miktar) {
  const sayi = Number(miktar);

  if (!Number.isFinite(sayi)) {
    return "1";
  }

  return new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 2,
  }).format(sayi);
}

function secimDegerleriniGetir(secim) {
  if (!secim || typeof secim !== "object") {
    return [];
  }

  if (Array.isArray(secim.degerler)) {
    return secim.degerler
      .map((deger) => {
        if (typeof deger === "string") {
          return metniTemizle(deger);
        }

        return metniTemizle(deger?.detayDegeri ?? deger?.deger ?? deger?.adi);
      })
      .filter(Boolean);
  }

  const tekDeger = metniTemizle(
    secim.detayDegeri ?? secim.deger ?? secim.seciliDeger,
  );

  return tekDeger ? [tekDeger] : [];
}

function secimleriMesajaEkle(secimler) {
  if (!Array.isArray(secimler) || secimler.length === 0) {
    return [];
  }

  return secimler
    .map((secim) => {
      const baslik = metniTemizle(
        secim?.detayAdi ?? secim?.baslik ?? secim?.adi,
      );

      const degerler = secimDegerleriniGetir(secim);

      if (!baslik || degerler.length === 0) {
        return null;
      }

      return `- ${baslik}: ${degerler.join(", ")}`;
    })
    .filter(Boolean);
}

export function teklifMesajiOlustur(sepetUrunleri = []) {
  if (!Array.isArray(sepetUrunleri) || sepetUrunleri.length === 0) {
    return "";
  }

  const satirlar = [
    "Merhaba,",
    "Aşağıdaki ürünler için teklif almak istiyorum:",
    "",
  ];

  sepetUrunleri.forEach((urun, index) => {
    const urunAdi = metniTemizle(urun?.urunAdi) || "Ürün";

    const urunKodu = metniTemizle(urun?.urunKodu);

    const kategoriAdi = metniTemizle(urun?.kategoriAdi);

    const satisBirimiAdi = metniTemizle(urun?.satisBirimiAdi);

    const miktar = miktariFormatla(urun?.miktar);

    satirlar.push(`${index + 1}. Ürün -> ${urunAdi}`);

    if (kategoriAdi) {
      satirlar.push(`Kategori / Alt Kategori: ${kategoriAdi}`);
    }

    if (urunKodu) {
      satirlar.push(`Ürün Kodu: ${urunKodu}`);
    }

    satirlar.push(
      satisBirimiAdi
        ? `Miktar: ${miktar} ${satisBirimiAdi}`
        : `Miktar: ${miktar}`,
    );

    const secimSatirlari = secimleriMesajaEkle(urun?.secimler);

    if (secimSatirlari.length > 0) {
      satirlar.push("Teknik Seçimler:");

      satirlar.push(...secimSatirlari);
    }

    satirlar.push("");
  });

  satirlar.push(
    "Ürünler için fiyat, stok ve tedarik bilgisi paylaşabilir misiniz?",
  );

  return satirlar.join("\n");
}

export function whatsappTeklifBaglantisiOlustur(
  whatsappBaglantisi,
  sepetUrunleri = [],
) {
  if (!whatsappBaglantisi) {
    return null;
  }

  const mesaj = teklifMesajiOlustur(sepetUrunleri);

  if (!mesaj) {
    return whatsappBaglantisi;
  }

  const ayirici = whatsappBaglantisi.includes("?") ? "&" : "?";

  return `${whatsappBaglantisi}${ayirici}text=${encodeURIComponent(mesaj)}`;
}
