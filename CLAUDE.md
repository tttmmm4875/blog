# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

docsify を使用したドキュメントサイト。ビルドプロセス不要で、Markdown ファイルを直接ブラウザでレンダリングする静的ドキュメントサイト。

## コマンド

```bash
# サイドバーの自動生成（フォルダ構造に基づいて _sidebar.md を生成）
npm run sidebar

# ローカルでのプレビュー（docsify-cli が必要）
npx docsify serve .
```

## アーキテクチャ

### 技術スタック
- **docsify v4**: CDN から読み込み（ビルド不要）
- **GitHub Pages**: main ブランチへのプッシュで自動デプロイ

### 重要なファイル
- `index.html`: docsify の設定（サイドバー・ナビバー有効化、テーマ設定）
- `_sidebar.md`: サイドバーの定義（`npm run sidebar` で自動生成）
- `_navbar.md`: ナビゲーションバーの定義
- `generate-sidebar.js`: フォルダ構造を走査して `_sidebar.md` を生成するスクリプト

### ドキュメント追加方法
1. 任意のディレクトリに `.md` ファイルを作成
2. ファイルの先頭に `# タイトル` 形式の見出しを記述
3. `npm run sidebar` を実行してサイドバーを更新

### サイドバー生成の除外対象
- `.` で始まるファイル/ディレクトリ
- `node_modules`
- `_sidebar.md`、`_navbar.md`、`README.md`
