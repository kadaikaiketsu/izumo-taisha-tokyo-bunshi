#!/bin/bash
# 出雲大社東京分祠 復元スクリプト

set -e

BACKUP_DIR="/mnt/aidrive/出雲大社東京分祠"

echo "📋 利用可能なバックアップ:"
echo ""
ls -lht "${BACKUP_DIR}"/backup_*.tar.gz 2>/dev/null | nl | head -10 || {
    echo "❌ バックアップファイルが見つかりません"
    exit 1
}

echo ""
echo "❓ 復元するバックアップ番号を入力してください（最新は1）:"
read -p "番号: " NUM

BACKUP_FILE=$(ls -t "${BACKUP_DIR}"/backup_*.tar.gz 2>/dev/null | sed -n "${NUM}p")

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ 無効な番号です"
    exit 1
fi

echo ""
echo "⚠️  警告: 現在のファイルは上書きされます"
echo "📦 復元するファイル: $(basename $BACKUP_FILE)"
read -p "続行しますか？ (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ キャンセルしました"
    exit 0
fi

echo ""
echo "🔄 復元中..."
cd /home/user
rm -rf webapp
mkdir -p webapp
cd webapp
tar -xzf "$BACKUP_FILE"

echo "✅ 復元完了！"
echo "📍 復元元: $(basename $BACKUP_FILE)"
echo ""
echo "🚀 次のコマンドでサーバーを起動できます:"
echo "   cd /home/user/webapp && python3 -m http.server 3000 --bind 0.0.0.0"
