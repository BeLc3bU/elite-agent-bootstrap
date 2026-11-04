# Perfil de Rendimiento Gaming: S.T.A.L.K.E.R. 2: Heart of Chornobyl

## Objetivo
Equilibrio cinematográfico y fluidez sólida a 1440p (80-120+ FPS) con Unreal Engine 5 (Lumen + Nanite) en RTX 5070 (12 GB VRAM) y Ryzen 7 9800X3D.

---

## 1. Configuración de Pantalla y Escalado
* **Resolución**: 2560×1440.
* **Modo de Ventana**: Pantalla Completa sin bordes (Borderless) o Exclusiva.
* **Escalador (Upscaler)**: **NVIDIA DLSS Super Resolution**.
* **Modo DLSS**: **Calidad (Quality)** (Renderiza a 1707×960 con reconstrucción de IA de 4ª gen en Tensor Cores).
* **NVIDIA DLSS Frame Generation**: **Activado (On)** (Especialmente beneficioso en UE5 para duplicar la fluidez sin aumentar la carga de CPU/hilos).
* **NVIDIA Reflex**: **Activado (On)** (Obligatorio con Frame Generation para mitigar el pequeño retraso del frame interpolado).

---

## 2. Ajustes Gráficos Clave en S.T.A.L.K.E.R. 2
* **Calidad de Texturas**: Alta o Épica (La RTX 5070 cuenta con 12 GB GDDR7 de altísima velocidad; con DLSS Calidad consume ~9.5 GB a 1440p, manteniéndose cómodamente dentro del búfer).
* **Calidad de Sombras**: Media / Alta (Las sombras épicas en UE5 tienen un coste cuadrático desproporcionado en SSR/Lumen).
* **Iluminación Global (Lumen)**: Alta (Ofrece el balance perfecto entre rebotes lumínicos realistas y frametime estable).
* **Efectos Post-procesado**: Medio.
* **Distancia de Visión**: Alta.
* **Desenfoque de movimiento (Motion Blur)**: Desactivado (Off).
* **Profundidad de campo (Depth of Field)**: A gusto del usuario (desactivado mejora la claridad).

---

## 3. Caché de Sombreadores
* Asegurar que en el Panel de Control de NVIDIA el **Shader Cache Size** esté fijado en **10 GB** para evitar que la compilación de PSO (Pipeline State Objects) de Unreal Engine 5 cause stutters en la Zona de Exclusión.
