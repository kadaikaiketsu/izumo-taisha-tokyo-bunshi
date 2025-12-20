#!/bin/bash

# index.html - ホーム
sed -i 's|https://www.genspark.ai/api/files/s/57gCbxlx|images/home1.png|g' index.html
sed -i 's|https://www.genspark.ai/api/files/s/GsSWTEvv|images/home2.png|g' index.html
sed -i 's|https://www.genspark.ai/api/files/s/oNFhQNy1|images/prayer.png|g' index.html
sed -i 's|https://www.genspark.ai/api/files/s/lNQD61C1|images/wedding1.png|g' index.html

# about.html - 出雲大社
sed -i 's|https://www.genspark.ai/api/files/s/5KeuwRMz|images/izumo_taisha.jpg|g' about.html
sed -i 's|https://www.genspark.ai/api/files/s/TkX8dEyV|images/izumo_kyo.jpg|g' about.html

# history.html - 由緒
sed -i 's|https://www.genspark.ai/api/files/s/Xxx0AXGD|images/history_showa16.gif|g' history.html
sed -i 's|https://www.genspark.ai/api/files/s/5tfvT111|images/history_showa57.gif|g' history.html

# prayer.html - 御祈願
sed -i 's|https://www.genspark.ai/api/files/s/oNFhQNy1|images/prayer.png|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/14snOrs3|images/family_safety.png|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/W916eiK1|images/hatsumiya.png|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/HHvqzw1C|images/shichigosan1.png|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/yvfi8Zkk|images/shichigosan2.png|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/RujNHqYf|images/business.png|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/Fnq87aEe|images/traffic_safety.png|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/K8BBl9lE|images/enmusubi1.png|g' prayer.html
sed -i 's|https://www.genspark.ai/api/files/s/4ebRPEtP|images/enmusubi2.png|g' prayer.html

# wedding.html - 神前結婚式
sed -i 's|https://www.genspark.ai/api/files/s/lNQD61C1|images/wedding1.png|g' wedding.html
sed -i 's|https://www.genspark.ai/api/files/s/jo7CaHIV|images/wedding2.png|g' wedding.html
sed -i 's|https://www.genspark.ai/api/files/s/oGCPRUR0|images/wedding3.png|g' wedding.html
sed -i 's|https://www.genspark.ai/api/files/s/ZwXr7xu5|images/wedding4.png|g' wedding.html
sed -i 's|https://www.genspark.ai/api/files/s/xoDD6Ez6|images/wedding5.png|g' wedding.html
sed -i 's|https://www.genspark.ai/api/files/s/cfcv1m6S|images/wedding6.png|g' wedding.html

echo "✅ ローカル画像パスに戻しました"
