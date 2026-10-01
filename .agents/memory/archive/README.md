# 🗄️ Archivo Histórico de Memorias Deprecadas (.agents/memory/archive/)

Este directorio almacena aquellas entradas de memoria persistente que han quedado obsoletas (`status: stale` o `status: archived`), o que han sido formalmente promovidas a **ADR** en `PROJECT_LOG.md` o a la Constitución.

---

## 📌 Propósito y Política de Archivado
1. **No Destrucción**: Las memorias antiguas no se borran; se mueven a este directorio para conservar la trazabilidad histórica del razonamiento técnico.
2. **Exclusión de Consultas Activas**: Las memorias archivadas no se cargan durante las sesiones operativas normales de los agentes, manteniendo el contexto limpio y libre de contradicciones.
3. **Mecanismo de Traslado**: Para archivar una memoria se utiliza el comando:
   ```bash
   node bin/cli.js memory archive <MEM-ID>
   ```
   El cual actualiza el estado a `archived`, anota la fecha de archivado y la mueve a este directorio.
