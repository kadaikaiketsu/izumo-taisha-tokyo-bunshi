#!/bin/bash
# Hub画像ダウンロードスクリプト

declare -A files=(
  ["home1.png"]="https://www.genspark.ai/api/files/s/57gCbxlx"
  ["home2.png"]="https://www.genspark.ai/api/files/s/GsSWTEvv"
  ["izumo_taisha.jpg"]="https://www.genspark.ai/api/files/s/5KeuwRMz"
  ["izumo_kyo.jpg"]="https://www.genspark.ai/api/files/s/TkX8dEyV"
)

for filename in "${!files[@]}"; do
  url="${files[$filename]}"
  echo "⬇️  ${filename} をダウンロード中..."
  curl -s -L "${url}" -o "${filename}"
  echo "✅ ${filename} 完了"
done

echo ""
echo "🎉 ダウンロード完了！"
ls -lh *.png *.jpg 2>/dev/null | wc -l
