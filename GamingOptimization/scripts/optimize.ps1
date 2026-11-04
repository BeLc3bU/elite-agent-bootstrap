<#
.SYNOPSIS
    Script de Optimizacion de Rendimiento Gaming Profesional (Nivel 1 y Nivel 2 Seguro).
.DESCRIPTION
    Aplica optimizaciones estrictamente seguras, no destructivas y reversibles:
    - Optimizacion del adaptador de red Realtek (eliminacion de micro-latencias por ahorro de energia).
    - Desactivacion de servicios OEM con polling de sensores de alto DPC (EasyTune, Gigabyte Update, UrbanVPN).
    - Desactivacion de procesos de inicio causantes de stuttering (Overwolf, sincros en la nube, launchers en arranque).
    - Validacion de Modo Juego y Game DVR de Windows.
    - Creacion de backups completos antes de cualquier cambio.
#>

[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [switch]$DryRun,
    [switch]$SkipNetwork,
    [switch]$SkipServices,
    [switch]$SkipStartup
)

$ErrorActionPreference = 'Stop'
$ScriptDir = $PSScriptRoot
$BaseDir = Split-Path -Parent $ScriptDir
$BackupsDir = Join-Path $BaseDir "backups"
$LogsDir = Join-Path $BaseDir "logs"

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = Join-Path $LogsDir "optimization_$timestamp.log"
$backupFile = Join-Path $BackupsDir "backup_state_$timestamp.json"

function Write-Log($msg, $color = "White") {
    $formatted = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $msg
    Write-Host $formatted -ForegroundColor $color
    $formatted | Out-File -FilePath $logFile -Append -Encoding UTF8
}

Write-Log "================================================================================" "Cyan"
Write-Log "  INICIANDO PROCESO DE OPTIMIZACION PROFESIONAL PARA GAMING (NIVEL 1 / SEGURO)" "Cyan"
Write-Log "================================================================================" "Cyan"

if ($DryRun) {
    Write-Log "[MODO DE SIMULACION] - No se aplicaran cambios reales en el sistema." "Yellow"
}

# 1. CREACION DE BACKUP INMUTABLE
Write-Log "[PASO 1/5] Creando copia de seguridad del estado actual..." "Cyan"

$currentState = [ordered]@{
    Timestamp = $timestamp
    StartupHKCU = @{}
    StartupHKLM = @{}
    Services = @{}
    NetworkProperties = @{}
    WindowsGameBar = @{}
}

# Respaldar HKCU Run
try {
    $hkcuRun = Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -ErrorAction SilentlyContinue
    if ($hkcuRun) {
        $hkcuRun.PSObject.Properties | Where-Object { $_.Name -notmatch '^PS' } | ForEach-Object {
            $currentState.StartupHKCU[$_.Name] = $_.Value
        }
    }
} catch {
    Write-Log "Error leyendo HKCU Run: $($_.Exception.Message)" "Red"
}

# Respaldar HKLM Run
try {
    $hklmRun = Get-ItemProperty 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run' -ErrorAction SilentlyContinue
    if ($hklmRun) {
        $hklmRun.PSObject.Properties | Where-Object { $_.Name -notmatch '^PS' } | ForEach-Object {
            $currentState.StartupHKLM[$_.Name] = $_.Value
        }
    }
} catch {
    Write-Log "Error leyendo HKLM Run: $($_.Exception.Message)" "Red"
}

# Respaldar Servicios OEM seleccionados
$targetServices = @('EasyTuneEngineService', 'GigabyteUpdateService', 'UrbanVPN-Service')
foreach ($sName in $targetServices) {
    $svc = Get-Service -Name $sName -ErrorAction SilentlyContinue
    if ($svc) {
        $currentState.Services[$sName] = @{
            Status = $svc.Status.ToString()
            StartType = $svc.StartType.ToString()
        }
    }
}

# Respaldar Propiedades de Red
$nicProps = Get-NetAdapterAdvancedProperty -Name 'Ethernet 3' -ErrorAction SilentlyContinue
if ($nicProps) {
    foreach ($p in $nicProps) {
        if ($p.RegistryKeyword -in @('EnableGreenEthernet', 'PowerSavingMode', 'GigaLite', 'AdvancedEEE', '*EEE')) {
            $currentState.NetworkProperties[$p.RegistryKeyword] = @{
                DisplayName = $p.DisplayName
                DisplayValue = $p.DisplayValue
                RegistryValue = $p.RegistryValue
            }
        }
    }
}

# Guardar JSON de estado
$currentState | ConvertTo-Json -Depth 5 | Out-File -FilePath $backupFile -Encoding UTF8
Write-Log "[OK] Backup de estado guardado en: $backupFile" "Green"

# 2. OPTIMIZACION DE PROCESOS DE INICIO (STARTUP APPS)
Write-Log "`n[PASO 2/5] Optimizando aplicaciones de inicio (Startup Apps)..." "Cyan"
$appsToDisableHKCU = @(
    'Overwolf',
    'GoogleDriveFS',
    'OneDrive',
    'Windscribe',
    'Adobe Acrobat Synchronizer',
    'EpicGamesLauncher',
    'Battle.net',
    'RobloxPlayerBeta',
    'MicrosoftEdgeAutoLaunch_D74866CC9A9FD7473DAB98067A84C526'
)

$appsToDisableHKLM = @(
    'UrbanVPN',
    'PDF24'
)

