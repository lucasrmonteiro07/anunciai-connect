# Script para limpar cache e rebuild do projeto Anunciai
# Execute: .\limpar-cache.ps1

Write-Host "🧹 Limpando cache do projeto Anunciai..." -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
$projectPath = "c:\Users\monteiro\Documents\GitHub\anunciai-connect"
Set-Location $projectPath

Write-Host "📁 Diretório: $projectPath" -ForegroundColor Yellow
Write-Host ""

# 1. Limpar cache do Vite
Write-Host "🗑️  Removendo cache do Vite..." -ForegroundColor Green
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "   ✅ Cache do Vite removido" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Cache do Vite não existe" -ForegroundColor Gray
}

# 2. Limpar build antigo
Write-Host "🗑️  Removendo build antigo..." -ForegroundColor Green
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "   ✅ Build antigo removido" -ForegroundColor Green
} else {
    Write-Host "   ℹ️  Build não existe" -ForegroundColor Gray
}

# 3. Limpar cache do navegador (instruções)
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Limpe o cache do navegador também!" -ForegroundColor Yellow
Write-Host "   Chrome/Edge: Ctrl + Shift + Delete" -ForegroundColor White
Write-Host "   Ou use modo anônimo: Ctrl + Shift + N" -ForegroundColor White
Write-Host ""

# 4. Perguntar se quer rebuild
Write-Host "🔨 Deseja fazer rebuild agora? (S/N)" -ForegroundColor Cyan
$rebuild = Read-Host

if ($rebuild -eq "S" -or $rebuild -eq "s") {
    Write-Host ""
    Write-Host "🔨 Executando npm run build..." -ForegroundColor Green
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Erro no build. Verifique os erros acima." -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "ℹ️  Execute manualmente: npm run dev" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✨ Processo concluído!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. npm run dev" -ForegroundColor White
Write-Host "   2. Abrir http://localhost:5173" -ForegroundColor White
Write-Host "   3. Testar navegação" -ForegroundColor White
Write-Host ""
