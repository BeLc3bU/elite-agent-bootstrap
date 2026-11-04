# Perfil de Rendimiento Gaming: Call of Duty: Black Ops III

## Objetivo
180 FPS ultra fluidos en modo Zombies y Multijugador a 1440p, solventando los conocidos problemas de asignación de hilos de la CPU y stuttering en Windows 11.

---

## 1. Corrección Crítica del Motor (Archivo config.ini)
El motor de Black Ops III tiene un bug histórico en procesadores con más de 8 hilos físicos donde asigna incorrectamente los hilos de renderizado provocando micro-congelamientos.
* Ubicación: `C:\Program Files (x86)\Steam\steamapps\common\Call of Duty Black Ops III\players\config.ini`
* Parámetro a verificar/ajustar:
  ```ini
  // Thread count for handling the job queue
  WorkerThreads = 8  // (Ajustar a 8 hilos correspondientes a los 8 núcleos físicos del 9800X3D)
  ```

---

## 2. Ajustes Gráficos en el Juego
* **Resolución**: 2560×1440.
* **Tasa de Refresco**: 180 Hz.
* **V-Sync**: Desactivado (Off).
* **Max FPS**: 177 FPS.
* **Calidad de Texturas**: Extra.
* **Filtrado de Texturas**: Alto.
* **Calidad de Mallas**: Alta.
* **Sombras**: Media.
* **Desenfoque de movimiento**: Desactivado.
* **Orden de renderizado transparente**: Activado.
