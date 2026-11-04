<#
.SYNOPSIS
    Script de Auditoria Integral de Hardware, Windows, NVIDIA, Red y Rendimiento para Gaming.
.DESCRIPTION
    Realiza una recopilacion de datos no destructiva y genera un informe estructurado.
#>

[CmdletBinding()]
param(
    [string]$OutputPath = "$PSScriptRoot\..\reports\before\gaming_optimization_before.txt"
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

# 1. FECHA Y HORA
Log-Section "1. METADATOS DE AUDITORIA"
Log-Data "Fecha y Hora" (Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz")
Log-Data "Equipo (Hostname)" $env:COMPUTERNAME
Log-Data "Usuario Actual" $env:USERNAME

# 2. PROCESADOR Y PLACA BASE
Log-Section "2. CPU Y PLACA BASE"
try {
    $cpu = Get-CimInstance Win32_Processor
    Log-Data "Modelo CPU" $cpu.Name
    Log-Data "Nucleos Fisicos" $cpu.NumberOfCores
    Log-Data "Hilos Logicos" $cpu.NumberOfLogicalProcessors
    Log-Data "Frecuencia Base (MHz)" $cpu.MaxClockSpeed
    Log-Data "Voltaje Actual (V)" ($cpu.CurrentVoltage / 10)
    Log-Data "ID del Socket" $cpu.SocketDesignation
} catch {
    Log-Data "Error CPU" $_.Exception.Message
}

try {
    $board = Get-CimInstance Win32_BaseBoard
    Log-Data "Fabricante Placa" $board.Manufacturer
    Log-Data "Modelo Placa" $board.Product
    Log-Data "Version Placa" $board.Version
} catch {
    Log-Data "Error Placa" $_.Exception.Message
}

try {
    $bios = Get-CimInstance Win32_BIOS
    Log-Data "Fabricante BIOS" $bios.Manufacturer
    Log-Data "Version BIOS (SMBIOS)" $bios.SMBIOSBIOSVersion
    Log-Data "Fecha BIOS" $bios.ReleaseDate
} catch {
    Log-Data "Error BIOS" $_.Exception.Message
}

# 3. MEMORIA RAM
Log-Section "3. MEMORIA RAM (EXPO / XMP Y CANALES)"
try {
    $dimms = Get-CimInstance Win32_PhysicalMemory
    $dimmCount = $dimms.Count
    Log-Data "Modulos Instalados" $dimmCount
    $index = 1
    foreach ($d in $dimms) {
        $capGB = [math]::Round($d.Capacity / 1GB, 2)
        $speed = $d.Speed
        $cfgSpeed = $d.ConfiguredClockSpeed
        Log-Data "Modulo #$index Ranura" "$($d.BankLabel) / $($d.DeviceLocator)"
        Log-Data "Modulo #$index Modelo" "$($d.Manufacturer) $($d.PartNumber)"
        Log-Data "Modulo #$index Capacidad" "$capGB GB"
        Log-Data "Modulo #$index Frecuencia Base" "$speed MT/s"
        Log-Data "Modulo #$index Frecuencia Configurada" "$cfgSpeed MT/s"
        if ($cfgSpeed -lt 6000) {
            Log-Data "ALERTA RAM" "El modulo esta funcionando a $cfgSpeed MT/s (SPD base) en vez del perfil EXPO/XMP (6000 MT/s)."
        }
        $index++
    }
} catch {
    Log-Data "Error RAM" $_.Exception.Message
}

# 4. TARJETAS GRAFICAS Y DRIVERS
Log-Section "4. TARJETAS GRAFICAS Y CONTROLADORES"
try {
    $gpus = Get-CimInstance Win32_VideoController
    foreach ($g in $gpus) {
        Log-Data "GPU Detectada" $g.Name
        Log-Data "  Driver Version" $g.DriverVersion
        Log-Data "  Driver Date" $g.DriverDate
        Log-Data "  Refresh Actual (Hz)" $g.CurrentRefreshRate
        Log-Data "  Resolucion Actual" "$($g.CurrentHorizontalResolution)x$($g.CurrentVerticalResolution)"
    }
} catch {
    Log-Data "Error GPUs WMI" $_.Exception.Message
}

# NVIDIA-SMI DETALLE
Log-Section "5. ESTADO DETALLADO NVIDIA (RTX 5070)"
try {
    $smiOut = & nvidia-smi --query-gpu=name,driver_version,pcie.link.gen.current,pcie.link.gen.max,pcie.link.width.current,pcie.link.width.max,temperature.gpu,utilization.gpu,memory.total,memory.free,memory.used,power.draw,power.limit --format=csv,noheader
    if ($smiOut) {
        $parts = $smiOut -split ',' | ForEach-Object { $_.Trim() }
        Log-Data "NVIDIA Modelo" $parts[0]
        Log-Data "Driver NVIDIA" $parts[1]
        Log-Data "PCIe Link Actual / Max" "Gen $($parts[2]) x$($parts[4]) / Gen $($parts[3]) x$($parts[5])"
        Log-Data "Temperatura GPU Idle" "$($parts[6]) C"
        Log-Data "Uso GPU Actual" "$($parts[7])"
        Log-Data "VRAM Total" "$($parts[8])"
        Log-Data "VRAM Libre" "$($parts[9])"
        Log-Data "Consumo Energetico Actual" "$($parts[11])"
        Log-Data "Power Limit Max" "$($parts[12])"
    }

    $bar1 = & nvidia-smi -q -d MEMORY | Select-String "BAR1 Memory Usage" -Context 0, 3
    if ($bar1) {
        $report.Add("Detalle Resizable BAR:")
        $bar1.Context.PostContext | ForEach-Object { $report.Add("  $_") }
    }
} catch {
    Log-Data "nvidia-smi" "No disponible o fallo al ejecutar: $($_.Exception.Message)"
}

# 6. MONITORES Y RESOLUCION
Log-Section "6. MONITORES Y CONFIGURACION DE PANTALLA"
try {
    Add-Type -AssemblyName System.Windows.Forms
    $screens = [System.Windows.Forms.Screen]::AllScreens
    $sIdx = 1
    foreach ($s in $screens) {
        $isPri = if ($s.Primary) { "SI (Monitor Principal)" } else { "NO (Secundario)" }
        Log-Data "Monitor #$sIdx Dispositivo" $s.DeviceName
        Log-Data "Monitor #$sIdx Es Principal" $isPri
        Log-Data "Monitor #$sIdx Resolucion/Limites" "$($s.Bounds.Width)x$($s.Bounds.Height) (X=$($s.Bounds.X), Y=$($s.Bounds.Y))"
        $sIdx++
    }

    $monitorsPnp = Get-PnpDevice -Class Monitor -ErrorAction SilentlyContinue | Where-Object { $_.Present -eq $true }
    foreach ($m in $monitorsPnp) {
        Log-Data "Monitor Conectado (PnP)" "$($m.FriendlyName) [ID: $($m.InstanceId)]"
    }
} catch {
    Log-Data "Error Monitores" $_.Exception.Message
}

# 7. SISTEMA OPERATIVO Y CARACTERISTICAS GAMING
Log-Section "7. SISTEMA OPERATIVO Y AJUSTES GAMING"
try {
    $winReg = Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion'
    Log-Data "Windows Producto" $winReg.ProductName
    Log-Data "Version Display" $winReg.DisplayVersion
    Log-Data "Build y Revision" "$($winReg.CurrentBuild).$($winReg.UBR)"
    Log-Data "Edicion" $winReg.EditionID

    # Modo de Energia
    $activeScheme = powercfg /getactivescheme
    Log-Data "Plan de Energia Activo" $activeScheme

    # HAGS (Hardware Accelerated GPU Scheduling)
    $hagsReg = (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -ErrorAction SilentlyContinue).HwSchMode
    $hagsText = switch ($hagsReg) {
        2 { "Activado (2)" }
        1 { "Desactivado (1)" }
        default { "Predeterminado de Windows (No configurado en registro: valor $hagsReg)" }
    }
    Log-Data "HAGS (Programacion GPU)" $hagsText

    # Modo Juego (Game Mode)
    $gbReg = (Get-ItemProperty 'HKCU:\Software\Microsoft\GameBar' -ErrorAction SilentlyContinue).AllowAutoGameMode
    $gameModeText = if ($null -eq $gbReg -or $gbReg -eq 1) { "Activado (1 / Default)" } else { "Desactivado ($gbReg)" }
    Log-Data "Modo Juego de Windows" $gameModeText

    # Game Bar
    $gbNexus = (Get-ItemProperty 'HKCU:\Software\Microsoft\GameBar' -ErrorAction SilentlyContinue).UseNexusForGameBarEnabled
    Log-Data "Xbox Game Bar Habilitada" $(if ($gbNexus -eq 0) { "Desactivada (0)" } else { "Activada ($gbNexus)" })

    # VBS / Memory Integrity
    $dg = Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard -ErrorAction SilentlyContinue
    $vbsStatus = if ($dg) { $dg.VirtualizationBasedSecurityStatus } else { "N/A" }
    Log-Data "VBS (Virtualization-Based Security)" $(if ($vbsStatus -eq 0) { "Desactivado (0)" } else { "Activo ($vbsStatus)" })

    $hvci = (Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -ErrorAction SilentlyContinue).Enabled
    Log-Data "Memory Integrity (HVCI)" $(if ($hvci -eq 1) { "Activado (1)" } else { "Desactivado (0 o no configurado)" })
} catch {
    Log-Data "Error OS" $_.Exception.Message
}

# 8. ALMACENAMIENTO Y TRIM
Log-Section "8. ALMACENAMIENTO, ESPACIO Y TRIM"
try {
    $pDisks = Get-PhysicalDisk
    foreach ($pd in $pDisks) {
        $sizeGB = [math]::Round($pd.Size / 1GB, 2)
        Log-Data "Disco Fisico" "$($pd.FriendlyName) ($($pd.MediaType), $($pd.BusType), $sizeGB GB)"
        Log-Data "  Estado de Salud" "$($pd.HealthStatus) (Operacional: $($pd.OperationalStatus))"
    }

    $vols = Get-Volume | Where-Object { $_.DriveLetter -ne $null }
    foreach ($v in $vols) {
        $freeGB = [math]::Round($v.SizeRemaining / 1GB, 2)
        $totGB = [math]::Round($v.Size / 1GB, 2)
        $pctFree = [math]::Round(($freeGB / $totGB) * 100, 1)
        Log-Data "Volumen $($v.DriveLetter):" "Libre: $freeGB GB de $totGB GB ($pctFree% libre)"
    }

    $trimQuery = fsutil behavior query DisableDeleteNotify
    Log-Data "Estado TRIM (DisableDeleteNotify)" ($trimQuery -join ' ')
} catch {
    Log-Data "Error Almacenamiento" $_.Exception.Message
}

# 9. RED Y LATENCIA
Log-Section "9. CONEXION DE RED Y LATENCIA"
try {
    $adapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' }
    foreach ($a in $adapters) {
        Log-Data "Adaptador Activo" "$($a.Name) - $($a.InterfaceDescription)"
        Log-Data "  Velocidad Enlace" $a.LinkSpeed
        Log-Data "  Estado" $a.Status
    }

    # Ping latencia a Cloudflare y Google
    $pingCF = Test-Connection -ComputerName 1.1.1.1 -Count 4 -ErrorAction SilentlyContinue
    if ($pingCF) {
        $avgPing = [math]::Round(($pingCF | Measure-Object -Property ResponseTime -Average).Average, 1)
        $minPing = ($pingCF | Measure-Object -Property ResponseTime -Minimum).Minimum
        $maxPing = ($pingCF | Measure-Object -Property ResponseTime -Maximum).Maximum
        Log-Data "Ping a 1.1.1.1 (Cloudflare)" "Promedio: $avgPing ms (Min: $minPing ms, Max: $maxPing ms)"
    } else {
        Log-Data "Ping a 1.1.1.1" "Fallo o bloqueado por firewall ICMP"
    }

    $dnsServers = (Get-DnsClientServerAddress -InterfaceAlias 'Ethernet 3' -AddressFamily IPv4 -ErrorAction SilentlyContinue).ServerAddresses
    Log-Data "DNS IPv4 Configurado" ($dnsServers -join ', ')
} catch {
    Log-Data "Error Red" $_.Exception.Message
}

# 10. APLICACIONES DE INICIO Y PROCESOS RESIDENTES
Log-Section "10. PROCESOS EN SEGUNDO PLANO Y AUTO-INICIO"
try {
    $startups = Get-CimInstance Win32_StartupCommand
    $report.Add("Lista de Software de Inicio (Startup Apps):")
    foreach ($st in $startups) {
        $report.Add("  - $($st.Name) | $($st.Command) | Ubicacion: $($st.Location)")
    }

    # Top procesos RAM
    $report.Add("")
    $report.Add("Top 15 Procesos por Consumo de RAM:")
    $topProcs = Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 15
    foreach ($p in $topProcs) {
        $ramMB = [math]::Round($p.WorkingSet64 / 1MB, 1)
        $report.Add(("    {0,-30} : {1,8} MB | CPU: {2:N2} s" -f $p.ProcessName, $ramMB, $p.CPU))
    }
} catch {
    Log-Data "Error Procesos" $_.Exception.Message
}

# 11. DETECCION DE JUEGOS INSTALADOS
Log-Section "11. JUEGOS Y PLATAFORMAS DETECTADAS"
try {
    $gamePaths = @(
        "C:\Program Files (x86)\Steam\steamapps\common",
        "C:\Program Files\Epic Games",
        "C:\Games",
        "C:\Riot Games",
        "C:\XboxGames"
    )
    foreach ($gp in $gamePaths) {
        if (Test-Path $gp) {
            $report.Add("Directorio detectado: $gp")
            Get-ChildItem -Path $gp -Directory -ErrorAction SilentlyContinue | ForEach-Object {
                $report.Add("  -> Juego/Carpeta: $($_.Name)")
                Write-Host "  -> Juego detectado: $($_.Name)" -ForegroundColor Green
            }
        }
    }

    # Comprobar registro de Steam instalado
    $steamReg = Get-ItemProperty 'HKCU:\Software\Valve\Steam' -ErrorAction SilentlyContinue
    if ($steamReg) {
        Log-Data "Steam Path" $steamReg.SteamPath
    }
} catch {
    Log-Data "Error Deteccion Juegos" $_.Exception.Message
}

# GUARDAR INFORME
$outputDir = Split-Path -Parent $OutputPath
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}
$report | Out-File -FilePath $OutputPath -Encoding UTF8
Write-Host "`n[COMPLETADO] Auditoria guardada exitosamente en: $OutputPath" -ForegroundColor Green
