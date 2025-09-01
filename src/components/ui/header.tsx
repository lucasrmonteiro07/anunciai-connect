import React from 'react';
import { Crown, Menu, User, Plus } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/20f10db9-a2bf-456a-bf1f-ff62bbc82c29.png" 
              alt="Anunciai Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <div className="text-2xl font-bold leading-tight">
                <Link to="/" aria-label="Ir para a página inicial" className="inline-flex items-baseline gap-1">
                  <span className="text-foreground">Anunciai</span>
                  <span className="text-primary">.app.br</span>
                </Link>
                <p className="text-xs text-muted-foreground">Conectando a comunidade cristã</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Navegação principal">
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <Link to="/">Início</Link>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <Link to="/sobre">Sobre</Link>
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
              <Link to="/contato">Contato</Link>
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button 
              asChild
              variant="outline" 
              size="sm"
              className="hidden md:flex border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Link to="/anunciar">
                <Plus className="h-4 w-4 mr-2" />
                Anunciar
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="sm"
              className="border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Link to="/login">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Entrar</span>
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;