# NCDC フロントエンド課題

React + TypeScriptで実装。開発環境にはViteを使っている。

## 起動方法

Node.js 22.12以上が必要。

```bash
npm ci
npm run dev
```

ターミナルに表示されたURLを開く。

## 確認用コマンド

```bash
npm run build         # 型チェック・ビルド
npm run lint          # 静的解析
npm run format:check  # フォーマット確認
```

整形する場合は`npm run format`。テストは未実装。

## 素材

提供されたアイコンを`src/assets/img/icon/`に置いている。importには`@assets`を使える。

Noto Sans JPはGoogle Fontsから読み込んでいる。
