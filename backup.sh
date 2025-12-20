#!/bin/bash
# 出雲大社東京分祠 バックアップスクリプト

set -e

echo "🔄 バックアップ開始..."

# 現在の日時を取得
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${TIMESTAMP}.tar.gz"
BACKUP_DIR="/mnt/aidrive/出雲大社東京分祠"

# AIドライブにバックアップ
echo "📦 AIドライブにバックアップ中..."
cd /home/user/webapp
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*.log' \
    .

echo "✅ バックアップ完了: ${BACKUP_NAME}"
echo "📍 保存先: ${BACKUP_DIR}/${BACKUP_NAME}"

# Gitコミット（オプション）
if [ -d ".git" ]; then
    echo "🔄 Gitコミット中..."
    git add .
    git commit -m "Auto backup: ${TIMESTAMP}" || echo "変更なし"
    echo "✅ Gitコミット完了"
fi

# バックアップリスト表示
echo ""
echo "📋 最新のバックアップ一覧:"
ls -lht "${BACKUP_DIR}"/backup_*.tar.gz 2>/dev/null | head -5 || echo "バックアップファイルなし"

echo ""
echo "🎉 すべて完了！"
