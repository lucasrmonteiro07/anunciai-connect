# Otimizações para Vercel

Este documento descreve as otimizações implementadas para melhorar a performance da aplicação na Vercel.

## 🚀 Otimizações Implementadas

### 1. Configuração da Vercel (`vercel.json`)
- **Headers de Segurança**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Cache de Assets**: Cache de 1 ano para arquivos estáticos (JS, CSS, imagens)
- **SPA Routing**: Rewrite para index.html para suporte a React Router
- **Framework Detection**: Configuração automática para Vite

### 2. Build Otimizado (`vite.config.ts`)
- **Code Splitting**: Chunks separados para vendor, Supabase, UI, maps e charts
- **Minificação**: esbuild para melhor performance
- **Target**: esnext para browsers modernos
- **Sourcemaps**: Desabilitados em produção
- **Bundle Analysis**: Warning limit de 1000KB

### 3. Lazy Loading de Páginas (`App.tsx`)
- **React.lazy()**: Carregamento sob demanda de todas as páginas
- **Suspense**: Loading spinner durante carregamento
- **Code Splitting**: Redução do bundle inicial

### 4. Otimização de Mapas (`map-filter.tsx`)
- **Dynamic Import**: Leaflet carregado apenas quando necessário
- **Lazy Loading**: Redução do bundle inicial
- **Performance**: Melhoria no tempo de carregamento inicial

### 5. Query Client Otimizado
- **Cache Duration**: 5 minutos para dados stale
- **GC Time**: 10 minutos para garbage collection
- **Retry Logic**: Apenas 1 tentativa em caso de erro
- **Window Focus**: Desabilitado refetch automático

### 6. Configurações de Performance (`performance.ts`)
- **Image Optimization**: URLs otimizadas para Unsplash
- **Preload Resources**: Fontes críticas carregadas antecipadamente
- **Cache Settings**: Configurações centralizadas

## 📊 Benefícios Esperados

### Performance
- **Bundle Size**: Redução de ~30-40% no bundle inicial
- **First Load**: Melhoria de ~50% no tempo de carregamento inicial
- **LCP**: Melhoria no Largest Contentful Paint
- **FID**: Redução no First Input Delay

### SEO
- **Core Web Vitals**: Melhoria em todas as métricas
- **Lighthouse Score**: Aumento esperado de 20-30 pontos
- **Mobile Performance**: Otimizações específicas para mobile

### User Experience
- **Loading States**: Feedback visual durante carregamento
- **Progressive Loading**: Carregamento incremental de recursos
- **Caching**: Melhor experiência em visitas subsequentes

## 🔧 Configurações Adicionais Recomendadas

### 1. Variáveis de Ambiente
```bash
# Configurar na Vercel Dashboard
VITE_SUPABASE_URL=https://wkchztcfbwnbukpqejix.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Domínio Personalizado
- Configurar domínio personalizado na Vercel
- Habilitar HTTPS automático
- Configurar CDN global

### 3. Analytics
- Integrar Vercel Analytics
- Configurar Web Vitals monitoring
- Implementar error tracking

## 📈 Monitoramento

### Métricas a Acompanhar
- **Build Time**: Tempo de build na Vercel
- **Bundle Size**: Tamanho dos chunks
- **Core Web Vitals**: LCP, FID, CLS
- **Error Rate**: Taxa de erros em produção

### Ferramentas Recomendadas
- Vercel Analytics
- Lighthouse CI
- Bundle Analyzer
- Web Vitals Extension

## 🚀 Próximos Passos

1. **PWA**: Implementar Service Worker
2. **Image Optimization**: Usar next/image ou similar
3. **Critical CSS**: Inline CSS crítico
4. **Preloading**: Preload de rotas críticas
5. **Compression**: Gzip/Brotli compression
