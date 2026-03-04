# CSS 棲み分けルール

> **教訓**: cmd_085 ContactSection 事故（Tailwind `px-6` が `#contact` IDセレクタに上書きされ、
> 横パディングが適用されなかった）を二度と起こさないためのルールを定める。

---

## 1. 基本原則

**1プロパティに対して、Tailwind か style/CSS のいずれか一方のみで管理する。混在禁止。**

```
✅ OK: padding を Tailwind の px-6 py-[14px] だけで管理
✅ OK: padding を <style>タグの padding: 14px 24px だけで管理
❌ NG: px を Tailwind で、py を <style>タグで管理（詳細度競合が起きる）
```

---

## 2. Tailwind 担当領域

Tailwind クラスで管理するプロパティ:

| カテゴリ | 例 |
|---------|-----|
| レイアウト | `flex`, `grid`, `items-center`, `justify-between` |
| スペーシング | `m-4`, `p-6`, `gap-2`, `space-y-4` |
| タイポグラフィ | `text-sm`, `font-medium`, `leading-relaxed` |
| 色・背景 | `text-white`, `bg-white/10`, `border-white/15` |
| レスポンシブ | `md:grid-cols-2`, `sm:px-4` |
| 基本インタラクション | `hover:opacity-80`, `transition-colors`, `duration-300` |
| サイズ | `w-full`, `h-48`, `max-w-xl`, `rounded-lg` |

---

## 3. style タグ担当領域

`<style>` タグ（または CSS ファイル）で管理するプロパティ:

| カテゴリ | 例 |
|---------|-----|
| 擬似要素 | `::before`, `::after` |
| 複合セレクタ | `:nth-child()`, `:not()`, `> *`, `+ *` |
| @keyframes | アニメーション定義 |
| CSS カスタムプロパティ | `--color-accent: #8b5cf6` |
| 複合スタイル | `backdrop-filter: blur(20px) saturate(200%)` |
| Tailwind で表現困難なもの | `appearance: none`, `clip-path`, 複雑な `grid-template-areas` |

---

## 4. ファイル種別ルール

### `.astro` ファイル
- **Tailwind 推奨**
- scoped `<style>` も安全（Astro がクラス名をスコープ化するため詳細度競合が起きにくい）
- ただし同プロパティの Tailwind/style 混在は禁止

### `.tsx` (React) ファイル
- **Tailwind 推奨**
- `<style>` タグは**非推奨**（グローバルに注入され、スコーピングがない）
- IDセレクタ `#id` は Tailwind クラスより詳細度が高い → Tailwind が無視される
- `<style>` タグが必要な場合（`@keyframes` 等）は padding など通常プロパティを混在させない

### `global.css`
- グローバルユーティリティ（`.glass`、`:root` カスタムプロパティ）のみ
- コンポーネント固有スタイルを書かない

---

## 5. React (.tsx) での特別注意事項

### 詳細度の問題

CSS セレクタの詳細度（Specificity）は高い方が優先される:

```
#contact input[type="text"]  → (1, 0, 1) = 101  ← IDセレクタ + 属性セレクタ
.px-6                        → (0, 1, 0) = 10   ← クラスセレクタ
```

**IDセレクタは Tailwind クラスを常に上書きする。**

### React コンポーネントでの正しい使い方

```tsx
// ❌ 危険: padding が混在している
const inputClass = "w-full px-6 py-4 rounded-lg ...";

// <style> タグ内で別のプロパティが同じ要素に当たる
// #contact input { padding-top: 14px; padding-bottom: 14px; } ← px-6 が無視される

// ✅ 安全: padding は <style>タグに一元化
const inputClass = "w-full rounded-lg ..."; // padding クラスを含めない

// <style> タグ内で全方向を shorthand で指定
// #contact input { padding: 14px 24px; } ← 確実に適用される
```

### `<style>` タグが必要な場合の安全な書き方

```tsx
<style>{`
  /* @keyframes は style タグでしか書けないので OK */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* padding を style タグで管理するなら shorthand で全方向指定 */
  #contact input[type="text"],
  #contact input[type="email"] {
    padding: 14px 24px;  /* ← shorthand で top/right/bottom/left を一括指定 */
    box-sizing: border-box;
  }

  /* ❌ この書き方は危険（left/right が Tailwind に渡ってしまう） */
  /* #contact input { padding-top: 14px; padding-bottom: 14px; } */
`}</style>
```

---

## 6. glass 系スタイルの管理

`global.css` の `.glass` クラスに集約する。

```css
/* global.css ← ここに集約 */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  /* ... */
}
```

**インラインの `style={{ backdropFilter: "blur(20px)" }}` は禁止。**
`.glass` クラスを使うこと。

---

## 7. アンチパターン（実例）

### ❌ cmd_085 ContactSection 事故

**症状**: フォーム入力欄の横パディング（左右の余白）が適用されなかった。

**原因**:
```tsx
// Tailwind で横パディングを指定
const inputClass = "w-full px-6 py-[14px] ..."; // px-6 = 24px

// <style>タグで縦パディングを別途指定
// → #contact のIDセレクタ（詳細度101）が .px-6（詳細度10）を上書き
// → padding-top/bottom は style タグが勝つが、padding-left/right の扱いが不定に
<style>{`
  #contact input[type="text"] {
    padding-top: 14px;
    padding-bottom: 14px;
  }
`}</style>
```

**修正**:
```tsx
// Tailwind から padding を除外
const inputClass = "w-full rounded-[10px] ..."; // padding クラスなし

// style タグで全方向を一括指定
<style>{`
  #contact input[type="text"],
  #contact input[type="email"] {
    padding: 14px 24px; /* shorthand で全方向 */
  }
`}</style>
```

**教訓**:
1. React `.tsx` では `<style>` タグと Tailwind の同プロパティ混在を絶対に避ける
2. shorthand プロパティ（`padding: top right bottom left`）で全方向を一括指定すると安全
3. `<style>` タグで padding を管理するなら、Tailwind の `px-*`, `py-*`, `p-*` クラスを削除する
