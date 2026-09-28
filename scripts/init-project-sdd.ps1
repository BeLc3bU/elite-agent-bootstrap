# ==============================================================================
# Script de Inicialización de Proyecto: Spec Kit (SDD)
# Inicializa la estructura .specify/ y specs/ en cualquier repositorio.
# Uso: .\init-project-sdd.ps1 [-ProjectPath "C:\Ruta\Al\Proyecto"]
# ==============================================================================

[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [string]$ProjectPath = "."
)

$ErrorActionPreference = "Stop"

$targetPath = (Resolve-Path $ProjectPath).Path
$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$specifySource = Join-Path $repoRoot ".specify"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   🌱 Inicializador de Proyecto SDD (GitHub Spec Kit)    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Destino: $targetPath" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path $specifySource)) {
    Write-Error "No se encontro el paquete .specify en: $specifySource"
    exit 1
}

# 1. Copiar carpeta .specify
$targetSpecify = Join-Path $targetPath ".specify"
Write-Host "1. Desplegando estructura .specify/..." -ForegroundColor Yellow
if (-not (Test-Path $targetSpecify)) {
    Copy-Item -Path $specifySource -Destination $targetSpecify -Recurse -Force
    Write-Host "   [OK] .specify/ copiado con exito." -ForegroundColor Green
} else {
    Write-Host "   [!] La carpeta .specify/ ya existia. Se preserva el contenido." -ForegroundColor Magenta
}

# 2. Asegurar constitución inicial
$targetConstitution = Join-Path $targetSpecify "memory\constitution.md"
$templateConstitution = Join-Path $targetSpecify "memory\constitution-template.md"
if (-not (Test-Path $targetConstitution) -and (Test-Path $templateConstitution)) {
    Copy-Item -Path $templateConstitution -Destination $targetConstitution
    Write-Host "   [OK] constitution.md inicializada desde la plantilla." -ForegroundColor Green
}

# 3. Crear directorio specs/
$targetSpecs = Join-Path $targetPath "specs"
Write-Host "2. Verificando directorio specs/..." -ForegroundColor Yellow
if (-not (Test-Path $targetSpecs)) {
    New-Item -ItemType Directory -Path $targetSpecs -Force | Out-Null
    Write-Host "   [OK] Directorio specs/ creado." -ForegroundColor Green
} else {
    Write-Host "   [OK] Directorio specs/ ya existe." -ForegroundColor Green
}

# 4. Crear o enlazar AGENTS.md
$targetAgents = Join-Path $targetPath "AGENTS.md"
Write-Host "3. Verificando arnes AGENTS.md..." -ForegroundColor Yellow
if (-not (Test-Path $targetAgents)) {
    $agentsContent = @"
# AGENTS.md - Directrices de Agentes de IA

Este repositorio opera bajo el estándar oficial de **Spec-Driven Development (GitHub Spec Kit)**.

## 🏛️ Constitución del Proyecto
- Consulta obligatoria: `.specify/memory/constitution.md`
- Todo desarrollo funcional debe contar con una especificación previa en `specs/NNN-<feature>/`.
- Prohibido el "vibe coding": sin spec.md, plan.md y tasks.md aprobados, no se modifica código fuente.
- Las decisiones tipadas deben priorizar el uso de Kev / Jev (/v1/systemone).

## 🛠️ Comandos de Desarrollo
- Especificar: Usar `/speckit.specify <nombre>`
- Planificar: Usar `/speckit.plan`
- Desglosar tareas: Usar `/speckit.tasks`
- Implementar: Usar `/speckit.implement` (TDD estricto)
- Converger y Validar: Usar `/speckit.converge`
"@
    Set-Content -Path $targetAgents -Value $agentsContent -Encoding UTF8
    Write-Host "   [OK] AGENTS.md generado en la raiz del proyecto." -ForegroundColor Green
} else {
    Write-Host "   [OK] AGENTS.md ya existe." -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ✅ Proyecto inicializado con éxito bajo el estándar SDD" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
