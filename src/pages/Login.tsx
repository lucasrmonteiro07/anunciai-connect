import React from "react";
import Header from "@/components/ui/header";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => (
  <div className="min-h-screen bg-background">
    <SEO
      title="Entrar - Anunciai"
      description="Acesse sua conta para gerenciar seus anúncios."
      canonical="https://anunciai.app.br/login"
    />
    <Header />
    <main className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center mb-6">Entrar</h1>
        
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <div className="flex items-center justify-between">
          <Button type="submit">Entrar</Button>
          <Button type="button" variant="link">
            Esqueci minha senha
          </Button>
        </div>
        </form>
      </div>
    </main>
  </div>
);

export default Login;
