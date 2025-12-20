#!/bin/bash

echo "📥 Hub画像を一括ダウンロード中..."

curl -sL "https://www.genspark.ai/api/files/s/57gCbxlx" -o "home1.png"
curl -sL "https://www.genspark.ai/api/files/s/GsSWTEvv" -o "home2.png"
curl -sL "https://www.genspark.ai/api/files/s/5KeuwRMz" -o "izumo_taisha.jpg"
curl -sL "https://www.genspark.ai/api/files/s/TkX8dEyV" -o "izumo_kyo.jpg"
curl -sL "https://www.genspark.ai/api/files/s/Xxx0AXGD" -o "history_showa16.gif"
curl -sL "https://www.genspark.ai/api/files/s/5tfvT111" -o "history_showa57.gif"
curl -sL "https://www.genspark.ai/api/files/s/oNFhQNy1" -o "prayer.png"
curl -sL "https://www.genspark.ai/api/files/s/14snOrs3" -o "family_safety.png"
curl -sL "https://www.genspark.ai/api/files/s/W916eiK1" -o "hatsumiya.png"
curl -sL "https://www.genspark.ai/api/files/s/HHvqzw1C" -o "shichigosan1.png"
curl -sL "https://www.genspark.ai/api/files/s/yvfi8Zkk" -o "shichigosan2.png"
curl -sL "https://www.genspark.ai/api/files/s/RujNHqYf" -o "business.png"
curl -sL "https://www.genspark.ai/api/files/s/Fnq87aEe" -o "traffic_safety.png"
curl -sL "https://www.genspark.ai/api/files/s/K8BBl9lE" -o "enmusubi1.png"
curl -sL "https://www.genspark.ai/api/files/s/4ebRPEtP" -o "enmusubi2.png"
curl -sL "https://www.genspark.ai/api/files/s/lNQD61C1" -o "wedding1.png"
curl -sL "https://www.genspark.ai/api/files/s/jo7CaHIV" -o "wedding2.png"
curl -sL "https://www.genspark.ai/api/files/s/oGCPRUR0" -o "wedding3.png"
curl -sL "https://www.genspark.ai/api/files/s/ZwXr7xu5" -o "wedding4.png"
curl -sL "https://www.genspark.ai/api/files/s/xoDD6Ez6" -o "wedding5.png"
curl -sL "https://www.genspark.ai/api/files/s/cfcv1m6S" -o "wedding6.png"

echo "✅ ダウンロード完了！"
ls -lh | grep -E "\.(png|jpg|gif)$" | wc -l
echo "枚の画像がダウンロードされました"
