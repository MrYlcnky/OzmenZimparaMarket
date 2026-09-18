import Container from "../components/ui/Container";
import Section from "../components/ui/Section";

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-brand-black text-text-light">
      <Section className="flex min-h-screen items-center">
        <Container>
          <p className="text-sm font-bold tracking-[0.2em] text-brand-blue-light">
            404
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Sayfa bulunamadı.
          </h1>

          <p className="mt-5 text-text-light-muted">
            Aradığınız sayfa mevcut değil veya adres yanlış yazılmış olabilir.
          </p>
        </Container>
      </Section>
    </main>
  );
}

export default NotFoundPage;
