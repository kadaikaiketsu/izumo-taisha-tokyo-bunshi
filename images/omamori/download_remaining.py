#!/usr/bin/env python3
"""
Hub Files Toolを使って残り11個の画像をダウンロードする戦略:

1. hub_files_toolのget_file_url で取得できたものはDownloadFileWrapper
2. 取得できなかったものは、代替ファイル名（半角括弧版）でローカル保存
   → HTMLでは半角括弧版のファイル名を参照
"""

import json

# 残り11個のファイルマッピング（Hub内の名前 → ローカル保存名）
file_mapping = {
    # 全角括弧を半角に変換して保存
    "縁むすびの糸.jpg": "縁むすびの糸.jpg",
    "カード守（縁結守）.jpg": "カード守(縁結守).jpg",  # 半角に変換
    "むすび鈴.jpg": "むすび鈴.jpg",
    "カード守（諸願成就守）.jpg": "カード守(諸願成就守).jpg",  # 半角に変換
    "カード守（産業・事業繁栄守）.jpg": "カード守(産業・事業繁栄守).jpg",  # 半角に変換
    "カード守（病気平癒・身体健全守）.jpg": "カード守(病気平癒・身体健全守).jpg",  # 半角に変換
    "カード守（厄除守）.jpg": "カード守(厄除守).jpg",  # 半角に変換
    "幸運のこづち.jpg": "幸運のこづち.jpg",
    "美保岐玉ストラップ.jpg": "美保岐玉ストラップ.jpg",
    "美保岐玉ブレスレット.jpg": "美保岐玉ブレスレット.jpg",
    "えま（うさぎ・よみがえり）.jpg": "えま(うさぎ・よみがえり).jpg",  # 半角に変換
}

print("=" * 70)
print("残り11個の画像ダウンロード戦略")
print("=" * 70)
print("\n戦略:")
print("1. hub_files_toolでURL取得を試みる")
print("2. URL取得に失敗したファイルは、半角括弧版のファイル名でローカル保存")
print("3. HTMLは半角括弧版のファイル名を参照")
print()
print("ファイルマッピング:")
for hub_name, local_name in file_mapping.items():
    if hub_name != local_name:
        print(f"  {hub_name}")
        print(f"    → {local_name}")

print("\n" + "=" * 70)
print("次のステップ:")
print("=" * 70)
print("1. 各ファイルのhub_files_tool get_file_urlを実行")
print("2. 成功したものはDownloadFileWrapperでダウンロード")
print("3. 失敗したものは、元サイトから類似画像を探すか")
print("   プレースホルダーのまま残す")

