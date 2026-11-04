<#
.SYNOPSIS
    Script de Rollback / Reversion de Optimizaciones Gaming.
.DESCRIPTION
    Restaura el sistema al estado exacto previo registrado en los backups JSON de GamingOptimization/backups/.
#>

[CmdletBinding()]
param(
    [string]$BackupFile
)

$ErrorActionPreference = 'Continue'
$ScriptDir = $PSScriptRoot
$BaseDir = Split-Path -Parent $ScriptDir
$BackupsDir = Join-Path $BaseDir "backups"
$LogsDir = Join-Path $BaseDir "logs"

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = Join-Path $LogsDir "rollback_$timestamp.log"

function Write-Log($msg, $color = "White") {
    $formatted = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
    Write-Host $formatted -ForegroundColor $color
    $formatted | Out-File -FilePath $logFile -Append -Encoding UTF8
}

Write-Log "================================================================================" "Cyan"
Write-Log "  INICIANDO PROCESO DE ROLLBACK / RESTAURACION DE ESTADO PREVIO" "Cyan"
Write-Log "================================================================================" "Cyan"

if (-not $BackupFile) {
    $latest = Get-ChildItem -Path $BackupsDir -Filter "backup_state_*.json" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $latest) {
        Write-Log "[ERROR] No se encontraron archivos de backup en: $BackupsDir" "Red"
        return
    }
    $BackupFile = $latest.FullName
}

Write-Log "Usando archivo de copia de seguridad: $BackupFile" "Yellow"
$backupData = Get-Content -Path $BackupFile -Raw | ConvertFrom-Json

# 1. RESTAURAR HKCU RUN
Write-Log "`n[PASO 1/4] Restaurando aplicaciones de inicio en HKCU..." "Cyan"
if ($backupData.StartupHKCU) {
    foreach ($prop in $backupData.StartupHKCU.PSObject.Properties) {
        try {
            Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -Name $prop.Name -Value $prop.Value -Type String
            Write-Log "  [OK] Restaurada entrada HKCU: $($prop.Name)" "Green"
        } catch {
            Write-Log "  [ERROR] Al restaurar $($prop.Name): $($_.Exception.Message)" "Red"
        }
    }
}

# 2. RESTAURAR HKLM RUN
Write-Log "`n[PASO 2/4] Restaurando aplicaciones de inicio en HKLM..." "Cyan"
if ($backupData.StartupHKLM) {
    foreach ($prop in $backupData.StartupHKLM.PSObject.Properties) {
        try {
            Set-ItemProperty -Path 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run' -Name $prop.Name -Value $prop.Value -Type String
            Write-Log "  [OK] Restaurada entrada HKLM: $($prop.Name)" "Green"
        } catch {
            Write-Log "  [AVISO] No se pudo restaurar $($prop.Name) (puede requerir Administrador): $($_.Exception.Message)" "Yellow"
        }
    }
}

# 3. RESTAURAR SERVICIOS OEM
Write-Log "`n[PASO 3/4] Restaurando servicios de Windows a su modo previo..." "Cyan"
if ($backupData.Services) {
    foreach ($sProp in $backupData.Services.PSObject.Properties) {
        $sName = $sProp.Name
        $sInfo = $sProp.Value
        try {
            Set-Service -Name $sName -StartupType $sInfo.StartType -ErrorAction SilentlyContinue
            if ($sInfo.Status -eq 'Running') {
                Start-Service -Name $sName -ErrorAction SilentlyContinue
            }
            Write-Log "  [OK] Servicio $sName restaurado a StartType: $($sInfo.StartType) y Status: $($sInfo.Status)" "Green"
        } catch {
            Write-Log "  [AVISO] Error restaurando servicio $sName : $($_.Exception.Message)" "Yellow"
        }
    }
}

# 4. RESTAURAR PROPIEDADES DE RED
Write-Log "`n[PASO 4/4] Restaurando propiedades del adaptador de red..." "Cyan"
if ($backupData.NetworkProperties) {
    foreach ($nProp in $backupData.NetworkProperties.PSObject.Properties) {
        $keyword = $nProp.Name
        $info = $nProp.Value
        try {
            Set-NetAdapterAdvancedProperty -Name 'Ethernet 3' -RegistryKeyword $keyword -RegistryValue $info.RegistryValue -ErrorAction SilentlyContinue
            Write-Log "  [OK] Propiedad $keyword restaurada a: $($info.DisplayValue)" "Green"
        } catch {
            Write-Log "  [AVISO] Error restaurando red $keyword : $($_.Exception.Message)" "Yellow"
        }
    }
}

Write-Log "`n================================================================================" "Cyan"
Write-Log "  ROLLBACK FINALIZADO CON EXITO" "Green"
Write-Log "================================================================================" "Cyan"
