import React from "react";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Anunciar = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Anunciar - Anunciai"
      description="Cadastre seu anúncio e alcance a comunidade cristã."
      canonical="https://anunciai.app.br/anunciar"
    />
    <Header />
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Anunciar</h1>
      <p className="text-muted-foreground max-w-2xl">
        Em breve: formulário completo para cadastrar Prestador de Serviço ou Empreendimento com upload de logotipo e imagens.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/login">Entrar para anunciar</Link>
        </Button>
      </div>
    </main>
  </div>
);

export default Anunciar;
