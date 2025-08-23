# STEP-A Framework チェックリスト（is_evenプロジェクト）

## S = Start（スタート）
- [ ] is_even 関数の仕様を整理する（0は偶数、負数も正しく判定、非整数はTypeError）
- [ ] 過去のバグ（0を奇数扱いする誤り）が再発した経緯を確認する
- [ ] main / refactor / hotfix の3ブランチがどんな修正を含むか記録する

## T = Try（試す）
- [ ] 新しいブランチを切り、意図的に is_even に修正を加える
- [ ] refactor版（ビット演算）と hotfix版（バグ修正＋型チェック）を衝突させる
- [ ] Git merge を実行し、コンフリクトを再現する
- [ ] AIまたは自動解決を試して、どのようなコードが残るか確認する

## E = Experience（体験する）
- [ ] pytest を実行し、バグが再発しているか検証する
- [ ] どの修正が失われたか（例：0が偶数扱いされない）を記録する
- [ ] MERGE_CONFLICT_REPORT.md に衝突状況を追記する
- [ ] REGRESSION_REPORT.md に「先祖返りでバグ復活」事例を記録する

## P = Progress（進展する）
- [ ] hotfix と refactor の両意図を統合した is_even を再実装する
- [ ] pytest を再度実行し、全テストがグリーンであることを確認する
- [ ] CI（.github/workflows/ci.yml）が正しく回ることを確認する
- [ ] PULL_REQUEST_TEMPLATE.md に「0は偶数か？」チェック項目を追記する
- [ ] AIに渡すプロンプト文に「修正と最適化を両立せよ」を追加する

## A = Action（行動する）
- [ ] 修正版を main にマージし、先祖返りを防止する
- [ ] APPLY_ANTI_REGRESSION.md に再発防止策を更新する
- [ ] scripts/write_session_report.sh を実行し、セッション記録を保存する
- [ ] reports ディレクトリに今日のログが残っているか確認する
- [ ] 定期的に「ジャーナル」を書き、失敗や改善点を可視化する
