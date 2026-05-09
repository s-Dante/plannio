#!/bin/bash
# ──────────────────────────────────────────────────────────────
# tunnel.sh — Plannio dev tunnel
#
# Levanta dos cloudflared quick tunnels:
#   • Puerto 8000 → App Laravel
#   • Puerto 8080 → Reverb (WebSockets)
#
# Actualiza .env con el host de Reverb automáticamente y
# lo restaura a localhost cuando cierras con Ctrl+C.
#
# Uso:
#   chmod +x tunnel.sh
#   ./tunnel.sh
# ──────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       Plannio — Dev Tunnel Setup       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# ── Verificar cloudflared ──────────────────────────────────────
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}❌ cloudflared no encontrado.${NC}"
    echo "   Instálalo con:"
    echo "   brew install cloudflared"
    exit 1
fi

# ── Archivos temporales de log ─────────────────────────────────
LOG_APP=$(mktemp)
LOG_REVERB=$(mktemp)

# ── Cleanup al salir ───────────────────────────────────────────
cleanup() {
    echo ""
    echo -e "${YELLOW}⏹  Cerrando tunnels...${NC}"
    kill "$PID_APP" "$PID_REVERB" 2>/dev/null
    wait "$PID_APP" "$PID_REVERB" 2>/dev/null
    rm -f "$LOG_APP" "$LOG_REVERB"

    # Restaurar .env a valores locales
    sed -i '' \
        -e 's|^REVERB_HOST=.*|REVERB_HOST="localhost"|' \
        -e 's|^REVERB_PORT=.*|REVERB_PORT=8080|' \
        -e 's|^REVERB_SCHEME=.*|REVERB_SCHEME=http|' \
        "$ENV_FILE"

    echo -e "${GREEN}✅ .env restaurado a localhost.${NC}"
    echo ""
    exit 0
}
trap cleanup SIGINT SIGTERM

# ── Lanzar tunnels en background ──────────────────────────────
echo -e "⏳ Iniciando tunnels (puede tardar ~10 s)..."
cloudflared tunnel --url http://localhost:8000 > "$LOG_APP"   2>&1 &
PID_APP=$!
cloudflared tunnel --url http://localhost:8080 > "$LOG_REVERB" 2>&1 &
PID_REVERB=$!

# ── Esperar a que aparezcan las URLs ──────────────────────────
get_tunnel_url() {
    local logfile=$1
    local url=""
    local attempts=0
    while [[ -z "$url" && $attempts -lt 40 ]]; do
        url=$(grep -o 'https://[a-zA-Z0-9-]*\.trycloudflare\.com' "$logfile" 2>/dev/null | head -1)
        sleep 1
        ((attempts++))
    done
    echo "$url"
}

URL_APP=$(get_tunnel_url "$LOG_APP")
URL_REVERB=$(get_tunnel_url "$LOG_REVERB")

if [[ -z "$URL_APP" || -z "$URL_REVERB" ]]; then
    echo -e "${RED}❌ No se pudieron obtener las URLs de cloudflared.${NC}"
    echo "   Asegúrate de tener conexión a internet y vuelve a intentarlo."
    cleanup
    exit 1
fi

REVERB_HOST=$(echo "$URL_REVERB" | sed 's|https://||')

# ── Actualizar .env ────────────────────────────────────────────
sed -i '' \
    -e "s|^REVERB_HOST=.*|REVERB_HOST=\"$REVERB_HOST\"|" \
    -e 's|^REVERB_PORT=.*|REVERB_PORT=443|' \
    -e 's|^REVERB_SCHEME=.*|REVERB_SCHEME=https|' \
    "$ENV_FILE"

# ── Output ─────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}✅ Tunnels activos${NC}"
echo "────────────────────────────────────────────────"
echo -e "  🌐 App     → ${BLUE}${URL_APP}${NC}"
echo -e "  🔌 Reverb  → ${BLUE}${URL_REVERB}${NC}"
echo ""
echo -e "${YELLOW}📝 .env actualizado:${NC}"
echo "   REVERB_HOST=\"$REVERB_HOST\""
echo "   REVERB_PORT=443"
echo "   REVERB_SCHEME=https"
echo ""
echo "────────────────────────────────────────────────"
echo -e "${YELLOW}⚡ Abre 3 terminales más y ejecuta:${NC}"
echo ""
echo "   Terminal 2:  php artisan serve"
echo "   Terminal 3:  php artisan reverb:start"
echo "   Terminal 4:  npm run build"
echo ""
echo -e "   Comparte ${BLUE}${URL_APP}${NC} con tus dispositivos"
echo "────────────────────────────────────────────────"
echo "   Ctrl+C para cerrar tunnels y restaurar .env"
echo ""

# ── Mantener vivo ─────────────────────────────────────────────
wait "$PID_APP" "$PID_REVERB"
