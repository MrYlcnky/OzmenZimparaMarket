import { z } from "zod";

const kullaniciAdiRegex = /^[a-zA-Z0-9._-]+$/;

const kullaniciAdiSchema = z
  .string()
  .trim()
  .min(1, "Kullanıcı adı zorunludur.")
  .min(3, "Kullanıcı adı en az 3 karakter olmalıdır.")
  .max(100, "Kullanıcı adı en fazla 100 karakter olabilir.")
  .regex(
    kullaniciAdiRegex,
    "Kullanıcı adı yalnızca harf, rakam, nokta, alt çizgi ve kısa çizgi içerebilir.",
  );

const adSoyadSchema = z
  .string()
  .trim()
  .min(1, "Ad soyad zorunludur.")
  .min(2, "Ad soyad en az 2 karakter olmalıdır.")
  .max(200, "Ad soyad en fazla 200 karakter olabilir.");

const sifreSchema = z
  .string()
  .min(1, "Şifre zorunludur.")
  .min(8, "Şifre en az 8 karakter olmalıdır.")
  .max(100, "Şifre en fazla 100 karakter olabilir.");

export const panelKullanicisiEkleSchema = z.object({
  kullaniciAdi: kullaniciAdiSchema,

  adSoyad: adSoyadSchema,

  sifre: sifreSchema,

  aktifMi: z.boolean(),
});

export const panelKullanicisiGuncelleSchema = z.object({
  kullaniciAdi: kullaniciAdiSchema,

  adSoyad: adSoyadSchema,

  aktifMi: z.boolean(),
});

export const panelKullanicisiSifreSifirlaSchema = z
  .object({
    yeniSifre: sifreSchema,

    yeniSifreTekrar: z.string().min(1, "Yeni şifre tekrarı zorunludur."),
  })
  .refine((deger) => deger.yeniSifre === deger.yeniSifreTekrar, {
    path: ["yeniSifreTekrar"],

    message: "Yeni şifreler birbiriyle eşleşmiyor.",
  });

export const panelKullanicisiSifreDegistirSchema = z
  .object({
    mevcutSifre: z.string().min(1, "Mevcut şifre zorunludur."),

    yeniSifre: sifreSchema,

    yeniSifreTekrar: z.string().min(1, "Yeni şifre tekrarı zorunludur."),
  })
  .refine((deger) => deger.yeniSifre !== deger.mevcutSifre, {
    path: ["yeniSifre"],

    message: "Yeni şifre mevcut şifreyle aynı olamaz.",
  })
  .refine((deger) => deger.yeniSifre === deger.yeniSifreTekrar, {
    path: ["yeniSifreTekrar"],

    message: "Yeni şifreler birbiriyle eşleşmiyor.",
  });
