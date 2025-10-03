import React from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, MapPin, Clock, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Contato - Anunciai"
        description="Entre em contato com a equipe do Anunciai. Estamos aqui para ajudar você a crescer seu negócio na comunidade cristã."
        canonical="https://anunciai.app.br/contato"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Entre em Contato
            </h1>
            <p className="text-xl text-muted-foreground">
              Estamos aqui para ajudar você a crescer seu negócio na comunidade cristã
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Informações de Contato */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Fale Conosco
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href="mailto:anunciai@anunciai.app.br" 
                        className="text-primary hover:underline"
                      >
                        anunciai@anunciai.app.br
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <a 
                        href="https://wa.me/5551995607379" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        (51) 99560-7379
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Horário de Atendimento</p>
                      <p className="text-muted-foreground">
                        Segunda a Sexta: 8h às 18h<br />
                        Sábado: 8h às 12h
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={() => window.open('mailto:anunciai@anunciai.app.br', '_self')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open('https://wa.me/5551995607379', '_blank')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Formulário de Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const subject = encodeURIComponent(formData.get('subject') as string || 'Contato pelo site');
                  const message = encodeURIComponent(
                    `Nome: ${formData.get('name')}\nEmail: ${formData.get('email')}\nMensagem: ${formData.get('message')}`
                  );
                  window.open(`mailto:anunciai@anunciai.app.br?subject=${subject}&body=${message}`, '_self');
                }}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      placeholder="Como podemos ajudar?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                      placeholder="Descreva sua dúvida ou sugestão..."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Seção sobre o Anunciai */}
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Sobre o Anunciai</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  O Anunciai é uma plataforma dedicada à comunidade cristã brasileira, 
                  conectando profissionais, empreendimentos e vendedores de produtos que compartilham 
                  dos mesmos valores e princípios. Nossa missão é fortalecer os negócios 
                  cristãos e facilitar o encontro entre quem oferece e quem busca serviços, 
                  produtos e estabelecimentos de qualidade dentro da nossa comunidade de fé.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;