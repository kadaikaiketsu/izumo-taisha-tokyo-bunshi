# GitHub セットアップ手順

## 1. GitHubアカウント作成

1. https://github.com にアクセス
2. 「Sign up」をクリック
3. メールアドレス、パスワード、ユーザー名を入力
4. メール認証を完了

## 2. リポジトリ作成

1. GitHub右上の「+」→「New repository」をクリック
2. 以下を入力：
   - **Repository name**: `izumo-tokyo-bunshi`
   - **Description**: 出雲大社東京分祠 公式ホームページ
   - **Private** を選択（重要！）✅
3. 「Create repository」をクリック

## 3. ファイルのアップロード

### 方法A: Web UI（簡単）

1. 作成したリポジトリのページで「uploading an existing file」をクリック
2. すべてのプロジェクトファイルをドラッグ&ドロップ
3. Commit message: 「初回コミット」
4. 「Commit changes」をクリック

### 方法B: Git コマンド（推奨）

#### Windows（Git Bashまたはコマンドプロンプト）
```bash
# プロジェクトフォルダに移動
cd /path/to/project

# Git初期化
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "初回コミット: 出雲大社東京分祠HP"

# リモートリポジトリ追加（URLは自分のものに変更）
git remote add origin https://github.com/あなたのユーザー名/izumo-tokyo-bunshi.git

# ブランチ名をmainに変更
git branch -M main

# プッシュ
git push -u origin main
```

#### Mac / Linux（ターミナル）
```bash
# プロジェクトフォルダに移動
cd /path/to/project

# Git初期化
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "初回コミット: 出雲大社東京分祠HP"

# リモートリポジトリ追加（URLは自分のものに変更）
git remote add origin https://github.com/あなたのユーザー名/izumo-tokyo-bunshi.git

# ブランチ名をmainに変更
git branch -M main

# プッシュ
git push -u origin main
```

## 4. プライベート設定の確認

1. リポジトリページで「Settings」をクリック
2. 「General」タブで「Visibility」を確認
3. 「Private」になっていることを確認 ✅

## 5. 変更を加えた後の更新方法

```bash
# ファイルを編集した後

# 変更を確認
git status

# 変更をステージング
git add .

# コミット
git commit -m "説明メッセージ"

# プッシュ
git push
```

## トラブルシューティング

### Q: Gitがインストールされていない
**A**: 以下からダウンロード
- Windows: https://git-scm.com/download/win
- Mac: `brew install git` または https://git-scm.com/download/mac

### Q: 認証エラーが出る
**A**: Personal Access Token（PAT）を使用
1. GitHub Settings → Developer settings → Personal access tokens
2. 「Generate new token」
3. `repo` にチェック
4. トークンをコピー
5. パスワードの代わりにトークンを使用

### Q: プッシュが拒否される
**A**: 先にプルしてマージ
```bash
git pull origin main
git push origin main
```

## おすすめの運用フロー

1. **変更前に必ずプル**
   ```bash
   git pull
   ```

2. **変更を加える**
   - HTMLやCSSを編集

3. **変更を確認**
   ```bash
   git status
   git diff
   ```

4. **コミット**
   ```bash
   git add .
   git commit -m "わかりやすいメッセージ"
   ```

5. **プッシュ**
   ```bash
   git push
   ```

## GitHub Pages での公開（オプション）

1. リポジトリの「Settings」→「Pages」
2. Source: 「Deploy from a branch」
3. Branch: `main` / `/ (root)`
4. 「Save」

数分後、`https://ユーザー名.github.io/izumo-tokyo-bunshi/` で公開されます。

**注意**: Privateリポジトリの場合、GitHub Pages は有料プラン（GitHub Pro以上）が必要です。

## Cloudflare Pages との連携（推奨）

1. Cloudflare にログイン
2. 「Pages」→「Create a project」
3. 「Connect to Git」→ GitHubを選択
4. リポジトリを選択
5. 自動デプロイ設定完了

この方法なら、Privateリポジトリでも無料で公開できます！

---

**サポートが必要な場合は、お気軽にお声がけください！**
