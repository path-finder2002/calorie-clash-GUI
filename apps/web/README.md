# Calorie Clash GUI — Web アプリ

Vite + React + TypeScript + Chakra UI 構成のフロントエンドです。開発はこの `apps/web` ディレクトリ内で行います。

## セットアップ / 起動

```bash
npm install
npm run dev
```

推奨環境: Node.js 18+

## スクリプト

- `npm run dev`: 開発サーバ起動（HMR）
- `npm run dev:types`: 型チェックのウォッチ（`tsc -b -w`）
- `npm run dev:lint`: ESLint のウォッチ
- `npm run build`: 型チェック + 本番ビルド
- `npm run preview`: 本番ビルドをローカルでプレビュー
- `npm run lint`: ESLint 実行

## ディレクトリ構成（抜粋）

- `index.html`: Vite エントリ
- `src/main.tsx`: React エントリポイント
- `src/App.tsx`: ルートコンポーネント
- `src/theme.ts`: Chakra UI テーマのカスタマイズ
- `src/components/*`: 機能ごとの小さなコンポーネント群

## コーディング規約（要点）

- TypeScript + 関数コンポーネント、2スペースインデント。
- コンポーネントは `PascalCase`、変数/関数は `camelCase`、アセットは `kebab-case`。
- 可能な限り小さく責務を分割し、`src/` の相対パスでインポート。
- Chakra のテーマ定義は `src/theme.ts` に集約。
- ESLint 設定は `eslint.config.js`。警告は極力解消してください。

## 開発メモ

- 環境変数は Vite の `.env.local` を使用（リポジトリ未追跡）。
- CI では `npm ci` を推奨し、依存の再現性を担保します。
