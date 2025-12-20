#!/bin/bash

# index.html - ホーム
sed -i 's|images/home1.png|https://www.genspark.ai/api/files/s/57gCbxlx|g' index.html
sed -i 's|images/home2.png|https://www.genspark.ai/api/files/s/GsSWTEvv|g' index.html
sed -i 's|images/prayer.png|https://www.genspark.ai/api/files/s/oNFhQNy1|g' index.html
sed -i 's|images/wedding1.png|https://www.genspark.ai/api/files/s/lNQD61C1|g' index.html
sed -i 's|images/学業御守.png|https://www.genspark.ai/api/files/s/57gCbxlx|g' index.html

# about.html - 出雲大社
sed -i 's|images/izumo_taisha.jpg|https://www.genspark.ai/api/files/s/5KeuwRMz|g' about.html
sed -i 's|images/izumo_kyo.jpg|https://www.genspark.ai/api/files/s/TkX8dEyV|g' about.html

# history.html - 由緒
sed -i 's|images/history_showa16.gif|https://www.genspark.ai/api/files/s/Xxx0AXGD|g' history.html
sed -i 's|images/history_showa57.gif|https://www.genspark.ai/api/files/s/5tfvT111|g' history.html

# prayer.html - 御祈願
sed -i 's|images/prayer.png|https://www.genspark.ai/api/files/s/oNFhQNy1|g' prayer.html
sed -i 's|images/family_safety.png|https://www.genspark.ai/api/files/s/14snOrs3|g' prayer.html
sed -i 's|images/hatsumiya.png|https://www.genspark.ai/api/files/s/W916eiK1|g' prayer.html
sed -i 's|images/shichigosan1.png|https://www.genspark.ai/api/files/s/HHvqzw1C|g' prayer.html
sed -i 's|images/shichigosan2.png|https://www.genspark.ai/api/files/s/yvfi8Zkk|g' prayer.html
sed -i 's|images/business.png|https://www.genspark.ai/api/files/s/RujNHqYf|g' prayer.html
sed -i 's|images/traffic_safety.png|https://www.genspark.ai/api/files/s/Fnq87aEe|g' prayer.html
sed -i 's|images/enmusubi1.png|https://www.genspark.ai/api/files/s/K8BBl9lE|g' prayer.html
sed -i 's|images/enmusubi2.png|https://www.genspark.ai/api/files/s/4ebRPEtP|g' prayer.html

# wedding.html - 神前結婚式
sed -i 's|images/wedding1.png|https://www.genspark.ai/api/files/s/lNQD61C1|g' wedding.html
sed -i 's|images/wedding2.png|https://www.genspark.ai/api/files/s/jo7CaHIV|g' wedding.html
sed -i 's|images/wedding3.png|https://www.genspark.ai/api/files/s/oGCPRUR0|g' wedding.html
sed -i 's|images/wedding4.png|https://www.genspark.ai/api/files/s/ZwXr7xu5|g' wedding.html
sed -i 's|images/wedding5.png|https://www.genspark.ai/api/files/s/xoDD6Ez6|g' wedding.html
sed -i 's|images/wedding6.png|https://www.genspark.ai/api/files/s/cfcv1m6S|g' wedding.html

echo "✅ 画像URLをHubファイルURLに更新完了"
