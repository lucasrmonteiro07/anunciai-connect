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
      <div className="bg-card rounded-lg p-8 border shadow-sm max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Cadastre seu Anúncio</h2>
        <p className="text-muted-foreground mb-6">
          Preencha as informações abaixo para cadastrar seu prestador de serviço ou empreendimento na plataforma cristã Anunciai.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome do Negócio</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Digite o nome do seu negócio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <select className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Selecione uma categoria</option>
              <option value="construcao">Construção</option>
              <option value="alimentacao">Alimentação</option>
              <option value="musica">Música</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Descrição</label>
            <textarea 
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24"
              placeholder="Descreva seu negócio e serviços oferecidos"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Telefone/WhatsApp</label>
            <input 
              type="tel" 
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="(11) 99999-9999"
            />
          </div>
          <Button className="w-full">
            Cadastrar Anúncio
          </Button>
        </div>
      </div>
    </main>
  </div>
);

export default Anunciar;
