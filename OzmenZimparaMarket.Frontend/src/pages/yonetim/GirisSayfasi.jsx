import { useState } from "react";
import { Navigate, useNavigate } from "react-router";

import {
  cikisYap,
  girisYap,
  mevcutKullaniciGetir,
  mevcutOturumGetir,
} from "../../api/servisler/authServisi";

import Button from "../../components/ui/Button";

function GirisSayfasi() {
  const navigate = useNavigate();

  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");
  const [girisYapiliyor, setGirisYapiliyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState("");

  const mevcutOturum = mevcutOturumGetir();

  if (mevcutOturum) {
    return <Navigate to="/ozmen-zimpara-yonetim" replace />;
  }

  async function formuGonder(event) {
    event.preventDefault();

    setHataMesaji("");

    if (!kullaniciAdi.trim() || !sifre) {
      setHataMesaji("Kullanıcı adı ve şifre alanları zorunludur.");

      return;
    }

    try {
      setGirisYapiliyor(true);

      await girisYap(kullaniciAdi.trim(), sifre);

      /*
        Login sonrasında token'ın gerçekten backend tarafından
        kabul edildiğini doğruluyoruz.

        Bu çağrı başarılıysa JWT entegrasyonu çalışıyor demektir.
      */
      await mevcutKullaniciGetir();

      navigate("/ozmen-zimpara-yonetim", {
        replace: true,
      });
    } catch (error) {
      cikisYap();

      const backendMesaji = error?.response?.data?.mesaj;

      if (backendMesaji) {
        setHataMesaji(backendMesaji);
      } else if (error?.code === "ERR_NETWORK") {
        setHataMesaji(
          "Sunucuya ulaşılamadı. Lütfen backend servisinin çalıştığını kontrol edin.",
        );
      } else {
        setHataMesaji("Giriş sırasında beklenmeyen bir hata oluştu.");
      }
    } finally {
      setGirisYapiliyor(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-black px-4 py-12 text-text-light">
      {/* Arka plan */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-brand-blue/15 blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-brand-purple/15 blur-[150px]" />

        <div
          className="
            absolute inset-0 opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/logo/header2.png"
            alt="Özmen Zımpara Market"
            className="h-32 w-auto object-contain"
          />
        </div>

        {/* Login kartı */}
        <div
          className="
            rounded-[24px]
            border border-white/10
            bg-white/[0.045]
            p-6
            shadow-panel
            backdrop-blur-xl
            sm:p-8
          "
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-blue-light">
              Yönetim Paneli
            </p>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Yönetici Girişi
            </h1>

            <p className="mt-3 text-sm leading-6 text-text-light-muted">
              Yönetim paneline erişmek için kullanıcı bilgilerinizle giriş
              yapın.
            </p>
          </div>

          <form onSubmit={formuGonder} className="mt-8 space-y-5">
            {/* Kullanıcı adı */}
            <div>
              <label
                htmlFor="kullaniciAdi"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Kullanıcı Adı
              </label>

              <input
                id="kullaniciAdi"
                type="text"
                value={kullaniciAdi}
                onChange={(event) => setKullaniciAdi(event.target.value)}
                autoComplete="username"
                disabled={girisYapiliyor}
                className="
                  h-12 w-full rounded-ui
                  border border-white/10
                  bg-black/25 px-4
                  text-sm text-white
                  outline-none
                  transition
                  placeholder:text-white/30
                  focus:border-brand-blue
                  focus:ring-2
                  focus:ring-brand-blue/20
                  disabled:opacity-60
                "
                placeholder="Kullanıcı adınız"
              />
            </div>

            {/* Şifre */}
            <div>
              <label
                htmlFor="sifre"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Şifre
              </label>

              <input
                id="sifre"
                type="password"
                value={sifre}
                onChange={(event) => setSifre(event.target.value)}
                autoComplete="current-password"
                disabled={girisYapiliyor}
                className="
                  h-12 w-full rounded-ui
                  border border-white/10
                  bg-black/25 px-4
                  text-sm text-white
                  outline-none
                  transition
                  placeholder:text-white/30
                  focus:border-brand-blue
                  focus:ring-2
                  focus:ring-brand-blue/20
                  disabled:opacity-60
                "
                placeholder="Şifreniz"
              />
            </div>

            {/* Hata */}
            {hataMesaji && (
              <div
                role="alert"
                className="
                  rounded-ui
                  border border-danger/30
                  bg-danger/10
                  px-4 py-3
                  text-sm leading-6
                  text-red-200
                "
              >
                {hataMesaji}
              </div>
            )}

            <Button type="submit" size="lg" fullWidth disabled={girisYapiliyor}>
              {girisYapiliyor ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-text-light-muted">
          Özmen Zımpara Market Yönetim Sistemi
        </p>
      </div>
    </main>
  );
}

export default GirisSayfasi;
