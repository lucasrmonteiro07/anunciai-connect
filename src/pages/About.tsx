import React from "react";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";

const About = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Sobre - Anunciai"
      description="Conheça a missão do Anunciai: conectar a comunidade cristã a serviços e empreendimentos com ética e excelência."
      canonical="https://anunciai.app.br/sobre"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Anunciai",
        url: "https://anunciai.app.br",
      }}
    />
    <Header />
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Sobre o Anunciai</h1>
      <p className="text-muted-foreground max-w-3xl">
        O Anunciai conecta a comunidade cristã a prestadores de serviços e empreendimentos que valorizam princípios de fé, ética e excelência.
      </p>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Nossa Missão</h2>
          <p className="text-muted-foreground">
            Facilitar a descoberta de serviços confiáveis, promover conexões e fortalecer a economia da fé.
          </p>
        </article>

        <article className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Para Quem</h2>
          <p className="text-muted-foreground">
            Para prestadores, empreendimentos e clientes que desejam um ambiente seguro e alinhado a valores cristãos.
          </p>
        </article>
      </section>
    </main>
  </div>
);

export default About;
