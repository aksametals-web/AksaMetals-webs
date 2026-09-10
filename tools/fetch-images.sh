#!/usr/bin/env bash
# ============================================================
#  AKSA METALS — placeholder photography fetcher
#
#  Downloads the free-to-use Pexels photos used across the site
#  into assets/img/. Every file is verified to be a real JPEG.
#
#  You do NOT need to run this — the images are already committed.
#  It exists so the set can be rebuilt or swapped later.
#
#  Usage:  bash tools/fetch-images.sh
# ============================================================
set -u
OUT="assets/img"
mkdir -p "$OUT"

# name|pexels-id|width
SET="
hero-copper-strip|5279344|1800
hero-copper-pipes|3721272|1600
factory-floor|31352672|1500
melting-pour|6804265|1500
furnace-worker|3736102|1500
rolling-mill|8973680|1500
cutting-machine|36522038|1500
warehouse|36878025|1500
quality-check|32845674|1500
inspection|35383622|1500
coil-yard|36397791|1500
steel-mill-glow|8803230|1500
precision-parts|28752153|1500
craftsman-copper|17462141|1200
craftsman-brass|37708534|1200
stock-yard|14838208|1400
texture-copper|30644763|1400
texture-brass|30243820|1400
applications|34573722|1200
copper-vessel|2113127|1200
product-copper-circle|36522038|900
product-copper-coil|8940223|900
product-copper-sheet|35383621|900
product-copper-strip|5279344|900
product-copper-plate|30617011|900
product-copper-foil|7405670|900
product-brass-circle|37708534|900
product-brass-coil|36397791|900
product-brass-sheet|28752153|900
product-brass-strip|4196955|900
product-brass-plate|37441609|900
product-brass-foil|30243820|900
"

ok=0; failed=""
for row in $SET; do
  [ -z "$row" ] && continue
  name="${row%%|*}"; rest="${row#*|}"
  id="${rest%%|*}"; w="${rest##*|}"
  dest="$OUT/$name.jpg"
  url="https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=$w"

  for attempt in 1 2 3; do
    curl -sS -o "$dest" -L "$url" --max-time 60 && break
    sleep 1
  done

  size=$(stat -c%s "$dest" 2>/dev/null || echo 0)
  magic=$(head -c 2 "$dest" 2>/dev/null | od -An -tx1 | tr -d ' \n')
  if [ "$size" -gt 10000 ] && [ "$magic" = "ffd8" ]; then
    ok=$((ok+1))
    printf '  ok  %-26s %6s KB\n' "$name" "$((size/1024))"
  else
    failed="$failed $name"
    rm -f "$dest"
    printf '  XX  %-26s FAILED\n' "$name"
  fi
done

echo ""
echo "Downloaded $ok image(s) into $OUT/"
[ -n "$failed" ] && echo "FAILED:$failed" && exit 1
exit 0
