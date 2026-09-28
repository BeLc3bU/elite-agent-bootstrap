#!/usr/bin/env bash
set -e

TARGET_DIR="${1:-$(pwd)}"
MODE="${2:-Auto}" # Auto, Existing, New
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SCAFFOLD_DIR="$TEMPLATE_ROOT/.specify/templates/scaffold"

echo "======================================================="
echo "🤖 Integrador Universal de Spec-Kit & Elite Agent"
echo "======================================================="
echo "Directorio Destino: $TARGET_DIR"

mkdir -p "$TARGET_DIR/.specify/memory"
mkdir -p "$TARGET_DIR/.specify/templates"
mkdir -p "$TARGET_DIR/.specify/scripts"
mkdir -p "$TARGET_DIR/specs"
mkdir -p "$TARGET_DIR/.github/prompts"
mkdir -p "$TARGET_DIR/.github/workflows"

# Copiar archivos base
cp -r "$TEMPLATE_ROOT/.specify/"* "$TARGET_DIR/.specify/"
cp -r "$TEMPLATE_ROOT/.github/prompts/"* "$TARGET_DIR/.github/prompts/"

if [ ! -f "$TARGET_DIR/specs/README.md" ]; then
    cp "$TEMPLATE_ROOT/specs/README.md" "$TARGET_DIR/specs/README.md"
fi

# Detección de stack y contexto
DETECTED_STACK="Stack genérico"
DEV_CMD="npm run dev"
BUILD_CMD="npm run build"
LINT_CMD="npm run lint"
TEST_CMD="npm test"
SRC_PATH="src/"
COMPONENTS_PATH="src/components/"
PROJECT_NAME="$(basename "$TARGET_DIR")"

if [ -f "$TARGET_DIR/package.json" ]; then
    DETECTED_STACK="Node.js / TypeScript / Web"
elif [ -f "$TARGET_DIR/pyproject.toml" ]; then
    DETECTED_STACK="Python (UV / Poetry)"
    DEV_CMD="uv run python main.py"
    BUILD_CMD="uv build"
    LINT_CMD="ruff check ."
    TEST_CMD="pytest"
    if [ -d "$TARGET_DIR/app" ]; then SRC_PATH="app/"; fi
elif [ -f "$TARGET_DIR/Cargo.toml" ]; then
    DETECTED_STACK="Rust (Cargo)"
    DEV_CMD="cargo run"
    BUILD_CMD="cargo build --release"
    LINT_CMD="cargo clippy"
    TEST_CMD="cargo test"
elif [ -f "$TARGET_DIR/go.mod" ]; then
    DETECTED_STACK="Go (Golang)"
    DEV_CMD="go run ."
    BUILD_CMD="go build"
    LINT_CMD="golangci-lint run"
    TEST_CMD="go test ./..."
fi

echo "🔍 Stack detectado: $DETECTED_STACK"

# Manejo de README.md
if [ -f "$TARGET_DIR/README.md" ]; then
    echo "ℹ️ README.md existente detectado. Generando SPECKIT_GUIDE.md sin tocar tu README."
    cp "$SCAFFOLD_DIR/SPECKIT_GUIDE.template.md" "$TARGET_DIR/SPECKIT_GUIDE.md"
else
    sed -e "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" \
        -e "s/{{PROJECT_DESCRIPTION}}/Proyecto desarrollado con metodología Spec-Driven Development (SDD)./g" \
        -e "s/{{PREREQUISITES}}/Entorno configurado para $DETECTED_STACK/g" \
        -e "s/{{INSTALL_COMMAND}}/npm install/g" \
        -e "s/{{DEV_COMMAND}}/$DEV_CMD/g" \
        -e "s/{{BUILD_COMMAND}}/$BUILD_CMD/g" \
        -e "s/{{TEST_COMMAND}}/$TEST_CMD/g" \
        -e "s/{{LINT_COMMAND}}/$LINT_CMD/g" \
        -e "s/{{PROJECT_TREE}}/├── src\/\n├── specs\/\n├── .specify\/\n└── PROJECT_LOG.md/g" \
        "$SCAFFOLD_DIR/README.project.template.md" > "$TARGET_DIR/README.md"
    echo "✅ Generado README.md para nuevo proyecto"
fi

