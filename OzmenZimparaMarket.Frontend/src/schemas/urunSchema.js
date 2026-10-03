import { z } from "zod";

const pozitifIdSchema = (mesaj) =>
  z.preprocess(
    (deger) => {
      if (deger === "" || deger === null || deger === undefined) {
        return 0;
      }

      return Number(deger);
    },
    z.number({ message: mesaj }).int(mesaj).gt(0, mesaj),
  );

const siraNoSchema = z.preprocess(
  (deger) => {
    if (deger === "" || deger === null || deger === undefined) {
      return 0;
    }

    return Number(deger);
  },
  z
    .number({
      message: "Sıra numarası geçerli bir sayı olmalıdır.",
    })
    .int("Sıra numarası tam sayı olmalıdır.")
    .min(0, "Sıra numarası negatif olamaz."),
);

const satisBirimiSchema = z.preprocess(
  (deger) => {
    if (deger === "" || deger === null || deger === undefined) {
      return 0;
    }

    return Number(deger);
  },
  z
    .number({
      message: "Geçerli bir satış birimi seçilmelidir.",
    })
    .int("Geçerli bir satış birimi seçilmelidir.")
    .refine(
      (deger) => [1, 2, 3, 4, 5].includes(deger),
      "Geçerli bir satış birimi seçilmelidir.",
    ),
);

const nullableMetinSchema = (maksimumUzunluk, mesaj) =>
  z
    .string()
    .max(maksimumUzunluk, mesaj)
    .nullable()
    .optional()
    .or(z.literal(""));

export const urunTeknikDetayKaydetSchema = z.object({
  urunDetayiId: z.preprocess(
    (deger) => {
      if (deger === "" || deger === null || deger === undefined) {
        return null;
      }

      return Number(deger);
    },
    z
      .number({
        message: "Ürün detayı ID değeri geçersizdir.",
      })
      .int("Ürün detayı ID değeri geçersizdir.")
      .gt(0, "Ürün detayı ID değeri sıfırdan büyük olmalıdır.")
      .nullable(),
  ),

  urunDetayTanimiId: pozitifIdSchema("Ürün özelliği seçimi zorunludur."),

  detayDegeri: z
    .string()
    .trim()
    .min(1, "Özellik değeri zorunludur.")
    .max(500, "Özellik değeri en fazla 500 karakter olabilir."),

  siraNo: siraNoSchema,

  aktifMi: z.boolean(),
});

export const urunSchema = z.object({
  kategoriId: pozitifIdSchema("Kategori seçimi zorunludur."),

  urunAdi: z
    .string()
    .trim()
    .min(1, "Ürün adı zorunludur.")
    .max(200, "Ürün adı en fazla 200 karakter olabilir."),

  urunKodu: nullableMetinSchema(
    100,
    "Ürün kodu en fazla 100 karakter olabilir.",
  ),

  kisaAciklama: nullableMetinSchema(
    1000,
    "Kısa açıklama en fazla 1000 karakter olabilir.",
  ),

  detayliAciklama: nullableMetinSchema(
    10000,
    "Detaylı açıklama en fazla 10000 karakter olabilir.",
  ),

  gorselYolu: nullableMetinSchema(
    500,
    "Görsel yolu en fazla 500 karakter olabilir.",
  ),

  satisBirimi: satisBirimiSchema,

  seoUrl: nullableMetinSchema(250, "SEO URL en fazla 250 karakter olabilir."),

  seoBasligi: nullableMetinSchema(
    250,
    "SEO başlığı en fazla 250 karakter olabilir.",
  ),

  seoAciklamasi: nullableMetinSchema(
    500,
    "SEO açıklaması en fazla 500 karakter olabilir.",
  ),

  oneCikanMi: z.boolean(),

  siraNo: siraNoSchema,

  aktifMi: z.boolean(),

  teknikDetaylar: z.array(urunTeknikDetayKaydetSchema).default([]),
});
