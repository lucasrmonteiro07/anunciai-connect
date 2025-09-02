import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/11c20994-40cf-41e8-a06d-0598619f15dd.png" 
                alt="Anunciai Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <div className="text-xl font-bold">
                  <span className="text-foreground">Anunciai</span>
                  <span className="text-primary">.app.br</span>
                </div>
                <p className="text-xs text-muted-foreground">Conectando a comunidade cristã</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              A plataforma que conecta prestadores de serviços e estabelecimentos cristãos, 
              facilitando negócios baseados em valores e princípios cristãos.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/anunciai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/anunciai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contato@anunciai.app.br"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <nav className="space-y-2">
              <Link 
                to="/" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Início
              </Link>
              <Link 
                to="/sobre" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Sobre
              </Link>
              <Link 
                to="/contato" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contato
              </Link>
              <Link 
                to="/anunciar" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Anunciar
              </Link>
            </nav>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="font-semibold mb-4">Serviços</h3>
            <nav className="space-y-2">
              <Link 
                to="/vip" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Planos VIP
              </Link>
              <Link 
                to="/meus-anuncios" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Meus Anúncios
              </Link>
              <Link 
                to="/gerenciar-pagamento" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Gerenciar Pagamento
              </Link>
              <Link 
                to="/login" 
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Entrar
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Anunciai. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="/termos" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Termos de Uso
            </a>
            <a 
              href="/privacidade" 
              className="text-muted-foreground hover:text-primary transition-colors text-sm"
            >
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;