#!/usr/bin/env bash
set -e

if [ "$#" -lt 2 ]; then
    echo "Uso: $0 <FEATURE_ID> <FEATURE_NAME>"
    echo "Ejemplo: $0 001 auth-jwt"
    exit 1
fi

FEATURE_ID="$1"
FEATURE_NAME="$2"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SLUG="${FEATURE_ID}-${FEATURE_NAME//[^a-zA-Z0-9_-]/-}"
TARGET_DIR="$ROOT_DIR/specs/$SLUG"
TEMPLATES_DIR="$ROOT_DIR/.specify/templates"

if [ -d "$TARGET_DIR" ]; then
    echo "Advertencia: El directorio de la feature ya existe: $TARGET_DIR"
    exit 0
fi

mkdir -p "$TARGET_DIR"
echo "Creando especificación en: $TARGET_DIR"

DATE=$(date +%Y-%m-%d)

# Función para reemplazar placeholders y escribir archivo
process_template() {
    local src="$1"
    local dest="$2"
    sed -e "s/\[NOMBRE_FEATURE\]/$FEATURE_NAME/g" \
        -e "s/\[ID_FEATURE\]/$FEATURE_ID/g" \
        -e "s/\[YYYY-MM-DD\]/$DATE/g" \
        "$src" > "$dest"
}

process_template "$TEMPLATES_DIR/spec-template.md" "$TARGET_DIR/spec.md"
process_template "$TEMPLATES_DIR/plan-template.md" "$TARGET_DIR/plan.md"
process_template "$TEMPLATES_DIR/tasks-template.md" "$TARGET_DIR/tasks.md"
process_template "$TEMPLATES_DIR/clarify-template.md" "$TARGET_DIR/clarify.md"
process_template "$TEMPLATES_DIR/checklist-template.md" "$TARGET_DIR/checklist.md"

echo "Feature '$SLUG' inicializada correctamente con todas sus plantillas."
echo "Comienza editando 'specs/$SLUG/spec.md' o ejecutando /speckit.specify"
