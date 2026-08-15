param(
    [Parameter(Mandatory=$false)]
    [string]$TargetDir = (Get-Location).Path,

    [Parameter(Mandatory=$false)]
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "[*] Integrador Automatico de Spec-Kit & Elite Agent" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ("Directorio Destino: " + $TargetDir) -ForegroundColor Gray
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TemplateRoot = (Get-Item -Path "$ScriptDir\..").FullName

# 1. Crear directorios necesarios
$DirsToCreate = @(
    (Join-Path $TargetDir ".specify\memory"),
    (Join-Path $TargetDir ".specify\templates"),
    (Join-Path $TargetDir ".specify\scripts"),
    (Join-Path $TargetDir "specs"),
    (Join-Path $TargetDir ".github\prompts"),
    (Join-Path $TargetDir ".github\workflows")
)

foreach ($Dir in $DirsToCreate) {
    if (-not (Test-Path $Dir)) {
        New-Item -ItemType Directory -Path $Dir -Force | Out-Null
        Write-Host ("[+] Creado directorio: " + $Dir) -ForegroundColor DarkGray
    }
}

# 2. Copiar archivos de .specify y prompts
Copy-Item -Path (Join-Path $TemplateRoot ".specify\*") -Destination (Join-Path $TargetDir ".specify") -Recurse -Force
Copy-Item -Path (Join-Path $TemplateRoot ".github\prompts\*") -Destination (Join-Path $TargetDir ".github\prompts") -Recurse -Force

if (-not (Test-Path (Join-Path $TargetDir "specs\README.md"))) {
    Copy-Item -Path (Join-Path $TemplateRoot "specs\README.md") -Destination (Join-Path $TargetDir "specs\README.md") -Force
}

# 3. Detectar stack tecnologico en el proyecto destino
$DetectedStack = "Stack generico"
$DevCmd = "npm run dev"
$BuildCmd = "npm run build"
$LintCmd = "npm run lint"
$TestCmd = "npm test"

if (Test-Path (Join-Path $TargetDir "package.json")) {
    try {
        $PkgJson = Get-Content (Join-Path $TargetDir "package.json") -Raw | ConvertFrom-Json
        $Name = if ($PkgJson.name) { $PkgJson.name } else { "Proyecto Node/Web" }
        $DetectedStack = "Node.js / TypeScript / Web (" + $Name + ")"
        if ($PkgJson.scripts) {
            if ($PkgJson.scripts.dev) { $DevCmd = "npm run dev" }
            if ($PkgJson.scripts.build) { $BuildCmd = "npm run build" }
            if ($PkgJson.scripts.lint) { $LintCmd = "npm run lint" }
            if ($PkgJson.scripts.test) { $TestCmd = "npm test" }
        }
    } catch {
        $DetectedStack = "Node.js / JavaScript"
    }
} elseif (Test-Path (Join-Path $TargetDir "pyproject.toml")) {
    $DetectedStack = "Python (Pyproject / Poetry / UV)"
    $DevCmd = "uv run python main.py"
    $BuildCmd = "uv build"
    $LintCmd = "ruff check ."
    $TestCmd = "pytest"
} elseif (Test-Path (Join-Path $TargetDir "Cargo.toml")) {
    $DetectedStack = "Rust (Cargo)"
    $DevCmd = "cargo run"
    $BuildCmd = "cargo build --release"
    $LintCmd = "cargo clippy"
    $TestCmd = "cargo test"
} elseif (Test-Path (Join-Path $TargetDir "go.mod")) {
    $DetectedStack = "Go (Golang)"
    $DevCmd = "go run ."
    $BuildCmd = "go build"
    $LintCmd = "golangci-lint run"
    $TestCmd = "go test ./..."
}

Write-Host ("[?] Stack detectado: " + $DetectedStack) -ForegroundColor Yellow

# 4. Crear o preservar AGENTS.md
$AgentsPath = Join-Path $TargetDir "AGENTS.md"
if ((-not (Test-Path $AgentsPath)) -or $Force) {
    $AgentsTemplate = Get-Content (Join-Path $TemplateRoot "AGENTS.template.md") -Raw
    $AgentsTemplate = $AgentsTemplate -replace '\{\{DEV_COMMAND\}\}', $DevCmd
    $AgentsTemplate = $AgentsTemplate -replace '\{\{BUILD_COMMAND\}\}', $BuildCmd
    $AgentsTemplate = $AgentsTemplate -replace '\{\{LINT_COMMAND\}\}', $LintCmd
    $AgentsTemplate = $AgentsTemplate -replace '\{\{TEST_COMMAND\}\}', $TestCmd
    $AgentsTemplate = $AgentsTemplate -replace '\{\{SRC_PATH\}\}', "src/"
    $AgentsTemplate = $AgentsTemplate -replace '\{\{COMPONENTS_PATH\}\}', "src/components/"
    $AgentsTemplate = $AgentsTemplate -replace '\{\{SPECIALIZED_AGENTS_LIST\}\}', "| **SpecAgent** | Guardian de especificaciones y ciclo SDD | spec-kit-core |"
    $AgentsTemplate = $AgentsTemplate -replace '\{\{PHASE_PLAN_CHECKLIST\}\}', "- [ ] Fase 1: Integracion y validacion de especificaciones base.`n- [ ] Fase 2: Desarrollo continuo guiado por specs."
    
    Set-Content -Path $AgentsPath -Value $AgentsTemplate -Encoding UTF8
    Write-Host "[OK] Generado archivo: AGENTS.md" -ForegroundColor Green
} else {
    Write-Host "[INFO] Preservado archivo existente: AGENTS.md" -ForegroundColor Gray
}

# 5. Crear PROJECT_LOG.md si no existe
$LogPath = Join-Path $TargetDir "PROJECT_LOG.md"
if (-not (Test-Path $LogPath)) {
    $DateStr = Get-Date -Format 'yyyy-MM-dd'
    $InitialLog = "# Registro de Decisiones y Memoria del Proyecto (PROJECT_LOG.md)`n`n## [" + $DateStr + "] - Integracion de Spec-Kit`n- **Evento**: Integracion de Spec-Driven Development (SDD) en el repositorio.`n- **Stack Detectado**: " + $DetectedStack + "`n- **Directrices**: Especificacion formal mediante .specify/ y specs/.`n"
    Set-Content -Path $LogPath -Value $InitialLog -Encoding UTF8
    Write-Host "[OK] Generado archivo: PROJECT_LOG.md" -ForegroundColor Green
}

# 6. Crear .cursorrules si no existe
$CursorRulesPath = Join-Path $TargetDir ".cursorrules"
if (-not (Test-Path $CursorRulesPath)) {
    $CursorRulesContent = "# Reglas de Proyecto - Spec-Kit & Elite Agent`n1. Idioma: Toda respuesta, commit y documentacion DEBE ser en Espanol.`n2. Metodologia: Spec-Driven Development (SDD). No escribir codigo sin spec/plan/tasks en specs/.`n3. Guardrails: No comitear ni abrir PRs con errores de lint, typecheck o tests.`n4. Consulta .specify/memory/constitution.md para principios inmutables.`n"
    Set-Content -Path $CursorRulesPath -Value $CursorRulesContent -Encoding UTF8
    Write-Host "[OK] Generado archivo: .cursorrules" -ForegroundColor Green
}

# 7. Copiar release-please si aplica
$WorkflowSrc = Join-Path $TemplateRoot ".github\workflows\release-please.yml"
$WorkflowDest = Join-Path $TargetDir ".github\workflows\release-please.yml"
if ((Test-Path $WorkflowSrc) -and (-not (Test-Path $WorkflowDest))) {
    Copy-Item -Path $WorkflowSrc -Destination $WorkflowDest -Force
    Write-Host "[OK] Configurado GitHub Action: release-please.yml" -ForegroundColor Green
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "[!] Integracion completada con exito." -ForegroundColor Green
Write-Host "Comandos listos para usar en el chat de tu IA:" -ForegroundColor Yellow
Write-Host "  -> /speckit.specify   - Crear una nueva especificacion" -ForegroundColor White
Write-Host "  -> /speckit.plan      - Disenar arquitectura tecnica" -ForegroundColor White
Write-Host "  -> /speckit.tasks     - Desglosar tareas ejecutables" -ForegroundColor White
Write-Host "  -> /speckit.implement - Ejecutar el desarrollo con TDD" -ForegroundColor White
Write-Host "  -> /speckit.converge  - Validar calidad y preparar PR" -ForegroundColor White
Write-Host "=======================================================" -ForegroundColor Cyan
