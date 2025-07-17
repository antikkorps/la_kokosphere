# Script PowerShell pour lancer Astro et Sanity Studio en parallèle
Write-Host "🚀 Lancement d'Astro et Sanity Studio..." -ForegroundColor Green

# Vérifier si les dossiers existent
if (-not (Test-Path "studio-sanity")) {
    Write-Host "❌ Erreur: Le dossier studio-sanity n'existe pas" -ForegroundColor Red
    exit 1
}

# Fonction pour nettoyer les processus à la sortie
function Cleanup {
    Write-Host "🛑 Arrêt des serveurs..." -ForegroundColor Yellow
    if ($AstroJob) { Stop-Job $AstroJob; Remove-Job $AstroJob }
    if ($SanityJob) { Stop-Job $SanityJob; Remove-Job $SanityJob }
    exit 0
}

# Capturer Ctrl+C pour nettoyer
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

Write-Host "📱 Lancement d'Astro (http://localhost:4321)..." -ForegroundColor Cyan
$AstroJob = Start-Job -ScriptBlock { 
    Set-Location $using:PWD
    npm run dev 
}

Start-Sleep -Seconds 2

Write-Host "🎨 Lancement de Sanity Studio (http://localhost:3333)..." -ForegroundColor Cyan
$SanityJob = Start-Job -ScriptBlock { 
    Set-Location (Join-Path $using:PWD "studio-sanity")
    npm run dev 
}

Write-Host "✅ Les deux serveurs sont lancés !" -ForegroundColor Green
Write-Host "📱 Astro: http://localhost:4321" -ForegroundColor White
Write-Host "🎨 Sanity Studio: http://localhost:3333" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter les serveurs" -ForegroundColor Yellow

# Attendre que les jobs se terminent
try {
    Wait-Job $AstroJob, $SanityJob
} catch {
    Cleanup
} 