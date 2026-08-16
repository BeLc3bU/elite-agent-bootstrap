#!/usr/bin/env bash
# =====================================================================
# Instalador Remoto Universal - Elite Agent + Spec-Kit
# Ejecutable via: curl -fsSL https://raw.githubusercontent.com/BeLc3bU/elite-agent-bootstrap/main/scripts/install.sh | bash
# =====================================================================

set -e
TARGET_DIR="$(pwd)"
TEMP_DIR="$(mktemp -d -t elite-speckit-XXXXXX)"

echo "======================================================="
echo "🚀 Descargando e integrando Elite Agent + Spec-Kit..."
echo "======================================================="

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

if command -v git >/dev/null 2>&1; then
    git clone --depth 1 https://github.com/BeLc3bU/elite-agent-bootstrap.git "$TEMP_DIR" >/dev/null 2>&1
else
    curl -fsSL https://github.com/BeLc3bU/elite-agent-bootstrap/archive/refs/heads/main.tar.gz | tar -xz -C "$TEMP_DIR" --strip-components=1
fi

if [ -f "$TEMP_DIR/scripts/integrate-speckit.sh" ]; then
    bash "$TEMP_DIR/scripts/integrate-speckit.sh" "$TARGET_DIR"
else
    echo "[-] No se encontró el script de integración."
    exit 1
fi
