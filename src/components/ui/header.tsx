import React, { useState, useEffect } from 'react';
import { Crown, Menu, User, Plus, LogOut, Settings, FileText, CreditCard } from 'lucide-react';
import { Button } from './button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkAdminRole(session.user.id);
        } else {
          setIsAdmin(false);
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
      
      setIsAdmin(data && data.length > 0);
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const handleLogout = async () => {
    try {

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error);
        return;
      }

      setUser(null);
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
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
            {isAdmin && (
              <Button variant="ghost" className="text-foreground hover:text-primary" asChild>
                <Link to="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </Button>
            )}
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
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Button 
                  asChild
                  variant="outline" 
                  size="sm"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  <Link to="/meus-anuncios">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Meus Anúncios</span>
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="sm"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  <Link to="/perfil">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Perfil</span>
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="sm"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10"
                >
                  <Link to="/gerenciar-pagamento">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span className="hidden md:inline">Pagamento</span>
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Sair</span>
                </Button>
              </div>
            ) : (
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
            )}

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