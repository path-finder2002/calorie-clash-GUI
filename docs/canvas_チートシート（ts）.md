# **Canvas よく使う型と関数｜TS チートシート（表形式）** 🎮⚡️🖌️

| カテゴリ | 型 / 関数 | 説明 / 用途 | コード例 |
|-----------|------------|--------------|-----------|
| **基本型** | `Vec2` | 2D座標 | `{ x: number; y: number }` |
|  | `RGBA` | 色情報 | `{ r,g,b,a? }` → `rgba(255,0,0,0.5)` |
|  | `Viewport` | ビューポート管理 | `{ width, height, dpr }` |
|  | `Ticker` | ループ制御 | `start(), stop(), running` |
| **DOM型** | `HTMLCanvasElement` | Canvas要素 | `const c: HTMLCanvasElement` |
|  | `CanvasRenderingContext2D` | 2D描画コンテキスト | `const ctx = canvas.getContext("2d")` |
|  | `Path2D` | パス描画 | `const p = new Path2D()` |
|  | `OffscreenCanvas` | ワーカー用Canvas | `new OffscreenCanvas(w,h)` |
| **初期化** | `getCtx` | 2Dコンテキスト取得 | `getCtx(canvas)` |
|  | `fitToDPR` | HiDPI対応サイズ調整 | `fitToDPR(canvas, viewport)` |
| **描画ユーティリティ** | `clear` | 全画面クリア | `clear(ctx)` |
|  | `withSave` | `save/restore`ラップ | `withSave(ctx, c => { ... })` |
|  | `line` | 線を描く | `line(ctx, {x:0,y:0}, {x:100,y:100})` |
|  | `circle` | 円描画 | `circle(ctx, {x:50,y:50}, 20)` |
|  | `rect` | 矩形描画 | `rect(ctx, 0,0,100,50)` |
|  | `txt` | テキスト描画 | `txt(ctx, "Hello", {x:100,y:100})` |
| **色/数ユーティリティ** | `rgba` / `hsla` | CSS色生成 | `rgba({r:255,g:0,b:0,a:0.5})` |
|  | `clamp` | 値制限 | `clamp(v,0,1)` |
|  | `lerp` | 線形補間 | `lerp(0,100,0.5)` |
|  | `mapRange` | 値の範囲変換 | `mapRange(v,0,1,0,100)` |
|  | `rand` | 乱数 | `rand(0,10)` |
| **画像** | `loadBitmap` | 非同期でImageBitmap作成 | `await loadBitmap("img.png")` |
| **オフスクリーン** | `makeOffscreen` | OffscreenCanvas作成 | `makeOffscreen(200,200)` |
| **アニメーション** | `createTicker` | RAF制御ループ | `ticker.start()` |
| **パーティクル** | `spawn` | 粒生成 | `spawn(30,1920,1080)` |
|  | `update` | 粒位置更新 | `update(ps,dt,vw,vh)` |
|  | `drawParticles` | 粒描画 | `drawParticles(ctx, ps)` |
| **入力** | `Pointer` | ポインタ情報 | `{ x,y,down }` |
|  | `bindPointer` | イベントバインド | `bindPointer(canvas)` |
| **座標変換** | `toDevice` | CSS→デバイス座標 | `toDevice(100,dpr)` |
| **テキスト** | `setupText` | フォント/影設定 | `setupText(ctx)` |
| **React統合** | `useCanvas` | Reactフック | `const ref = useCanvas(draw)` |
| **デバッグ** | `assertNever` | 到達不能保証 | `assertNever(x)` |

---

## **よく使う数値（本作）**
- 粒の半径：2〜8px  
- 粒の個数：20〜30個  
- 影の強さ：blur 24px  
- フェード：0.8〜1.2s  

---

**一言：** 型で守り、関数で加速。Canvasは表で即参照できるように。

