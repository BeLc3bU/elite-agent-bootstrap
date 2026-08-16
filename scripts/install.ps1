# =====================================================================
# Instalador Remoto Universal - Elite Agent + Spec-Kit
# Ejecutable via: irm https://raw.githubusercontent.com/BeLc3bU/elite-agent-bootstrap/main/scripts/install.ps1 | iex
# =====================================================================

$ErrorActionPreference = "Stop"
$TargetDir = (Get-Location).Path
$TempDir = Join-Path ([System.IO.Path]::GetTempPath()) ("elite-speckit-" + [System.Guid]::NewGuid().ToString())

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "🚀 Descargando e integrando Elite Agent + Spec-Kit..." -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan

try {
    # 1. Intentar clonar con git shallow
    if (Get-Command git -ErrorAction SilentlyContinue) {
        git clone --depth 1 https://github.com/BeLc3bU/elite-agent-bootstrap.git $TempDir 2>$null | Out-Null
    } else {
        # 2. Si no hay git, descargar zip desde GitHub
        $ZipUrl = "https://github.com/BeLc3bU/elite-agent-bootstrap/archive/refs/heads/main.zip"
        $ZipFile = "$TempDir.zip"
        Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipFile -UseBasicParsing
        Expand-Archive -Path $ZipFile -DestinationPath $TempDir -Force
        Remove-Item $ZipFile -Force
        $ExtractedChild = Get-ChildItem -Path $TempDir | Select-Object -First 1
        $TempDir = $ExtractedChild.FullName
    }

    # 3. Ejecutar integrador
    $IntegratorScript = Join-Path $TempDir "scripts\integrate-speckit.ps1"
    if (Test-Path $IntegratorScript) {
        & powershell -ExecutionPolicy Bypass -File $IntegratorScript -TargetDir $TargetDir
    } else {
        Write-Host "[-] No se encontró el script de integración." -ForegroundColor Red
    }
}
catch {
    Write-Host "[-] Error durante la instalación remota: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    # 4. Limpieza de temporales
    if (Test-Path $TempDir) {
        Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
    }
}
