import React, { useState, useEffect } from 'react';
import { Crown, Menu, User, Plus, LogOut, Settings, FileText, CreditCard } from 'lucide-react';
import { Button } from './button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { CacheRefreshButton } from './cache-refresh-button';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEmailVerificationBanner, setShowEmailVerificationBanner] = useState(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
        checkEmailVerification(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminRole(session.user.id);
          checkEmailVerification(session.user);
        } else {
          setIsAdmin(false);
          setShowEmailVerificationBanner(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      setIsAdmin(!!(data && data.length > 0));
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const checkEmailVerification = (user: SupabaseUser) => {
    // Mostrar banner apenas para usuários novos (criados há menos de 7 dias) que não confirmaram email
    const userCreatedAt = new Date(user.created_at);
    const now = new Date();
    const daysDifference = (now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Usuário é novo (menos de 7 dias) e email não confirmado
    const isNewUser = daysDifference <= 7;
    const emailNotConfirmed = !user.email_confirmed_at;
    
    setShowEmailVerificationBanner(isNewUser && emailNotConfirmed);
  };

  const resendConfirmationEmail = async () => {
    if (!user?.email) return;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });
      
      if (error) throw error;
      
      alert('Email de confirmação reenviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Error resending email:', error);
      alert('Erro ao reenviar email de confirmação.');
    }
  };

  const handleLogout = async () => {
    try {
      // Clear user state immediately
      setUser(null);
      setIsAdmin(false);
      setShowEmailVerificationBanner(false);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      // Force reload to clear all cache
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      // Even if there's an error, clear local state and redirect
      setUser(null);
      setIsAdmin(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/11c20994-40cf-41e8-a06d-0598619f15dd.png" 
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

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {!user ? (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:inline-flex"
                    onClick={() => navigate('/login')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Entrar
                  </Button>
                  <CacheRefreshButton variant="ghost" size="sm" className="hidden sm:inline-flex" />
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate('/anunciar')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Anunciar
                  </Button>
                </>
              ) : (
                <>
                  {/* Authenticated User Menu */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <CacheRefreshButton variant="ghost" size="sm" />
                    <Button variant="ghost" size="sm" onClick={() => navigate('/anunciar')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Anunciar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/meus-anuncios')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Meus Anúncios
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/gerenciar-pagamento')}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pagamento
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/perfil')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Perfil
                    </Button>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                        <Crown className="mr-2 h-4 w-4" />
                        Admin
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </div>

                  {/* Mobile User Menu */}
                  <div className="sm:hidden">
                    <CacheRefreshButton variant="ghost" size="sm" />
                    <Button variant="ghost" size="sm" onClick={() => navigate('/perfil')}>
                      <User className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}

              {/* Mobile Menu - Melhorado para mostrar navegação */}
              <div className="flex items-center space-x-2">
                <CacheRefreshButton variant="ghost" size="sm" className="sm:hidden" />
                <div className="md:hidden relative">
                  <Button variant="ghost" size="sm" onClick={() => {
                    const mobileNav = document.getElementById('mobile-nav');
                    if (mobileNav) {
                      mobileNav.classList.toggle('hidden');
                    }
                  }}>
                    <Menu className="h-5 w-5" />
                  </Button>
                  
                  {/* Mobile Navigation Menu */}
                  <div id="mobile-nav" className="hidden absolute top-12 right-0 bg-card border border-border rounded-lg shadow-lg w-48 z-50">
                    <nav className="p-4 space-y-2">
                      <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary" asChild>
                        <Link to="/">Início</Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary" asChild>
                        <Link to="/sobre">Sobre</Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary" asChild>
                        <Link to="/contato">Contato</Link>
                      </Button>
                      {!user && (
                        <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary" asChild>
                          <Link to="/login">Entrar</Link>
                        </Button>
                      )}
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                        onClick={() => navigate('/anunciar')}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Anunciar
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Email Verification Banner */}
      {showEmailVerificationBanner && (
        <div className="bg-yellow-500 text-white px-4 py-3 text-center relative z-40">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-medium">⚠️ VALIDAR EMAIL:</span>
              <span>Confirme seu email para garantir o acesso completo à plataforma.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="bg-white text-yellow-600 hover:bg-gray-100 border-white"
                onClick={resendConfirmationEmail}
              >
                Reenviar Email
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-yellow-600"
                onClick={() => setShowEmailVerificationBanner(false)}
              >
                ✕
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;