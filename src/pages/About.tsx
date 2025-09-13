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
        O Anunciai conecta a comunidade cristã a profissionais, empreendimentos e produtos que valorizam princípios de fé, ética e excelência.
      </p>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Nossa Missão</h2>
          <p className="text-muted-foreground">
            Facilitar a descoberta de serviços, produtos e empreendimentos confiáveis, promover conexões e fortalecer a economia da fé.
          </p>
        </article>

        <article className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Para Quem</h2>
          <p className="text-muted-foreground">
            Para profissionais, empreendimentos e clientes que desejam um ambiente seguro e alinhado a valores cristãos.
          </p>
        </article>
      </section>

      <section className="mt-12">
        <article className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Política de Privacidade e LGPD</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              O Anunciai.app.br está comprometido com a proteção da privacidade e dos dados pessoais de seus usuários, 
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
            <p>
              <strong>Coleta e Uso de Dados:</strong> Coletamos e utilizamos dados pessoais exclusivamente para facilitar 
              a busca por serviços e a conexão entre anunciantes e potenciais clientes em nossa plataforma.
            </p>
            <p>
              <strong>Finalidade dos Dados:</strong> Os dados fornecidos são utilizados apenas para:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Permitir que usuários encontrem e contatem profissionais, empreendimentos e vendedores de produtos</li>
              <li>Facilitar o cadastro e gerenciamento de anúncios</li>
              <li>Melhorar a experiência de navegação na plataforma</li>
              <li>Comunicação relacionada aos serviços, produtos e estabelecimentos oferecidos</li>
            </ul>
            <p>
              <strong>Isenção de Responsabilidade:</strong> O Anunciai.app.br atua exclusivamente como plataforma de 
              divulgação e busca. Não nos responsabilizamos por quaisquer acordos, negociações, contratos ou 
              transações realizadas diretamente entre anunciantes e clientes. Toda comunicação, contratação de 
              serviços e acordos comerciais são de responsabilidade exclusiva das partes envolvidas.
            </p>
            <p>
              <strong>Seus Direitos:</strong> Você tem o direito de acessar, corrigir, excluir ou solicitar a 
              portabilidade de seus dados pessoais. Para exercer esses direitos ou esclarecer dúvidas sobre 
              nossa política de privacidade, entre em contato através de nossos canais oficiais.
            </p>
          </div>
        </article>
      </section>
    </main>
  </div>
);

export default About;
