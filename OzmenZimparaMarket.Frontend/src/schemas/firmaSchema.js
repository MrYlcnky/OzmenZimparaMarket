import { z } from "zod";

const iletisimNoRegex = /^[0-9+()\s-]+$/;

const whatsappNoRegex = /^\d{10,15}$/;

const konumAdiRegex = /^[A-Za-zÇĞİÖŞÜçğıöşü\s.'-]+$/;

export const firmaSchema = z.object({
  sirketAdi: z
    .string()
    .trim()
    .min(1, "Şirket adı zorunludur.")
    .max(200, "Şirket adı en fazla 200 karakter olabilir."),

  hakkimizda: z.string().trim().min(1, "Hakkımızda metni zorunludur."),

  vizyonumuz: z.string().trim().min(1, "Vizyon metni zorunludur."),

  misyonumuz: z.string().trim().min(1, "Misyon metni zorunludur."),

  stratejimiz: z.string().trim().min(1, "Strateji metni zorunludur."),

  kalitePolitikamiz: z.string().trim().min(1, "Kalite politikası zorunludur."),

  kvkk: z.string().trim().min(1, "KVKK metni zorunludur."),

  iletisimNo: z
    .string()
    .trim()
    .min(1, "İletişim numarası zorunludur.")
    .max(30, "İletişim numarası en fazla 30 karakter olabilir.")
    .regex(
      iletisimNoRegex,
      "İletişim numarası yalnızca rakam, boşluk, +, -, ( ve ) karakterlerini içerebilir.",
    ),

  whatsappNo: z
    .string()
    .trim()
    .min(1, "WhatsApp numarası zorunludur.")
    .regex(
      whatsappNoRegex,
      "WhatsApp numarası yalnızca rakamlardan oluşmalı ve ülke koduyla birlikte 10-15 haneli olmalıdır.",
    ),

  eposta: z
    .string()
    .trim()
    .min(1, "E-posta adresi zorunludur.")
    .email("Geçerli bir e-posta adresi girilmelidir.")
    .max(200, "E-posta adresi en fazla 200 karakter olabilir."),

  acikAdres: z
    .string()
    .trim()
    .min(1, "Açık adres zorunludur.")
    .max(1000, "Açık adres en fazla 1000 karakter olabilir."),

  il: z
    .string()
    .trim()
    .min(1, "İl bilgisi zorunludur.")
    .max(100, "İl en fazla 100 karakter olabilir.")
    .regex(konumAdiRegex, "İl bilgisi geçersiz karakter içeriyor."),

  ilce: z
    .string()
    .trim()
    .min(1, "İlçe bilgisi zorunludur.")
    .max(100, "İlçe en fazla 100 karakter olabilir.")
    .regex(konumAdiRegex, "İlçe bilgisi geçersiz karakter içeriyor."),

  googleHaritaBaglantisi: z
    .string()
    .trim()
    .max(2000, "Google Haritalar bağlantısı en fazla 2000 karakter olabilir."),

  googleHaritaGommeBaglantisi: z
    .string()
    .trim()
    .max(
      4000,
      "Google Haritalar gömme bağlantısı en fazla 4000 karakter olabilir.",
    ),
});
