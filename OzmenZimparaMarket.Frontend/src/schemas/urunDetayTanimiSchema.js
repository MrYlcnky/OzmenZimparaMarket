import { z } from "zod";

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

export const urunDetayTanimiSchema = z.object({
  detayAdi: z
    .string()
    .trim()
    .min(1, "Özellik adı zorunludur.")
    .max(150, "Özellik adı en fazla 150 karakter olabilir."),

  cokluDegerMi: z.boolean(),

  filtredeGosterilsinMi: z.boolean(),

  sepetteSecilebilirMi: z.boolean(),

  siraNo: siraNoSchema,

  aktifMi: z.boolean(),
});
