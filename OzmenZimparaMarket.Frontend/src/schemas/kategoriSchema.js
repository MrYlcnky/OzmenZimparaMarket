import { z } from "zod";

function bosMetniNullYap(deger) {
  if (typeof deger !== "string") {
    return deger;
  }

  const temizDeger = deger.trim();

  return temizDeger === "" ? null : temizDeger;
}

const ustKategoriIdSchema = z.preprocess(
  (deger) => {
    if (deger === "" || deger === null || deger === undefined) {
      return null;
    }

    return Number(deger);
  },
  z
    .number({
      message: "Üst kategori bilgisi geçersizdir.",
    })
    .int("Üst kategori ID değeri tam sayı olmalıdır.")
    .positive("Üst kategori ID değeri sıfırdan büyük olmalıdır.")
    .nullable(),
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

export const kategoriSchema = z.object({
  ustKategoriId: ustKategoriIdSchema,

  kategoriAdi: z
    .string()
    .trim()
    .min(1, "Kategori adı zorunludur.")
    .max(200, "Kategori adı en fazla 200 karakter olabilir."),

  aciklama: z.preprocess(
    bosMetniNullYap,
    z
      .string()
      .max(2000, "Kategori açıklaması en fazla 2000 karakter olabilir.")
      .nullable(),
  ),

  gorselYolu: z.preprocess(
    bosMetniNullYap,
    z
      .string()
      .max(500, "Görsel yolu en fazla 500 karakter olabilir.")
      .nullable(),
  ),

  seoUrl: z.preprocess(
    bosMetniNullYap,
    z.string().max(250, "SEO URL en fazla 250 karakter olabilir.").nullable(),
  ),

  seoBasligi: z.preprocess(
    bosMetniNullYap,
    z
      .string()
      .max(250, "SEO başlığı en fazla 250 karakter olabilir.")
      .nullable(),
  ),

  seoAciklamasi: z.preprocess(
    bosMetniNullYap,
    z
      .string()
      .max(500, "SEO açıklaması en fazla 500 karakter olabilir.")
      .nullable(),
  ),

  anaSayfadaGosterilsinMi: z.boolean(),

  siraNo: siraNoSchema,

  aktifMi: z.boolean(),
});
