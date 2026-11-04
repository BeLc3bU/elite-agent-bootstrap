# Suite Profesional de Optimización Gaming: Elite PC Architecture

Repositorio y herramientas de ingeniería para la auditoría, optimización segura, reversión y calibración de rendimiento en entornos Windows 11 para gaming competitivo y de alta fidelidad a 1440p.

---

## 💻 Hardware Auditado y Validado
* **Procesador**: AMD Ryzen 7 9800X3D (8C / 16T, 2nd Gen 3D V-Cache, AM5)
* **Placa Base**: Gigabyte B650M D3HP (BIOS FA8)
* **Memoria RAM**: 32 GB (2x16GB) A-DATA XPG Lancer Blade RGB DDR5-6000 CL30 (`AX5U6000C3016G-DTLABRBK`)
* **Tarjeta Gráfica**: NVIDIA GeForce RTX 5070 (Arquitectura Blackwell, 12 GB GDDR7 VRAM, PCIe Gen 4 x16, 250W TDP, Driver 617.14)
* **Almacenamiento**: ADATA LEGEND 860 NVMe SSD 1 TB (PCIe Gen 4.0 x4)
* **Pantallas**:
  * **Principal**: Gigabyte GS27QA (2560×1440 @ 180 Hz IPS, FreeSync Premium / G-Sync Compatible)
  * **Secundaria**: AOC Q27G4 (1440×2560 Vertical @ 180 Hz Fast IPS)
* **Red**: Realtek 2.5GbE Family Controller (1 Gbps negociado, 7.2 ms latencia promedio a Cloudflare)

---

## 📁 Estructura del Directorio
```text
GamingOptimization/
├── README.md               # Este documento explicativo
├── reports/
│   ├── before/             # Auditoría inicial completa (gaming_optimization_before.txt)
│   └── after/              # Verificación post-optimización (gaming_optimization_after.txt)
├── backups/                # Snapshots de registro y estado (.json y .reg) para rollback inmutable
├── scripts/
│   ├── audit.ps1           # Recopilación exhaustiva de métricas de HW, SO, red y GPU
│   ├── optimize.ps1        # Aplicación de optimizaciones Nivel 1 (Seguro) con flags -DryRun
│   ├── rollback.ps1        # Reversión garantizada al estado original registrado
│   └── verify.ps1          # Comprobación de estado del sistema y alertas de hardware
├── profiles/               # Guías y perfiles de configuración para juegos instalados
│   ├── CS2.md              # Counter-Strike 2
│   ├── STALKER2.md         # S.T.A.L.K.E.R. 2 Heart of Chornobyl
│   ├── Fortnite.md         # Fortnite (Capítulo 5 / DX12)
│   ├── Overwatch2.md       # Overwatch 2
│   ├── BlackOps3.md        # Call of Duty Black Ops III
│   └── ULTRAKILL.md        # ULTRAKILL
└── logs/                   # Registro cronológico de ejecuciones
```

---

## 🚀 Uso de Scripts PowerShell

### 1. Simulación previa (Dry-Run)
Para comprobar exactamente qué modificaciones se realizarán sin alterar ningún valor:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\optimize.ps1 -DryRun
```

### 2. Aplicar optimizaciones seguras
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\optimize.ps1
```

### 3. Reversión completa (Rollback)
Para restaurar el sistema al estado original exacto registrado en el backup:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\rollback.ps1
```

### 4. Verificación del estado del sistema
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify.ps1
```

---

## 🛡️ Principios de Seguridad y Calidad
1. **Zero Mitos**: Sin scripts agresivos de "debloat", sin desactivar Windows Defender ni Windows Update, sin alterar timers de HPET de forma artificial.
2. **Reversibilidad Inmutable**: Cada cambio tiene un backup JSON en `backups/` con timestamp.
3. **Prioridad en Frametime y 1% Lows**: La estabilidad y eliminación de stutters prevalece sobre números de FPS pico vacíos.
