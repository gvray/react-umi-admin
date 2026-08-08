#!/bin/bash

set -e

echo "🚀 Processing screenshots..."

# 1. Rename Chrome screenshots by numeric order
tmp=".tmp_screenshots"
mkdir -p "$tmp"

index=1

find . -maxdepth 1 -name '*.png' -print0 |
  sort -z -V |
  while IFS= read -r -d '' file; do
    filename="${file#./}"

    # Skip already numbered PNG files
    [[ "$filename" =~ ^[0-9]+\.png$ ]] && continue

    mv "$file" "$tmp/$index.png"
    echo "✓ $filename -> $index.png"
    ((index++))
  done

mv "$tmp"/*.png . 2>/dev/null || true
rmdir "$tmp" 2>/dev/null || true

# 2. Resize
for file in {1..99}.png; do
  [ -f "$file" ] || continue
  sips -z 900 1440 "$file" --out "$file" >/dev/null
done

# 3. Compress
for file in {1..99}.png; do
  [ -f "$file" ] || continue

  pngquant \
    --quality=60-80 \
    --speed=1 \
    --force \
    --output "$file" \
    -- "$file"
done

# 4. Generate WebP
files=()

for file in {1..99}.png; do
  [ -f "$file" ] && files+=("$file")
done

magick \
  -delay 80 \
  -loop 0 \
  -quality 75 \
  "${files[@]}" \
  demo.webp

echo ""
echo "✅ Done: demo.webp"
ls -lh demo.webp