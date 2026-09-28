#!/usr/bin/env bash
set -e

FEATURE_FOLDER="$1"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SPECS_ROOT="$ROOT_DIR/specs"

if [ ! -d "$SPECS_ROOT" ]; then
    echo "Advertencia: No existe la carpeta specs/ en el repositorio."
    exit 0
fi

echo "=== Estado de Especificaciones y Tareas ==="

for folder in "$SPECS_ROOT"/*; do
    if [ -d "$folder" ]; then
        if [ -n "$FEATURE_FOLDER" ] && [ "$(basename "$folder")" != "$FEATURE_FOLDER" ]; then
            continue
        fi

        FOLDER_NAME=$(basename "$folder")
        SPEC_FILE="$folder/spec.md"
        PLAN_FILE="$folder/plan.md"
        TASKS_FILE="$folder/tasks.md"

        echo ""
        echo "📁 Feature: $FOLDER_NAME"
        [ -f "$SPEC_FILE" ] && echo "   - spec.md: ✅ Presente" || echo "   - spec.md: ❌ Faltante"
        [ -f "$PLAN_FILE" ] && echo "   - plan.md: ✅ Presente" || echo "   - plan.md: ❌ Faltante"
        [ -f "$TASKS_FILE" ] && echo "   - tasks.md: ✅ Presente" || echo "   - tasks.md: ❌ Faltante"

        if [ -f "$TASKS_FILE" ]; then
            TOTAL_TASKS=$(grep -E '^- \[[ x]\] \*\*`\[TASK-' "$TASKS_FILE" | wc -l || true)
            DONE_TASKS=$(grep -E '^- \[x\] \*\*`\[TASK-' "$TASKS_FILE" | wc -l || true)
            if [ "$TOTAL_TASKS" -gt 0 ]; then
                echo "   - Tareas: $DONE_TASKS / $TOTAL_TASKS completadas"
            else
                echo "   - Tareas: Sin formato [TASK-XXX]"
            fi
        fi
    fi
done

echo ""
echo "==========================================="
