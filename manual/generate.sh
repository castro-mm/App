#!/usr/bin/env bash
# Controle de Contas — Gerador do Manual do Usuário
# Gera: PDF (md-to-pdf)
# Uso: ./generate.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/src"
OUT_DIR="$SCRIPT_DIR/out"
ASSETS_DIR="$SCRIPT_DIR/../client/src/assets/downloads"

MANUAL_MD="$SRC_DIR/manual.md"
CONFIG_JS="$SRC_DIR/md-to-pdf.config.js"
PDF_OUT="$OUT_DIR/manual-do-usuario.pdf"

echo "=== Controle de Contas — Gerador do Manual ==="

# Verificar dependências
if ! command -v md-to-pdf &>/dev/null; then
  echo "❌ md-to-pdf não encontrado. Instale com: sudo npm install -g md-to-pdf"
  exit 1
fi

# Criar diretórios de saída
mkdir -p "$OUT_DIR"
mkdir -p "$ASSETS_DIR"

# Gerar PDF (md-to-pdf gera no mesmo diretório do .md)
echo "📄 Gerando PDF..."
md-to-pdf "$MANUAL_MD" --config-file "$CONFIG_JS"

# Mover PDF gerado para o diretório de saída
if [ -f "$SRC_DIR/manual.pdf" ]; then
  mv "$SRC_DIR/manual.pdf" "$PDF_OUT"
  echo "✅ PDF gerado em: $PDF_OUT"
else
  echo "❌ PDF não foi gerado. Verifique os logs acima."
  exit 1
fi

# Copiar PDF para assets do cliente
cp "$PDF_OUT" "$ASSETS_DIR/manual-do-usuario.pdf"
echo "✅ PDF copiado para: $ASSETS_DIR/manual-do-usuario.pdf"

echo ""
echo "=== Manual gerado com sucesso! ==="