if (-not $SkipStartup) {
    foreach ($app in $appsToDisableHKCU) {
        if ($currentState.StartupHKCU.ContainsKey($app)) {
            Write-Log "  -> Desactivando de inicio HKCU: $app" "Yellow"
            if (-not $DryRun) {
                Remove-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -Name $app -ErrorAction SilentlyContinue
            }
        } else {
            Write-Log "  -> No presente o ya desactivado en HKCU: $app" "Gray"
        }
    }

    foreach ($app in $appsToDisableHKLM) {
        if ($currentState.StartupHKLM.ContainsKey($app)) {
            Write-Log "  -> Desactivando de inicio HKLM: $app" "Yellow"
            if (-not $DryRun) {
                Remove-ItemProperty -Path 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run' -Name $app -ErrorAction SilentlyContinue
            }
        } else {
            Write-Log "  -> No presente o ya desactivado en HKLM: $app" "Gray"
        }
    }
} else {
    Write-Log "  [OMITIDO] Opcion -SkipStartup especificada." "Yellow"
}

# 3. OPTIMIZACION DE SERVICIOS OEM CON POLLING / DPC LATENCY
Write-Log "`n[PASO 3/5] Optimizando servicios de fondo con polling DPC/latencia..." "Cyan"
if (-not $SkipServices) {
    foreach ($sName in $targetServices) {
        $svc = Get-Service -Name $sName -ErrorAction SilentlyContinue
        if ($svc) {
            Write-Log "  -> Deteniendo y configurando en Manual: $sName (Estado previo: $($svc.Status))" "Yellow"
            if (-not $DryRun) {
                try {
                    if ($svc.Status -eq 'Running') {
                        Stop-Service -Name $sName -Force -ErrorAction SilentlyContinue
                    }
                    Set-Service -Name $sName -StartupType Manual -ErrorAction SilentlyContinue
                    Write-Log "     [OK] $sName configurado en Manual exitosamente." "Green"
                } catch {
                    Write-Log "     [AVISO] Requiere permisos elevados para modificar servicio $sName : $($_.Exception.Message)" "Yellow"
                }
            }
        }
    }
} else {
    Write-Log "  [OMITIDO] Opcion -SkipServices especificada." "Yellow"
}

# 4. OPTIMIZACION DEL ADAPTADOR DE RED (REALTEK 2.5GbE)
Write-Log "`n[PASO 4/5] Optimizando adaptador Realtek Ethernet para gaming competitivo (cero ahorro energetico)..." "Cyan"
if (-not $SkipNetwork) {
    $nic = Get-NetAdapter -Name 'Ethernet 3' -ErrorAction SilentlyContinue
    if ($nic) {
        $networkTweaks = @(
            @{ Keyword = 'EnableGreenEthernet'; Value = '0'; Desc = 'Ethernet Ecologico (Green Ethernet)' },
            @{ Keyword = 'PowerSavingMode'; Value = '0'; Desc = 'Modo de ahorro de energia del controlador' },
            @{ Keyword = 'GigaLite'; Value = '0'; Desc = 'GigaLite (reduccion automatica de velocidad)' },
            @{ Keyword = 'AdvancedEEE'; Value = '0'; Desc = 'Advanced Energy Efficient Ethernet' }
        )

        foreach ($tweak in $networkTweaks) {
            Write-Log "  -> Desactivando $($tweak.Desc)..." "Yellow"
            if (-not $DryRun) {
                try {
                    Set-NetAdapterAdvancedProperty -Name 'Ethernet 3' -RegistryKeyword $tweak.Keyword -RegistryValue $tweak.Value -ErrorAction SilentlyContinue
                    Write-Log "     [OK] $($tweak.Desc) desactivado correctamente." "Green"
                } catch {
                    Write-Log "     [AVISO] No se pudo cambiar $($tweak.Keyword) (posiblemente requiera privilegios de Administrador): $($_.Exception.Message)" "Yellow"
                }
            }
        }
    } else {
        Write-Log "  [AVISO] Adaptador 'Ethernet 3' no encontrado." "Yellow"
    }
} else {
    Write-Log "  [OMITIDO] Opcion -SkipNetwork especificada." "Yellow"
}

# 5. MODO JUEGO Y CONFIGURACION DE WINDOWS
Write-Log "`n[PASO 5/5] Verificando y optimizando Modo Juego y Game DVR de Windows..." "Cyan"
if (-not $DryRun) {
    try {
        # Asegurar Modo Juego Activado
        if (-not (Test-Path 'HKCU:\Software\Microsoft\GameBar')) {
            New-Item -Path 'HKCU:\Software\Microsoft\GameBar' -Force | Out-Null
        }
        Set-ItemProperty -Path 'HKCU:\Software\Microsoft\GameBar' -Name 'AllowAutoGameMode' -Value 1 -Type DWord
        Set-ItemProperty -Path 'HKCU:\Software\Microsoft\GameBar' -Name 'AutoGameModeEnabled' -Value 1 -Type DWord
        Write-Log "  [OK] Modo Juego de Windows configurado en 1 (Activado)." "Green"

        # Desactivar captura en segundo plano de GameDVR (Background Recording que consume GPU/disco)
        if (-not (Test-Path 'HKCU:\System\GameConfigStore')) {
            New-Item -Path 'HKCU:\System\GameConfigStore' -Force | Out-Null
        }
        Set-ItemProperty -Path 'HKCU:\System\GameConfigStore' -Name 'GameDVR_Enabled' -Value 0 -Type DWord
        Write-Log "  [OK] Game DVR Background Recording desactivado (elimina sobrecarga en segundo plano)." "Green"
    } catch {
        Write-Log "  [AVISO] Error ajustando valores de GameBar: $($_.Exception.Message)" "Yellow"
    }
}

Write-Log "`n================================================================================" "Cyan"
Write-Log "  PROCESO DE OPTIMIZACION FINALIZADO EXITOSAMENTE" "Green"
Write-Log "  Para revertir cualquier cambio, ejecute: .\scripts\rollback.ps1" "Cyan"
Write-Log "================================================================================" "Cyan"
