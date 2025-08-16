# JavaScript/TypeScript 頻出関数・パターン集

このドキュメントは、プロジェクト内で頻繁に利用されるJavaScript/TypeScriptの基本的な関数やコーディングパターンをまとめたものです。

## 1. DOM操作

DOM要素の選択、作成、変更はUI開発の基本です。

### 1.1. 要素の選択

特定の要素をDOMから取得します。

- **IDで選択 (単一要素)**
  ```javascript
  const element = document.getElementById('my-id');
  ```
  > **プロジェクトでの使用例 (`food_draw.html`):**
  > Food Drawアニメーションの主要なコンテナ要素を取得するために使用しています。
  > ```javascript
  > const overlay = document.getElementById('overlay');
  > const rail = document.getElementById('rail');
  > ```

- **CSSセレクタで選択 (単一要素)**
  `querySelector`は、指定したセレクタに一致する最初の要素を返します。
  ```javascript
  const player = document.querySelector('.player-card');
  ```
  > **プロジェクトでの使用例 (`options.html`):**
  > ショートハンド`$`として定義し、設定モーダル内の様々なUI要素（値表示用の`<span>`など）を取得しています。
  > ```javascript
  > const $ = sel => document.querySelector(sel);
  > // ...
  > $('#volVal').textContent = v + '%';
  > ```

- **CSSセレクタで選択 (複数要素)**
  `querySelectorAll`は、指定したセレクタに一致するすべての要素のリスト（NodeList）を返します。`Array.from()`と組み合わせることで、`forEach`などの配列メソッドを安全に使用できます。
  ```javascript
  const buttons = Array.from(document.querySelectorAll('.menu button'));
  buttons.forEach(btn => {
    // ...処理
  });
  ```
  > **プロジェクトでの使用例 (`title.html`):**
  > タイトル画面の全メニューボタンを取得し、キーボードナビゲーションやクリックイベントをまとめて設定するために使用しています。
  > ```javascript
  > const buttons = Array.from(document.querySelectorAll('.menu button'));
  > buttons.forEach(b=> b.addEventListener('click', ()=> activate(b)) );
  > ```

### 1.2. 要素の属性と内容の変更

- **テキスト内容の変更**
  ```javascript
  element.textContent = '新しいテキスト';
  ```
  > **プロジェクトでの使用例 (`janken_battle.html`):**
  > じゃんけんの掛け声（「ジャン」「ケン」「ポン！」）を進行に合わせて更新しています。
  > ```javascript
  > chant.textContent = 'ジャン';
  > setTimeout(() => { chant.textContent = 'ケン'; }, 360);
  > ```

- **HTML内容の変更**
  ```javascript
  element.innerHTML = '<span>新しい</span>HTML';
  ```
  > **プロジェクトでの使用例 (`mash.html`):**
  > タイマー表示で、秒数を大きく、単位（s）を小さく表示するために`<small>`タグを埋め込んでいます。
  > ```javascript
  > timerEl.innerHTML = left.toFixed(1) + "<small>s</small>";
  > ```

- **スタイルの変更**
  ```javascript
  element.style.display = 'none';
  ```
  > **プロジェクトでの使用例 (`janken_battle.html`):**
  > 勝敗結果（WIN/LOSE/DRAW）に応じて、テキストの色を動的に変更しています。
  > ```javascript
  > const color = outcome === 'win' ? 'var(--accent)' : 'var(--lose)';
  > resText.style.color = color;
  > ```

- **データ属性の操作**
  ```javascript
  const theme = element.dataset.theme;
  element.dataset.selected = 'true';
  ```
  > **プロジェクトでの使用例 (`options.html`):**
  > 選択されたテーマのスウォッチに`data-selected="true"`を設定し、どのテーマが現在選択されているかを視覚的に示しています。
  > ```javascript
  > $$('.swatch').forEach(w => w.dataset.selected = (w.dataset.theme === state.theme));
  > ```

## 2. イベント処理

### 2.1. イベントリスナーの追加

