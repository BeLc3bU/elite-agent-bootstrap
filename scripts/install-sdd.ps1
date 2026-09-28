# ==============================================================================
# Script de Instalación Universal: Antigravity Spec Kit (SDD)
# Instala la skill speckit-sdd y las directrices globales en el equipo actual.
# ==============================================================================

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   🚀 Instalador Universal SDD (GitHub Spec Kit + Kev)   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$skillSource = Join-Path $repoRoot "skills\speckit-sdd\SKILL.md"

if (-not (Test-Path $skillSource)) {
    Write-Error "No se encontro la skill en: $skillSource"
    exit 1
}

# 1. Resolver ruta global de Antigravity (~/.gemini/config)
$geminiConfigDir = Join-Path $HOME ".gemini\config"
$targetSkillsDir = Join-Path $geminiConfigDir "skills\speckit-sdd"

Write-Host "1. Configurando directorio global de Antigravity..." -ForegroundColor Yellow
if (-not (Test-Path $targetSkillsDir)) {
    New-Item -ItemType Directory -Path $targetSkillsDir -Force | Out-Null
}

# 2. Copiar Skill speckit-sdd
Write-Host "2. Instalando skill global 'speckit-sdd'..." -ForegroundColor Yellow
Copy-Item -Path $skillSource -Destination (Join-Path $targetSkillsDir "SKILL.md") -Force
Write-Host "   [OK] Skill instalada en: $targetSkillsDir\SKILL.md" -ForegroundColor Green

# 3. Configurar Reglas Globales (GEMINI.md)
Write-Host "3. Verificando reglas globales en GEMINI.md..." -ForegroundColor Yellow
$globalRulesFile = Join-Path $geminiConfigDir "GEMINI.md"

$ruleBlock = @"

## Metodología Spec-Driven Development (GitHub Spec Kit)
- **Detección automática:** Si el espacio de trabajo actual contiene una carpeta `.specify/` o `specs/`, el agente entrará automáticamente en modo **Spec-Driven Development (SDD)** estricto.
- **Lectura Constitucional:** Es obligatorio leer `.specify/memory/constitution.md` antes de proponer cambios de arquitectura o código.
- **Prohibición de Vibe Coding:** No escribir ni modificar código de producción sin contar con la especificación aprobada en `specs/NNN-<feature>/` (`spec.md`, `plan.md`, `tasks.md`).
- **Activación de Skill:** Usar la skill `speckit-sdd` para orquestar las fases: `specify` -> `plan` -> `tasks` -> `implement` -> `converge`.
- **Decisiones Tipadas (Kev/Jev):** Priorizar modelos de decisión tipada (Kev / /v1/systemone / jev-classifier) para clasificaciones categóricas o scoring.
"@

if (Test-Path $globalRulesFile) {
    $currentContent = Get-Content $globalRulesFile -Raw
    if ($currentContent -notmatch "speckit-sdd") {
        Add-Content -Path $globalRulesFile -Value "`n$ruleBlock"
        Write-Host "   [OK] Reglas SDD agregadas a: $globalRulesFile" -ForegroundColor Green
    } else {
        Write-Host "   [OK] Las reglas SDD ya estaban presentes en: $globalRulesFile" -ForegroundColor Green
    }
} else {
    Set-Content -Path $globalRulesFile -Value "# Reglas Globales de Antigravity`n$ruleBlock" -Encoding UTF8
    Write-Host "   [OK] Archivo GEMINI.md creado con reglas SDD en: $globalRulesFile" -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ✅ Instalación completada con éxito.                   " -ForegroundColor Green
Write-Host "   Cualquier sesión de Antigravity en este ordenador      " -ForegroundColor Green
Write-Host "   ahora cuenta con la skill 'speckit-sdd' activa.       " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
