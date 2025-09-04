import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Página Não Encontrada - Anunciai"
        description="A página que você está procurando não foi encontrada. Explore nossos serviços e empreendimentos cristãos."
        canonical="https://anunciai.app.br/404"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              Página Não Encontrada
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              A página que você está procurando não existe ou foi movida.
            </p>
            
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Mas não se preocupe! Você pode:
              </p>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Voltar para a página inicial
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Buscar por serviços cristãos
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Explorar nossa plataforma
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Página Inicial
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Serviços
                </Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </Card>

          {/* Seção de ajuda adicional */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Precisa de Ajuda?</h3>
              <p className="text-muted-foreground mb-4">
                Se você acredita que chegou aqui por engano, entre em contato conosco.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/contato">
                    Entrar em Contato
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/sobre">
                    Sobre o Anunciai
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