```javascript
button.addEventListener('click', (event) => { /* ... */ });
window.addEventListener('keydown', (event) => { /* ... */ });
```
> **プロジェクトでの使用例 (`title.html`):**
> `ArrowUp` / `ArrowDown`キーでメニュー項目をフォーカス移動させ、`Enter`キーで決定する処理を実装しています。
> ```javascript
> window.addEventListener('keydown', e => {
>   if (e.key === 'ArrowUp') { e.preventDefault(); focusIdx(idx - 1); }
>   if (e.key === 'ArrowDown') { e.preventDefault(); focusIdx(idx + 1); }
>   if (e.key === 'Enter') { e.preventDefault(); activate(buttons[idx]); }
> });
> ```

## 3. アニメーション (anime.js)

### 3.1. 単一アニメーション

```javascript
anime({ targets: '.fade-out', opacity: 0 });
```
> **プロジェクトでの使用例 (`food_draw.html`):**
> 当選したカードを少し拡大して元に戻す「パルス」効果や、画面全体を白く光らせる「フラッシュ」効果を表現しています。
> ```javascript
> function pulse(el) {
>   anime({ targets: el, scale: [1.06, 1.12, 1.06], duration: 360, easing: 'easeInOutQuad' });
> }
> function flashOnce() {
>   anime({ targets: flash, opacity: [0, 1, 0], duration: 280, easing: 'easeOutQuad' });
> }
> ```

### 3.2. タイムラインアニメーション

```javascript
const tl = anime.timeline();
tl.add({ /* ... */ }).add({ /* ... */ });
```
> **プロジェクトでの使用例 (`round.html`):**
> 「ROUND」→「1」→「Get Ready」という一連のテキストを順番に、かつタイミングを調整しながら表示・非表示させるためにタイムラインを使用しています。
> ```javascript
> const tl = anime.timeline({ autoplay: false, easing: 'cubicBezier(.2,.8,.2,1)' });
> tl.add({ targets: labelEl, opacity: [0, 1], /* ... */ })
>   .add({ targets: countEl, opacity: [0, 1], /* ... */ }, '-=80')
>   .add({ targets: subEl, opacity: [0, 1], /* ... */ }, '-=160')
>   .add({ duration: 420 })
>   .add({ targets: [labelEl, countEl, subEl], opacity: [1, 0] });
> ```

## 4. ユーティリティ関数

### 4.1. ランダムな数値

```javascript
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
```
> **プロジェクトでの使用例 (`janken_battle.html`):**
> CPUが出す手を「グー・チョキ・パー」の中からランダムに決定しています。
> ```javascript
> function pickCPU() {
>   const keys = Object.keys(CHOICES);
>   return keys[Math.floor(Math.random() * keys.length)];
> }
> ```

### 4.2. 配列のシャッフル

```javascript
function shuffle(array) { /* ... */ }
```
> **プロジェクトでの使用例 (`mash.html`):**
> ゲーム開始時に、プレイヤーとCPUが食べる料理のリスト（キュー）をランダムな順序に並び替えるために使用しています。
> ```javascript
> function shuffle(a) { /* ... */ }
> function refillQueues() {
>   meQueue = shuffle([...DEFAULT_FOODS]);
>   opQueue = shuffle([...DEFAULT_FOODS]);
> }
> ```

### 4.3. 遅延実行

```javascript
setTimeout(() => { /* ... */ }, 1000);
```
> **プロジェクトでの使用例 (`janken_battle.html`):**
> 「ジャン→ケン→ポン」の掛け声を一定の間隔（360ms）を空けて表示するために使用しています。
> ```javascript
> function startBattle(playerKey) {
>   // ...
>   chant.textContent = 'ジャン';
>   setTimeout(() => { chant.textContent = 'ケン'; }, 360);
>   setTimeout(() => { chant.textContent = 'ポン!'; /* ... */ }, 720);
> }
> ```

## 5. 状態管理 (localStorage)

```javascript
function saveData(state) {
  localStorage.setItem('my-key', JSON.stringify(state));
}
```
> **プロジェクトでの使用例 (`options.html`):**
> ユーザーが設定画面で変更した内容（音量、テーマ、言語など）をブラウザに保存し、次回起動時にも同じ設定が復元されるようにしています。
> ```javascript
> const storeKey = 'calorieClash.options';
> const state = { volume: 40, /* ... */ };
>
> function load() {
>   try { Object.assign(state, JSON.parse(localStorage.getItem(storeKey)) || {}); } catch (_) {}
> }
>
> function save() {
>   localStorage.setItem(storeKey, JSON.stringify(state));
> }
> ```