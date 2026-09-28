param(
    [Parameter(Mandatory=$true)]
    [string]$FeatureId,
    
    [Parameter(Mandatory=$true)]
    [string]$FeatureName
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = (Get-Item -Path "$ScriptDir\..\..").FullName
$Slug = "$FeatureId-$FeatureName" -replace '[^a-zA-Z0-9_-]', '-'
$TargetDir = Join-Path $Root "specs\$Slug"
$TemplatesDir = Join-Path $Root ".specify\templates"

if (Test-Path $TargetDir) {
    Write-Warning "El directorio de la feature ya existe: $TargetDir"
    exit 0
}

New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
Write-Host "Creando especificacion en: $TargetDir" -ForegroundColor Cyan

$Date = Get-Date -Format "yyyy-MM-dd"

# 1. spec.md
$SpecContent = Get-Content (Join-Path $TemplatesDir "spec-template.md") -Raw
$SpecContent = $SpecContent -replace '\[NOMBRE_FEATURE\]', $FeatureName
$SpecContent = $SpecContent -replace '\[ID_FEATURE\]', $FeatureId
$SpecContent = $SpecContent -replace '\[YYYY-MM-DD\]', $Date
Set-Content -Path (Join-Path $TargetDir "spec.md") -Value $SpecContent -Encoding UTF8

# 2. plan.md
$PlanContent = Get-Content (Join-Path $TemplatesDir "plan-template.md") -Raw
$PlanContent = $PlanContent -replace '\[NOMBRE_FEATURE\]', $FeatureName
$PlanContent = $PlanContent -replace '\[ID_FEATURE\]', $FeatureId
$PlanContent = $PlanContent -replace '\[YYYY-MM-DD\]', $Date
Set-Content -Path (Join-Path $TargetDir "plan.md") -Value $PlanContent -Encoding UTF8

# 3. tasks.md
$TasksContent = Get-Content (Join-Path $TemplatesDir "tasks-template.md") -Raw
$TasksContent = $TasksContent -replace '\[NOMBRE_FEATURE\]', $FeatureName
$TasksContent = $TasksContent -replace '\[ID_FEATURE\]', $FeatureId
$TasksContent = $TasksContent -replace '\[YYYY-MM-DD\]', $Date
Set-Content -Path (Join-Path $TargetDir "tasks.md") -Value $TasksContent -Encoding UTF8

# 4. clarify.md
$ClarifyContent = Get-Content (Join-Path $TemplatesDir "clarify-template.md") -Raw
$ClarifyContent = $ClarifyContent -replace '\[NOMBRE_FEATURE\]', $FeatureName
$ClarifyContent = $ClarifyContent -replace '\[ID_FEATURE\]', $FeatureId
Set-Content -Path (Join-Path $TargetDir "clarify.md") -Value $ClarifyContent -Encoding UTF8

# 5. checklist.md
$ChecklistContent = Get-Content (Join-Path $TemplatesDir "checklist-template.md") -Raw
$ChecklistContent = $ChecklistContent -replace '\[NOMBRE_FEATURE\]', $FeatureName
$ChecklistContent = $ChecklistContent -replace '\[ID_FEATURE\]', $FeatureId
Set-Content -Path (Join-Path $TargetDir "checklist.md") -Value $ChecklistContent -Encoding UTF8

Write-Host "Feature '$Slug' inicializada correctamente con todas sus plantillas." -ForegroundColor Green
Write-Host "Comienza editando 'specs/$Slug/spec.md' o ejecutando /speckit.specify" -ForegroundColor Yellow
