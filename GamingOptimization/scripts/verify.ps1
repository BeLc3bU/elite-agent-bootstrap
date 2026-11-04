<#
.SYNOPSIS
    Script de Verificacion Post-Optimizacion Gaming.
.DESCRIPTION
    Audita el estado actual y genera el informe comparativo post-optimizacion.
#>

[CmdletBinding()]
param(
    [string]$OutputPath = "$PSScriptRoot\..\reports\after\gaming_optimization_after.txt"
)

$ErrorActionPreference = 'Continue'
$report = [System.Collections.Generic.List[string]]::new()

function Log-Section($title) {
    $sep = "=" * 80
    $report.Add("")
    $report.Add($sep)
    $report.Add("  $title")
    $report.Add($sep)
    $report.Add("")
    Write-Host "[$title]" -ForegroundColor Cyan
}

function Log-Data($name, $value) {
    $line = "{0,-35} : {1}" -f $name, $value
    $report.Add($line)
    Write-Host $line
}

Log-Section "1. VERIFICACION DE ESTADO TRAS OPTIMIZACION"
Log-Data "Fecha de Verificacion" (Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz")
Log-Data "Equipo" $env:COMPUTERNAME

# 1. APLICACIONES DE INICIO ACTUALES
Log-Section "2. ESTADO DE APLICACIONES DE INICIO (HKCU & HKLM RUN)"
$hkcuRun = Get-ItemProperty 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -ErrorAction SilentlyContinue
if ($hkcuRun) {
    $hkcuProps = $hkcuRun.PSObject.Properties | Where-Object { $_.Name -notmatch '^PS' }
    foreach ($p in $hkcuProps) {
        Log-Data "HKCU Activo" "$($p.Name) -> $($p.Value)"
    }
} else {
    Log-Data "HKCU Activo" "Ninguna entrada"
}

$hklmRun = Get-ItemProperty 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Run' -ErrorAction SilentlyContinue
if ($hklmRun) {
    $hklmProps = $hklmRun.PSObject.Properties | Where-Object { $_.Name -notmatch '^PS' }
    foreach ($p in $hklmProps) {
        Log-Data "HKLM Activo" "$($p.Name) -> $($p.Value)"
    }
}

# 2. ESTADO DE SERVICIOS OEM
Log-Section "3. ESTADO DE SERVICIOS OEM (DPC POLLING)"
$targetServices = @('EasyTuneEngineService', 'GigabyteUpdateService', 'UrbanVPN-Service')
foreach ($sName in $targetServices) {
    $svc = Get-Service -Name $sName -ErrorAction SilentlyContinue
    if ($svc) {
        Log-Data "Servicio $sName" "Estado: $($svc.Status) | Tipo Inicio: $($svc.StartType)"
    } else {
        Log-Data "Servicio $sName" "No existe en el sistema"
    }
}

# 3. ESTADO DE RED
Log-Section "4. PROPIEDADES ENERGETICAS ADAPTADOR REALTEK 2.5GbE"
$nicProps = Get-NetAdapterAdvancedProperty -Name 'Ethernet 3' -ErrorAction SilentlyContinue
if ($nicProps) {
    foreach ($p in $nicProps) {
        if ($p.RegistryKeyword -in @('EnableGreenEthernet', 'PowerSavingMode', 'GigaLite', 'AdvancedEEE', '*EEE')) {
            Log-Data "$($p.DisplayName) ($($p.RegistryKeyword))" $p.DisplayValue
        }
    }
}

# Ping latencia
$ping = Test-Connection -ComputerName 1.1.1.1 -Count 4 -ErrorAction SilentlyContinue
if ($ping) {
    $avg = [math]::Round(($ping | Measure-Object -Property ResponseTime -Average).Average, 1)
    Log-Data "Latencia Cloudflare (1.1.1.1)" "$avg ms"
}

# 4. MODO JUEGO Y GAME DVR
Log-Section "5. WINDOWS MODO JUEGO Y GAME DVR"
$gameMode = (Get-ItemProperty 'HKCU:\Software\Microsoft\GameBar' -ErrorAction SilentlyContinue).AllowAutoGameMode
Log-Data "Modo Juego (AllowAutoGameMode)" $(if ($gameMode -eq 1) { "1 (Activado)" } else { "$gameMode" })

$dvr = (Get-ItemProperty 'HKCU:\System\GameConfigStore' -ErrorAction SilentlyContinue).GameDVR_Enabled
Log-Data "Game DVR Background Recording" $(if ($dvr -eq 0) { "0 (Desactivado - Optimo)" } else { "$dvr" })

# 5. DIAGNOSTICO DE HARDWARE / BIOS PENDIENTE
Log-Section "6. RECORDATORIO CRITICO DE HARDWARE (REQUIERE ACCION EN BIOS)"
$dimms = Get-CimInstance Win32_PhysicalMemory
$spd = ($dimms | Select-Object -First 1).ConfiguredClockSpeed
if ($spd -lt 6000) {
    Log-Data "ESTADO MEMORIA RAM" "ACTUAL: $spd MT/s. ACCION REQUERIDA: Habilitar EXPO 1 en BIOS para alcanzar 6000 MT/s CL30."
} else {
    Log-Data "ESTADO MEMORIA RAM" "EXPO 6000 MT/s ACTIVO."
}

# GUARDAR
$outputDir = Split-Path -Parent $OutputPath
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}
$report | Out-File -FilePath $OutputPath -Encoding UTF8
Write-Host "`n[COMPLETADO] Verificacion guardada en: $OutputPath" -ForegroundColor Green
