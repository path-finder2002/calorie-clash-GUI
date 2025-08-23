# CI/CD 開発ルール

この文書は `docs/branchTest.txt` の運用方針（PR テンプレート、CI 設定、マージ時の注意点など）をベースに、現在のフロントエンド構成（apps/web）に合わせて整理・具体化した CI/CD ルールです。

## ブランチ運用
- 基本ブランチ: `main`（常にデプロイ可能な状態を維持）。
- 作業ブランチ命名（例）:
  - 機能: `feat/<scope>`
  - 修正: `fix/<scope>`
  - 調整/雑務: `chore/<scope>`
  - ドキュメント: `docs/<scope>`
- マージ方式: 原則「リベースマージ」または「FF マージ」。履歴の直線性を維持。
  - 取り込み前に `git fetch && git rebase origin/main`（PR テンプレートの要請）。

## コミット/PR ルール
- コミットメッセージ: 命令形・簡潔。推奨: Conventional Commits もしくは `web: 概要` 形式。
- 1 PR の粒度: 小さく焦点を絞る。不要な整形だけの差分は分離。
- PR 作成前チェック（必須）:
  - 仕様厳守（例: 既存仕様を壊さない）。
  - ローカルで静的チェックとビルドが通ること。
  - `main` 取り込み済み（`git fetch && git rebase origin/main`）。
  - コンフリクト時は「意図の統合」を実施（両方の改善点を残す）。
  - 変更内容・動作確認の根拠（スクリーンショット/GIF/ログ）を PR に添付。

## ローカル検証コマンド（apps/web）
```bash
cd apps/web
npm ci
npm run lint
npm run build
npm run preview # 必要に応じて
```

## CI（継続的インテグレーション）
- トリガー: `push` と `pull_request`（対象: `main`）。
- 目的: 再現可能な環境での型チェック・Lint・ビルドの検証。
- 推奨 GitHub Actions 構成（概要）:
  - `actions/checkout@v4` でチェックアウト
  - Node 18+ をセットアップ
  - `cd apps/web && npm ci`
  - `npm run lint && npm run build`
- 参考: `docs/branchTest.txt` 内の Python 例（pytest）は「PR 時に自動テストを必須にする」という思想の参照元。フロントエンドでは上記の型/静的解析/ビルドチェックを必須とする。

## CD（継続的デリバリー/デプロイ）
- デプロイ先の例:
  - GitHub Pages: `apps/web/dist` を公開（`actions/upload-pages-artifact` → `actions/deploy-pages`）。
  - Vercel/Netlify: リポジトリ連携で `apps/web` をルートに設定、Build コマンドは `npm run build`、出力は `apps/web/dist`。
- 機密情報: Vite の `.env.local` を使用（Git には含めない）。
- リリース条件: `main` の CI 緑を前提に、自動 or 手動でデプロイ。

## コンフリクト解消ポリシー（意図の統合）
- 「修正」と「リファクタ」が衝突した場合、片方を捨てずに両意図を満たす統合案を作る。
- 解消後は必ずローカル検証（`lint`、`build`）を再実行。
- 典型パターン:
  - マージ記号（`<<<<<<<`, `=======`, `>>>>>>>`）の残骸はビルドエラーの原因。全リポジトリを検索して除去・統合。
  - 既存の API/props の互換を保ちつつ改善点を反映。

## リリース/タグ付け
- バージョニング: `vX.Y.Z`（SemVer 推奨）。
- リリース手順:
  1) `main` が緑（CI）であることを確認
  2) `CHANGELOG.md` 更新（必要に応じて）
  3) タグ付け: `git tag -a vX.Y.Z -m "release: vX.Y.Z" && git push origin vX.Y.Z`
  4) デプロイ反映（Pages/Vercel/Netlify など）

## ブランチ保護（推奨）
- `main` ブランチに対する保護ルール:
  - 必須チェック: CI（lint + build）緑
  - レビュー必須: 1 名以上
  - 直 push 禁止（PR 経由）

## トラブルシュート
- HMR は効くが本番更新が反映されない:
  - `apps/web` には本番の自動リロードを実装済み（`version.json` ポーリング）。デプロイが正しく反映されているか、キャッシュを確認。
- ビルドサイズ警告:
  - `vite.config.ts` で手動チャンク分割済み。必要に応じて `React.lazy` で遅延読込導入。
- VS アニメのフロー確認:
  - 初回は「VS → Round → Slot」、2 ラウンド目以降は「Round → Slot」。

## 参考（branchTest.txt の要点）
- PR テンプレート:
  - `main` 取り込み（`git fetch && git rebase origin/main`）の徹底
  - テスト（このリポジトリでは lint/build）を PR に貼付
  - コンフリクト時の「意図の統合」
- CI の思想:
  - 変更は自動チェックを通すこと。フロントは型/静的解析/ビルドの失敗を検知する。

---

この文書に沿って運用することで、変更の安全性・可観測性・再現性を担保します。疑義や運用変更の提案は `docs/CI_CD_rules.md` への PR として提出してください。

