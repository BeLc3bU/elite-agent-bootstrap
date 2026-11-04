# Perfil de Rendimiento Gaming: Counter-Strike 2 (CS2)

## Objetivo
Máximos FPS competitivos, frametimes consistentes (1% Lows ultra estables), latencia mínima de entrada (input lag imperceptible) a 1440p nativo.

---

## 1. Configuración de Pantalla y Sincronización
* **Resolución**: 2560×1440 (Nativa) o 1920×1440 (4:3 Stretched si se busca preferencia competitiva de modelos anchos).
* **Frecuencia de Refresco**: 180 Hz.
* **Modo de Pantalla**: Pantalla Completa Exclusiva (Fullscreen).
* **NVIDIA G-SYNC**: Activado en NVIDIA Control Panel.
* **V-Sync en Juego**: Desactivado (Disabled).
* **NVIDIA Reflex en Juego**: **Activado + Boost (Enabled + Boost)**.
  > *Nota*: Al activar Reflex + Boost, el motor Source 2 ajusta automáticamente la tasa de cuadros dentro del rango G-Sync y minimiza la latencia de cola de renderizado de la GPU.

---

## 2. Ajustes Gráficos en CS2
* **Modo de filtrado de texturas**: Anisotrópico 4X u 8X (Cero impacto en FPS con la RTX 5070, nitidez nítida en ángulos rasantes).
* **Calidad global de sombras**: Alta (Imprescindible para ver sombras de oponentes a través de esquinas).
* **Detalle de modelos y texturas**: Medio o Bajo (Maximiza claridad visual de los modelos de jugadores).
* **Detalle de sombreadores (Shaders)**: Bajo.
* **Detalle de partículas**: Bajo (Evita caídas de frametime durante granadas HE y fuegos de molotov).
* **Oclusión ambiental**: Desactivada (Disabled).
* **High Dynamic Range (HDR)**: Rendimiento (Performance).
* **FidelityFX Super Resolution (FSR)**: Desactivado (Calidad nativa 100%). Nunca activar FSR en CS2 teniendo una RTX 5070.

---

## 3. Comandos de Lanzamiento Recomendados (Steam Launch Options)
`-novid -nojoy +cl_updaterate 128 +cl_interp 0.015625`
*(Evitar comandos obsoletos como `-threads` arbitrarios o `-high`, el Ryzen 7 9800X3D gestiona el scheduler óptimamente en Windows 11).*
