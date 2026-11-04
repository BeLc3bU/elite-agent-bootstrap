# Perfil de Rendimiento Gaming: Fortnite (Capítulo 5 / Unreal Engine 5)

## Objetivo
Máxima estabilidad de frametime (cero tirones al rotar o aterrizar) y alta tasa de cuadros (144-180 FPS) en 1440p competitivo.

---

## 1. Modo de Renderizado
* **Modo de Renderizado Recomendado**: **DirectX 12**.
  > *Por qué*: DX12 aprovecha a fondo el Ryzen 7 9800X3D y la arquitectura moderna de la RTX 5070 con compilación de shaders asíncrona. El modo Rendimiento (Performance Mode) es para CPUs/iGPUs antiguas y en hardware moderno de gama alta suele presentar problemas de streaming de texturas y frametimes inestables.

---

## 2. Configuración Gráfica Competitiva (1440p)
* **Resolución 3D**: 100% (Nativo 2560×1440) o **DLSS Calidad** si se desean exprimir los 180 FPS constantes.
* **Geometría Virtualizada Nanite**: Desactivada (para competición) o Activada (para gráficos visuales ultra).
* **Sombras**: Desactivadas (Off) para competición visual de enemigos en zonas oscuras.
* **Iluminación Global (Lumen)**: Desactivada (Off).
* **Reflejos**: Desactivados (Off).
* **Distancia de Visión**: Épica (Imprescindible para detectar rivales a larga distancia).
* **Texturas**: Media o Alta (12 GB VRAM lo soporta holgadamente).
* **Efectos**: Baja (Evita caídas durante tormentas y tiroteos con explosiones).
* **Post-procesado**: Baja.

---

## 3. Latencia y Sincronización
* **NVIDIA Reflex**: **On + Boost**.
* **Límite de FPS en Juego**: 180 FPS o Ilimitado con el limitador de NVIDIA a 177 FPS.
* **Permitir multiprocesamiento de renderizado**: Activado (On).
