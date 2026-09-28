param(
    [Parameter(Mandatory=$false)]
    [string]$TargetDir = (Get-Location).Path,

    [Parameter(Mandatory=$false)]
    [ValidateSet("Auto", "Existing", "New")]
    [string]$Mode = "Auto",

    [Parameter(Mandatory=$false)]
    [switch]$Force,

    [Parameter(Mandatory=$false)]
    [switch]$NoBackup
)

$ErrorActionPreference = "Stop"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Integrador Universal de Spec-Kit & Elite Agent" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Directorio Destino: $TargetDir" -ForegroundColor Gray

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TemplateRoot = (Get-Item -Path "$ScriptDir\..").FullName
$ScaffoldDir = Join-Path $TemplateRoot ".specify\templates\scaffold"

# 1. Detectar stack y estado
$Files = if (Test-Path $TargetDir) { Get-ChildItem -Path $TargetDir -Force } else { @() }
$HasExistingCode = ($Files | Where-Object { $_.Name -in @("package.json", "pyproject.toml", "Cargo.toml", "go.mod", "pom.xml", "src", "app") }).Count -gt 0

$DetectedMode = if ($Files.Count -le 2 -and (-not $HasExistingCode)) { "New" } else { "Existing" }
$EffectiveMode = if ($Mode -eq "Auto") { $DetectedMode } else { $Mode }

$DetectedStack = "Stack generico"
$DevCmd = "npm run dev"
$BuildCmd = "npm run build"
$LintCmd = "npm run lint"
$TestCmd = "npm test"
$SrcPath = "src/"
$ComponentsPath = "src/components/"
$ProjectName = (Split-Path -Leaf $TargetDir)

if (Test-Path (Join-Path $TargetDir "package.json")) {
    try {
        $PkgJson = Get-Content (Join-Path $TargetDir "package.json") -Raw | ConvertFrom-Json
        if ($PkgJson.name) { $ProjectName = $PkgJson.name }
        $DetectedStack = "Node.js / TypeScript / Web ($ProjectName)"
        if ($PkgJson.scripts) {
            if ($PkgJson.scripts.dev) { $DevCmd = "npm run dev" }
            elseif ($PkgJson.scripts.start) { $DevCmd = "npm start" }
            if ($PkgJson.scripts.build) { $BuildCmd = "npm run build" }
            if ($PkgJson.scripts.lint) { $LintCmd = "npm run lint" }
            if ($PkgJson.scripts.test) { $TestCmd = "npm test" }
        }
    } catch {
        $DetectedStack = "Node.js / JavaScript"
    }
} elseif (Test-Path (Join-Path $TargetDir "pyproject.toml")) {
    $DetectedStack = "Python (Pyproject / UV / Poetry)"
    $DevCmd = "uv run python main.py"
    $BuildCmd = "uv build"
    $LintCmd = "ruff check ."
    $TestCmd = "pytest"
    if (Test-Path (Join-Path $TargetDir "app")) { $SrcPath = "app/" }
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

Write-Host "Stack detectado: $DetectedStack" -ForegroundColor Magenta
Write-Host "Modo operativo:  $EffectiveMode" -ForegroundColor Cyan
Write-Host ""

# 2. Crear directorios
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
        Write-Host "[+] Creado directorio: $Dir" -ForegroundColor DarkGray
    }
}

# 3. Copiar motor .specify y prompts
Copy-Item -Path (Join-Path $TemplateRoot ".specify\*") -Destination (Join-Path $TargetDir ".specify") -Recurse -Force
Copy-Item -Path (Join-Path $TemplateRoot ".github\prompts\*") -Destination (Join-Path $TargetDir ".github\prompts") -Recurse -Force

if (-not (Test-Path (Join-Path $TargetDir "specs\README.md"))) {
    Copy-Item -Path (Join-Path $TemplateRoot "specs\README.md") -Destination (Join-Path $TargetDir "specs\README.md") -Force
    Write-Host "[OK] Creado: specs/README.md" -ForegroundColor Green
}

