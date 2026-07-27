#!/usr/bin/env bash
# Package REDBOX source into clean ZIP for download.
set -euo pipefail
PROJECT_DIR="/home/z/my-project"
OUT_DIR="/home/z/my-project/download"
OUT_ZIP="$OUT_DIR/redbox-official.zip"

mkdir -p "$OUT_DIR"
rm -f "$OUT_ZIP"
cd "$PROJECT_DIR"

EXCLUDES=(
  "node_modules" ".next" ".git" ".zscripts" "skills"
  "dev.log" "server.log" "*.log" ".env"
  "upload" "tests" "examples" "mini-services"
  "db/*.db" "db/*.db-journal"
  "download/home-*.png" "download/product-*.png" "download/shop-*.png"
  "download/redbox-official.zip" "download/redbox-source.zip"
  ".claude" ".z-ai-config" "next-env.d.ts" "bun.lock"
)

ZIP_ARGS=("-r" "$OUT_ZIP" ".")
for ex in "${EXCLUDES[@]}"; do
  ZIP_ARGS+=("-x" "./$ex" "./$ex/*")
done

zip -q "${ZIP_ARGS[@]}"

ls -lh "$OUT_ZIP"
echo "---"
unzip -l "$OUT_ZIP" | tail -3