import React from 'react';
import { Crown, Menu, User, Plus } from 'lucide-react';
import { Button } from './button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
              <Crown className="h-6 w-6 text-black font-bold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-foreground">Anunciai</span>
                <span className="text-primary">.app.br</span>
              </h1>
              <p className="text-xs text-muted-foreground">Conectando a comunidade cristã</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Início
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Sobre
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Contato
            </Button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Anunciar
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Entrar</span>
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