# 4. Manejo de README.md
$ReadmePath = Join-Path $TargetDir "README.md"
if ($EffectiveMode -eq "New") {
    if ((-not (Test-Path $ReadmePath)) -or $Force) {
        $ReadmeTemplate = Get-Content (Join-Path $ScaffoldDir "README.project.template.md") -Raw
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{PROJECT_NAME}}', $ProjectName)
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{PROJECT_DESCRIPTION}}', 'Proyecto desarrollado con metodologia Spec-Driven Development (SDD).')
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{PREREQUISITES}}', "Entorno configurado para $DetectedStack")
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{INSTALL_COMMAND}}', 'npm install')
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{DEV_COMMAND}}', $DevCmd)
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{BUILD_COMMAND}}', $BuildCmd)
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{LINT_COMMAND}}', $LintCmd)
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{TEST_COMMAND}}', $TestCmd)
        $TreeText = "src/`nspecs/`n.specify/`nPROJECT_LOG.md"
        $ReadmeTemplate = $ReadmeTemplate.Replace('{{PROJECT_TREE}}', $TreeText)
        
        Set-Content -Path $ReadmePath -Value $ReadmeTemplate -Encoding UTF8
        Write-Host "[OK] Generado README.md para nuevo proyecto" -ForegroundColor Green
    } else {
        Write-Host "[INFO] README.md ya existe. Se preserva sin cambios." -ForegroundColor Gray
    }
} else {
    $GuideDest = Join-Path $TargetDir "SPECKIT_GUIDE.md"
    $GuideSrc = Join-Path $ScaffoldDir "SPECKIT_GUIDE.template.md"
    if ((Test-Path $GuideSrc) -and ((-not (Test-Path $GuideDest)) -or $Force)) {
        Copy-Item -Path $GuideSrc -Destination $GuideDest -Force
        Write-Host "[OK] Generado: SPECKIT_GUIDE.md (Tu README.md original ha sido protegido)" -ForegroundColor Green
    }
}

# 5. Manejo de AGENTS.md
$AgentsPath = Join-Path $TargetDir "AGENTS.md"
$AgentsTemplate = Get-Content (Join-Path $ScaffoldDir "AGENTS.new.template.md") -Raw
$AgentsTemplate = $AgentsTemplate.Replace('{{PROJECT_NAME}}', $ProjectName)
$AgentsTemplate = $AgentsTemplate.Replace('{{DEV_COMMAND}}', $DevCmd)
$AgentsTemplate = $AgentsTemplate.Replace('{{BUILD_COMMAND}}', $BuildCmd)
$AgentsTemplate = $AgentsTemplate.Replace('{{LINT_COMMAND}}', $LintCmd)
$AgentsTemplate = $AgentsTemplate.Replace('{{TEST_COMMAND}}', $TestCmd)
$AgentsTemplate = $AgentsTemplate.Replace('{{SRC_PATH}}', $SrcPath)
$AgentsTemplate = $AgentsTemplate.Replace('{{COMPONENTS_PATH}}', $ComponentsPath)
$AgentsTemplate = $AgentsTemplate.Replace('{{SPECIALIZED_AGENTS_LIST}}', '| **SpecAgent** | Guardian de especificaciones y ciclo SDD | spec-kit |')
$PhaseChecklist = "- [ ] Fase 1: Integracion y validacion de especificaciones base.`n- [ ] Fase 2: Desarrollo continuo guiado por specs."
$AgentsTemplate = $AgentsTemplate.Replace('{{PHASE_PLAN_CHECKLIST}}', $PhaseChecklist)

if (-not (Test-Path $AgentsPath)) {
    Set-Content -Path $AgentsPath -Value $AgentsTemplate -Encoding UTF8
    Write-Host "[OK] Generado archivo: AGENTS.md" -ForegroundColor Green
} else {
    if ($Force) {
        if (-not $NoBackup) {
            Copy-Item -Path $AgentsPath -Destination "$AgentsPath.bak" -Force
            Write-Host "  [Backup] Creado: AGENTS.md.bak" -ForegroundColor DarkGray
        }
        Set-Content -Path $AgentsPath -Value $AgentsTemplate -Encoding UTF8
        Write-Host "[!] Actualizado (force): AGENTS.md" -ForegroundColor Yellow
    } else {
        $AgentsOverlayPath = Join-Path $TargetDir "AGENTS.speckit.md"
        Set-Content -Path $AgentsOverlayPath -Value $AgentsTemplate -Encoding UTF8
        Write-Host "[INFO] AGENTS.md ya existe. Creado 'AGENTS.speckit.md' para evitar sobreescritura." -ForegroundColor Yellow
    }
}