# Manejo de AGENTS.md
if [ ! -f "$TARGET_DIR/AGENTS.md" ]; then
    sed -e "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" \
        -e "s/{{DEV_COMMAND}}/$DEV_CMD/g" \
        -e "s/{{BUILD_COMMAND}}/$BUILD_CMD/g" \
        -e "s/{{LINT_COMMAND}}/$LINT_CMD/g" \
        -e "s/{{TEST_COMMAND}}/$TEST_CMD/g" \
        -e "s/{{SRC_PATH}}/$SRC_PATH/g" \
        -e "s/{{COMPONENTS_PATH}}/$COMPONENTS_PATH/g" \
        -e "s/{{SPECIALIZED_AGENTS_LIST}}/| **SpecAgent** | Guardián de especificaciones y ciclo SDD | spec-kit |/g" \
        -e "s/{{PHASE_PLAN_CHECKLIST}}/- [ ] Fase 1: Integración y validación de especificaciones base.\n- [ ] Fase 2: Desarrollo continuo guiado por specs./g" \
        "$SCAFFOLD_DIR/AGENTS.new.template.md" > "$TARGET_DIR/AGENTS.md"
    echo "✅ Generado archivo: AGENTS.md"
else
    echo "ℹ️ AGENTS.md ya existe. Generando AGENTS.speckit.md para evitar sobreescritura."
    sed -e "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" \
        -e "s/{{DEV_COMMAND}}/$DEV_CMD/g" \
        -e "s/{{BUILD_COMMAND}}/$BUILD_CMD/g" \
        -e "s/{{LINT_COMMAND}}/$LINT_CMD/g" \
        -e "s/{{TEST_COMMAND}}/$TEST_CMD/g" \
        -e "s/{{SRC_PATH}}/$SRC_PATH/g" \
        -e "s/{{COMPONENTS_PATH}}/$COMPONENTS_PATH/g" \
        -e "s/{{SPECIALIZED_AGENTS_LIST}}/| **SpecAgent** | Guardián de especificaciones y ciclo SDD | spec-kit |/g" \
        -e "s/{{PHASE_PLAN_CHECKLIST}}/- [ ] Fase 1: Integración y validación de especificaciones base.\n- [ ] Fase 2: Desarrollo continuo guiado por specs./g" \
        "$SCAFFOLD_DIR/AGENTS.new.template.md" > "$TARGET_DIR/AGENTS.speckit.md"
fi

# Generar PROJECT_LOG.md si no existe o append
if [ ! -f "$TARGET_DIR/PROJECT_LOG.md" ]; then
    cat << EOF > "$TARGET_DIR/PROJECT_LOG.md"
# 📋 Registro de Decisiones y Memoria del Proyecto (PROJECT_LOG.md)

## [$(date +%Y-%m-%d)] - Integración de Spec-Kit
- **Evento**: Integración no destructiva de Spec-Kit.
- **Stack Detectado**: $DETECTED_STACK
- **Directrices**: Especificación formal mediante \`.specify/\` y \`specs/\`.
EOF
    echo "✅ Generado archivo: PROJECT_LOG.md"
fi

# Generar .cursorrules si no existe o append
if [ ! -f "$TARGET_DIR/.cursorrules" ]; then
    cat << 'EOF' > "$TARGET_DIR/.cursorrules"
# Reglas de Proyecto - Spec-Kit & Elite Agent
1. Idioma: Toda respuesta, commit y documentación DEBE ser en Español.
2. Metodología: Spec-Driven Development (SDD). No escribir código sin spec/plan/tasks en specs/.
3. Guardrails: No comitear ni abrir PRs con errores de lint, typecheck o tests.
4. Consulta .specify/memory/constitution.md para principios inmutables.
EOF
    echo "✅ Generado archivo: .cursorrules"
fi

# Copiar workflow de release-please si existe
if [ -f "$TEMPLATE_ROOT/.github/workflows/release-please.yml" ] && [ ! -f "$TARGET_DIR/.github/workflows/release-please.yml" ]; then
    cp "$TEMPLATE_ROOT/.github/workflows/release-please.yml" "$TARGET_DIR/.github/workflows/release-please.yml"
    echo "✅ Configurado GitHub Action: release-please.yml"
fi

echo ""
echo "======================================================="
echo "🎉 ¡Integración completada con éxito!"
echo "Comandos disponibles con tu IA:"
echo "  👉 /speckit.specify"
echo "  👉 /speckit.plan"
echo "  👉 /speckit.tasks"
echo "  👉 /speckit.implement"
echo "  👉 /speckit.converge"
echo "======================================================="
