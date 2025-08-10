import React from "react";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Contato - Anunciai"
      description="Fale com o Anunciai para dúvidas, parcerias e suporte."
      canonical="https://anunciai.app.br/contato"
    />
    <Header />
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contato</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-card border border-border rounded-lg p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" placeholder="Como podemos ajudar?" />
            </div>
            <Button type="submit">Enviar</Button>
          </form>
        </section>

        <aside className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Informações</h2>
          <p className="text-muted-foreground">Email: contato@anunciai.app.br</p>
          <p className="text-muted-foreground">Suporte: suporte@anunciai.app.br</p>
        </aside>
      </div>
    </main>
  </div>
);

export default Contact;
