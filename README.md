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

## バックエンドの起動

[ncdcdev/recruit-frontend](https://github.com/ncdcdev/recruit-frontend)を別途cloneして、そちらで実行する。

```bash
npm ci
npm run migration:run
npm run build
npm run start
```

接続先は`http://localhost:3000/content`。`src/features/content/api.ts`に定義している。
API仕様は起動後の[Swagger](http://localhost:3000/api)で確認できる。

## 実装について

ページ関連の型・API・コンポーネントは`src/features/content/`にまとめた。API通信は`api.ts`に分け、`App.tsx`で取得結果を管理している。

画面遷移がないのでRouterは使っていない。

タイトルがnullか空文字のページは「無題」と表示する。

作成・更新の引数はバックエンドのDTOに合わせ、`title`と`body`を省略可能にしている。作成時の初期値は呼び出し側で渡す。

ページを選ぶと詳細を取得する。取得中は連続して選択できないよう、一覧のボタンを無効にしている。
本文は改行をそのまま表示する。
