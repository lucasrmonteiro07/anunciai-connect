import React from 'react';
import { Search, Users, ShieldCheck, Crown } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-professional.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBanner} 
          alt="Profissionais cristãos trabalhando juntos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Plataforma Cristã de Anúncios
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Encontre
            <span className="gold-accent block">
              Profissionais de Confiança
            </span>
            na Sua Região
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Plataforma que conecta você aos melhores prestadores de serviços cristãos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
              onClick={() => {
                const searchSection = document.querySelector('[data-search-section]');
                searchSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Search className="mr-2 h-5 w-5" />
              Buscar Anúncios
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-4 text-lg border-primary/30 hover:border-primary hover:bg-primary/10"
              asChild
            >
              <Link to="/anunciar">
                <Users className="mr-2 h-5 w-5" />
                Cadastrar Anúncio
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Cristãos Comprometidos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Categorias de Serviços</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">Comunidade Confiável</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
    </section>
  );
};

export default HeroSection;