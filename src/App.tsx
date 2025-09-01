import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Anunciar from "./pages/Anunciar";
import Profile from "./pages/Profile";
import MeusAnuncios from "./pages/MeusAnuncios";
import NotFound from "./pages/NotFound";
import ServiceDetail from "./pages/ServiceDetail";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/anunciar" element={<Anunciar />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/meus-anuncios" element={<MeusAnuncios />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/anuncio/:id" element={<ServiceDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
