#!/bin/bash

# prayer.htmlの画像を更新
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="御祈願|images/prayer.png" alt="御祈願|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="家内安全|images/family_safety.png" alt="家内安全|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="初宮|images/hatsumiya.png" alt="初宮|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="七五三1|images/shichigosan1.png" alt="七五三1|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="七五三2|images/shichigosan2.png" alt="七五三2|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="商売繁盛|images/business.png" alt="商売繁盛|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="交通安全|images/traffic_safety.png" alt="交通安全|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="縁結1|images/enmusubi1.png" alt="縁結1|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/[A-Za-z0-9]*" alt="縁結2|images/enmusubi2.png" alt="縁結2|g' prayer.html

# wedding.htmlの画像を更新（wedding1-6を順番に）
for i in {1..6}; do
  sed -i "0,/https:\/\/www.genspark.ai\/api\/files\/s\/[A-Za-z0-9]*\" alt=\"御衣裳/s||images/wedding$i.png\" alt=\"御衣裳|" wedding.html
done

echo "✅ 画像パス更新完了"
