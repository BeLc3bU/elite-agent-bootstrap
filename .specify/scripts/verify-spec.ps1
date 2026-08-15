param(
    [Parameter(Mandatory=$false)]
    [string]$FeatureFolder
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = (Get-Item -Path "$ScriptDir\..\..").FullName
$SpecsRoot = Join-Path $Root "specs"

if (-not (Test-Path $SpecsRoot)) {
    Write-Warning "No existe la carpeta specs/ en el repositorio."
    exit 0
}

$Folders = @()
if ($FeatureFolder) {
    $Target = Join-Path $SpecsRoot $FeatureFolder
    if (Test-Path $Target) {
        $Folders += Get-Item $Target
    } else {
        Write-Error "No se encontro la carpeta: $Target"
    }
} else {
    $Folders = Get-ChildItem -Path $SpecsRoot -Directory
}

Write-Host "=== Estado de Especificaciones y Tareas ===" -ForegroundColor Cyan

foreach ($Folder in $Folders) {
    $TasksFile = Join-Path $Folder.FullName "tasks.md"
    $SpecFile = Join-Path $Folder.FullName "spec.md"
    $PlanFile = Join-Path $Folder.FullName "plan.md"
    
    $HasSpec = Test-Path $SpecFile
    $HasPlan = Test-Path $PlanFile
    $HasTasks = Test-Path $TasksFile

    $SpecStatus = if ($HasSpec) { "[OK] Presente" } else { "[X] Faltante" }
    $PlanStatus = if ($HasPlan) { "[OK] Presente" } else { "[X] Faltante" }
    $TasksStatus = if ($HasTasks) { "[OK] Presente" } else { "[X] Faltante" }

    Write-Host ""
    Write-Host ("[*] Feature: " + $Folder.Name) -ForegroundColor Yellow
    Write-Host ("   - spec.md:  " + $SpecStatus)
    Write-Host ("   - plan.md:  " + $PlanStatus)
    Write-Host ("   - tasks.md: " + $TasksStatus)

    if ($HasTasks) {
        $Lines = Get-Content $TasksFile
        $TotalTasks = ($Lines | Select-String -Pattern '^- \[( |x)\] \*\*`\[TASK-').Count
        $DoneTasks = ($Lines | Select-String -Pattern '^- \[x\] \*\*`\[TASK-').Count

        if ($TotalTasks -gt 0) {
            $Percent = [math]::Round(($DoneTasks / $TotalTasks) * 100, 1)
            Write-Host ("   - Tareas:   " + $DoneTasks + " / " + $TotalTasks + " completadas (" + $Percent + "%)") -ForegroundColor Green
        } else {
            Write-Host "   - Tareas:   Sin tareas estructuradas [TASK-XXX]" -ForegroundColor DarkGray
        }
    }
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