# 6. Manejo de PROJECT_LOG.md
$LogPath = Join-Path $TargetDir "PROJECT_LOG.md"
$DateStr = Get-Date -Format 'yyyy-MM-dd'
if (-not (Test-Path $LogPath)) {
    $LogTemplate = Get-Content (Join-Path $ScaffoldDir "PROJECT_LOG.template.md") -Raw
    $LogTemplate = $LogTemplate.Replace('{{INIT_DATE}}', $DateStr)
    $InitEventText = if ($EffectiveMode -eq "New") { "Inicializacion de nuevo proyecto" } else { "Integracion no destructiva de Spec-Kit" }
    $LogTemplate = $LogTemplate.Replace('{{INIT_EVENT}}', $InitEventText)
    $LogTemplate = $LogTemplate.Replace('{{DETECTED_STACK}}', $DetectedStack)
    Set-Content -Path $LogPath -Value $LogTemplate -Encoding UTF8
    Write-Host "[OK] Generado archivo: PROJECT_LOG.md" -ForegroundColor Green
} else {
    $CurrentLog = Get-Content -Path $LogPath -Raw
    $LogMatch = "[$DateStr] - Integracion de Spec-Kit"
    if (-not ($CurrentLog.Contains($LogMatch))) {
        $AppendEntry = "`n`n## [$DateStr] - Integracion de Spec-Kit (SDD)`n- **Evento**: Integracion segura de Spec-Kit.`n- **Stack**: $DetectedStack`n- **Estado**: Guardrails y plantillas activadas sin alterar archivos existentes.`n"
        Add-Content -Path $LogPath -Value $AppendEntry -Encoding UTF8
        Write-Host "[OK] Actualizado con nuevo evento: PROJECT_LOG.md" -ForegroundColor Green
    }
}

# 7. Manejo de .cursorrules
$CursorRulesPath = Join-Path $TargetDir ".cursorrules"
$RulesSnippet = "# Reglas de Proyecto - Spec-Kit`n1. Idioma: Toda respuesta, commit y documentacion DEBE ser en Espanol.`n2. Metodologia: Spec-Driven Development (SDD). No escribir codigo sin spec/plan/tasks en specs/.`n3. Guardrails: No comitear ni abrir PRs con errores de lint, typecheck o tests.`n4. Consulta .specify/memory/constitution.md para principios inmutables.`n"
if (-not (Test-Path $CursorRulesPath)) {
    Set-Content -Path $CursorRulesPath -Value $RulesSnippet -Encoding UTF8
    Write-Host "[OK] Generado archivo: .cursorrules" -ForegroundColor Green
} else {
    $CurrentRules = Get-Content -Path $CursorRulesPath -Raw
    if (-not ($CurrentRules.Contains("Reglas de Proyecto - Spec-Kit"))) {
        Add-Content -Path $CursorRulesPath -Value ("`n" + $RulesSnippet) -Encoding UTF8
        Write-Host "[OK] Inyectadas reglas Spec-Kit en .cursorrules existente" -ForegroundColor Green
    }
}

# 8. Copiar release-please si aplica
$WorkflowSrc = Join-Path $TemplateRoot ".github\workflows\release-please.yml"
$WorkflowDest = Join-Path $TargetDir ".github\workflows\release-please.yml"
if ((Test-Path $WorkflowSrc) -and (-not (Test-Path $WorkflowDest))) {
    Copy-Item -Path $WorkflowSrc -Destination $WorkflowDest -Force
    Write-Host "[OK] Configurado GitHub Action: release-please.yml" -ForegroundColor Green
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "[!] Integracion completada con exito en modo $EffectiveMode." -ForegroundColor Green
Write-Host "Comandos listos para usar en el chat de tu IA:" -ForegroundColor Yellow
Write-Host "  -> /speckit.specify   - Crear una nueva especificacion" -ForegroundColor White
Write-Host "  -> /speckit.clarify   - Resolver dudas tecnicas" -ForegroundColor White
Write-Host "  -> /speckit.plan      - Disenar arquitectura tecnica" -ForegroundColor White
Write-Host "  -> /speckit.tasks     - Desglosar tareas ejecutables" -ForegroundColor White
Write-Host "  -> /speckit.implement - Ejecutar el desarrollo con TDD" -ForegroundColor White
Write-Host "  -> /speckit.converge  - Validar calidad y preparar PR" -ForegroundColor White
Write-Host "=======================================================" -ForegroundColor Cyan
