# Calorie Clash — オプション（MVP）デザインドキュメント

- 目的: タイトル画面上に重なるモーダルで、音量/表示/テーマ/言語など基礎設定を変更・保存できるようにする。
- プロトタイプ: [docs/html/calorie_clash_options_screen_mvp_options.html](html/calorie_clash_options_screen_mvp_options.html)

## 画面構成
- モーダルカード: タイトルバー（`Options`/バージョン表示）、2カラム本体、フッターボタン群。
- セクション:
  - Audio: マスターボリューム（`range` + 値表示）、SFXトグル。
  - Visual FX: パーティクル数、速度、ビネットON/OFF。
  - Theme: スウォッチ（`radiogroup`相当）。
  - Language & Input: 言語選択（日本語/英語）、ハイコントラスト切替、操作ヒント。
- フッター: `Defaults` / `Cancel` / `Apply`。

## 操作/キーバインド
- `Tab` で移動。`Space` でテーマ選択（スウォッチに `role="radio"`）。
- `Enter` = Apply、`Esc` = Cancel。
- ボリューム: 左右キーで1%、Shift+左右で10%刻み（UIヒントを表示）。

## 永続化/状態
- 保存先: `localStorage` キー `calorieClash.options`。
- 状態スキーマ:
  - `volume:number` (0–100)
  - `sfx:boolean`
  - `particles:number` (10–60)
  - `speed:number` (4–24)
  - `vignette:boolean`
  - `theme:'teal'|'purple'|'sunset'|'mono'`
  - `lang:'ja'|'en'`
  - `highContrast:boolean`
- 適用: `applyToUI()` がフォームと `body.dataset.theme` / `body.dataset.hc` を同期。
- `Defaults`: 既定値を適用（閉じない）。
- `Cancel`: 保存値を再ロードしUIへ反映して閉じる。
- `Apply`: 現在状態を保存して閉じる。

## レスポンシブ
- 720px以下または縦長時: モーダルがボトムシート風に全幅化、ボタンは均等割り付け。
- 本体はオーバーフロー時にスクロール（細いスクロールバーをスタイル）。

## アクセシビリティ
- ダイアログ: `role="dialog"` + `aria-modal` + `aria-labelledby`。
- テーマ選択: `role="radiogroup"` と各スウォッチに `role="radio"`/`aria-checked`/`tabindex`。
- フォーカスリング: `outline` に `--focus` を適用。
- ラベル: 範囲入力・トグルに `aria-label` を付与。

## 実装メモ
- イベント: `input` で値表示更新、`change` で状態反映/保存対象更新。
- `Shift+Arrow` によりボリュームを±10調整（UIとARIA値を同期）。
- ハイコントラストは `body.dataset.hc` で切替（スタイル拡張余地あり）。

## 今後の課題
- テーマ/ハイコントラストの全画面統合（ゲーム全体CSS変数適用）。
- 言語切替のi18n連携（テキスト資源の外部化）。
- モーダルのフォーカストラップ・戻り先管理。

