# Calorie Clash GUI

This project is a GUI for the Calorie Clash game.

## 📚 ドキュメント一覧

- [ライセンス](LICENSE.md)
- [アーキテクチャ & プロジェクト概要](GEMINI.md)
- [開発ルール](AGENTS.md)
- [CHANGELOG](CHANGELOG.md)
- [ROADMAP](ROADMAP.md)
- [TODO](TODO.md)
- その他の資料は[docs ディレクトリ](docs/)を参照してください。
  - [共通関数ガイド](docs/common_functions.md)
  - [Canvas チートシート（ts）](<docs/canvas_チートシート（ts）.md>)
  - [要件定義 (MVP)](docs/要件定義.md)

## 開発ガイド

本プロジェクトは Vite + React + TypeScript（UIは Chakra UI）で構築されています。

### セットアップ / 起動
- Node.js 18+ を推奨します。
- 作業は `apps/web` ディレクトリで行います。

```bash
cd apps/web
npm install
npm run dev
```

### 主なスクリプト（`apps/web/package.json`）
- `npm run dev`: Vite 開発サーバを起動（HMR対応）
- `npm run build`: 型チェック（`tsc -b`）+ 本番ビルド
- `npm run preview`: 本番ビルドをローカルでプレビュー
- `npm run lint`: ESLint による静的解析

### コーディング規約（抜粋）
- TypeScript + 関数コンポーネント、インデントは2スペース。
- ファイル命名: コンポーネントは `PascalCase`（例: `TitleScreen.tsx`）。
- 変数・関数は `camelCase`、アセットは `kebab-case`。
- Chakra UI のテーマは `apps/web/src/theme.ts` に集約。
- ESLint 設定は `apps/web/eslint.config.js`。警告は極力解消してください。

### セキュリティ / 設定
- 秘密情報はコミット禁止。環境ごとの設定は Vite の `.env.local` を使用（未追跡）。
- CI では `npm ci` を利用し、再現性を確保します。
