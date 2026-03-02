# take77 ポートフォリオサイト リビルド仕様書 v4

**最終更新: 2026/03/02**
**目的: この文書をもとにClaude Codeでポートフォリオサイトを再構築する**
**プロトタイプ: prototype-v5.jsx（承認済み）**

---

## 変更履歴

| バージョン | 日付 | 主な変更点 |
|-----------|------|-----------|
| v1 | 2026/03/01 | 初版作成 |
| v2 | 2026/03/01 | サービス/実績統合構造決定、Content Collections設計 |
| v3 | 2026/03/01 | ナビ3項目化、ページ構成確定 |
| v4 | 2026/03/02 | サービス一覧ページ削除、実績一覧ページ追加、コンタクト全ページ共通化、ヒーロービジュアル強化（ノイズ/ブロブ洗練/グリッド）、実績カードデュオトーン、モバイル対応検証済み |

---

## 1. プロジェクト概要

### 1.1 何を作るか

take77のフリーランス向けポートフォリオサイトを、Gatsby v3 + Material UI v4の現行構成から、Astro 5 + Tailwind CSSで完全に再構築する。ブログ機能は持たず（技術記事はZenn、それ以外はNoteに執筆）、制作実績の追加更新をMarkdownで行うシンプルな構成とする。

### 1.2 決定済み事項

| 項目 | 決定内容 |
|------|---------|
| フレームワーク | **Astro 5**（SSG） |
| ホスティング | **Cloudflare Pages** |
| 日本語フォント | **Sawarabi Gothic**（+ Jostで見出し） |
| ブログ | **なし**（Zenn / Note に外部化） |
| i18n | **ミニマル**（日本語主体、UIラベルに英語併記） |
| アナリティクス | **GA4**（下記注意事項あり） |
| 既存コンテンツ | **移行しない**（Zenn/Noteに既存、サイトからは削除） |

### 1.3 現行サイトの課題と解決方針

| 課題 | 原因 | 本プロジェクトでの解決 |
|------|------|----------------------|
| 表示が重い | Material UI ~300KB、Gatsby全ページハイドレーション、CJKフォント4書体 | Astroゼロ JS + Tailwind ~10KB + フォント2書体 |
| 更新されない | Contentful CMSの更新が面倒 | Markdownファイルをgit pushするだけ |
| パッケージが古い | Gatsby v3、React 17、MUI v4 すべてEOL | 全面刷新 |
| デザインが古い | MUIのマテリアルデザイン固定 | グラスモーフィズム + Tailwindで自由設計 |

---

## 2. 技術スタック

```
フレームワーク     Astro 5（SSGモード）
言語              TypeScript（strictモード）
スタイリング       Tailwind CSS v4
UIコンポーネント   shadcn/ui（必要なもののみ）
コンテンツ管理     Astro Content Collections + Markdown
画像最適化         Astro Image（ビルトイン、Sharp）
シンタックスハイライト  Shiki（Astro標準）
アナリティクス     Google Analytics 4
コンタクトフォーム  Web3Forms + Cloudflare Turnstile
ホスティング       Cloudflare Pages
CI/CD            Cloudflare Pages自動デプロイ + GitHub Actions
```

---

## 3. サイト構造

### 3.1 サイトマップ

```
/                                          → トップページ（ワンページ構成）
│                                              ├── #hero（ヒーロー）
│                                              ├── #services（提供サービス概要 × 4）
│                                              ├── #works（実績ハイライト × 3 + もっと見る）
│                                              ├── #about（自己紹介）
│                                              └── #contact（お問い合わせフォーム）
├── /services/system-development           → システム開発（詳細 + 関連実績 + コンタクト）
├── /services/web-development              → HP開発・運用（詳細 + 関連実績 + コンタクト）
├── /services/business-planning            → 経営企画（詳細 + 関連実績 + コンタクト）
├── /services/video-editing                → 動画編集（詳細 + 関連実績 + コンタクト）
├── /works                                 → 実績一覧（フィルタ付き全件表示 + コンタクト）
├── /works/[slug]                          → 実績詳細（フラットURL）
├── /privacy                               → プライバシーポリシー
└── /sitemap.xml                           → サイトマップ（自動生成）
```

**v3からの構造変更点：**

| 変更 | 理由 |
|------|------|
| `/services`（一覧ページ）を削除 | トップの `#services` セクションから直接個別ページに飛べるため冗長 |
| `/works`（一覧ページ）を追加 | 実績増加時の受け皿。トップは3件固定 + 「すべての実績を見る」ボタン |
| `/contact` を削除 | トップ・サービス個別・実績一覧すべてにコンタクトセクションを共通配置 |
| `/about` を削除 | トップの `#about` セクションに統合。ペンネーム活動のため優先度低 |

### 3.2 ナビゲーション（3項目）

```
ホーム | サービス | お問い合わせ
```

すべてトップページ内のアンカーリンク（`#hero`、`#services`、`#contact`）。サービス個別ページや実績一覧など下層ページにいる場合は、トップに遷移してからスクロールする。

**ナビアクティブ状態の仕様：**

`IntersectionObserver` で各セクションの可視状態を追跡し、下線（`2px solid #8b5cf6`）を表示する。

| セクション表示中 | ホーム | サービス | お問い合わせ |
|----------------|--------|---------|------------|
| #hero | **アクティブ** | - | - |
| #services | - | **アクティブ** | - |
| #works / #about（中間地帯） | - | - | - |
| #contact | - | - | **アクティブ** |

中間地帯（実績ハイライト・About）ではどのナビにも下線が出ない。これは意図的な設計で、Linear等のリファレンスサイトでも同様の挙動。

**フッター：** Aboutへのリンク（`#about` へスクロール）+ 外部リンク（Zenn / Note / GitHub）

### 3.3 各ページの構成要素

**トップページ（/） — ワンページ構成**

| セクション | ID | 内容 |
|-----------|-----|------|
| 1. ヒーロー | `#hero` | キャッチコピー「Technology meets Creativity」、サブテキスト、CTAボタン×2（サービスを見る / お問い合わせ）、グリッドパターン背景 |
| 2. 提供サービス | `#services` | 4サービスをグラスカードで表示、各カードから `/services/[service]` へリンク |
| 3. 実績ハイライト | `#works` | `featured: true` の実績を**3件固定**で表示（デュオトーン画像付き）、「すべての実績を見る →」ボタンで `/works` へ遷移 |
| 4. 自己紹介 | `#about` | アバター、名前、肩書き、自己紹介文、強み3点（フリーランス/フルスタック/経営視点）、外部リンク（Zenn/Note/GitHub） |
| 5. お問い合わせ | `#contact` | コンタクトフォーム（共通コンポーネント） |

**実績一覧ページ（/works）**
- パンくず：ホーム > 実績一覧
- フィルタータブ：すべて / システム開発 / HP開発・運用 / 経営企画 / 動画編集
- 全実績をデュオトーンカードで表示（`auto-fill` グリッド、カード幅300px〜固定）
- 各カードに「詳しく見る →」リンク
- コンタクトセクション（共通コンポーネント）

**サービス個別ページ（/services/[service]）**
- パンくず：ホーム > サービス名（サービス一覧ページは存在しないため2階層）
- サービス詳細：概要、対応範囲、使用技術、プロセス（4ステップ）
- 関連実績セクション：`serviceCategory` にこのサービスを含む実績をデュオトーンカードで表示
- コンタクトセクション（共通コンポーネント）

**実績詳細（/works/[slug]）**
- パンくず：ホーム > 実績 > プロジェクト名
- アイキャッチ画像（実際のスクリーンショット、デュオトーン処理なし）
- プロジェクト情報（クライアント、期間、担当範囲、技術スタック）
- 関連サービスタグ（複数表示可、各サービスページへリンク）
- 本文（課題 → アプローチ → 成果の構成）
- コンタクトセクション（共通コンポーネント）

### 3.4 コンタクトセクション（共通コンポーネント）

全ページのコンテンツ末尾に配置する共通セクション。離脱前に問い合わせを促す。

- セクション幅：`max-width: 1200px`（他セクションと左端揃え）
- フォームカード幅：`max-width: 720px` + `margin: 0 auto`（中央寄せ）
- フィールド：名前*、メールアドレス*、ご興味のあるサービス（セレクト）、メッセージ*
- 送信後：「送信しました」確認表示
- 説明文：「ご相談・お見積りは無料です。2営業日以内にご返信いたします。」

---

## 4. コンテンツ管理

### 4.1 Content Collections定義

```typescript
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// サービスカテゴリの定義（一箇所で管理）
const serviceCategoryEnum = z.enum([
  "system-development",
  "web-development",
  "business-planning",
  "video-editing",
]);

const works = defineCollection({
  loader: glob({ pattern: "**/index.md", base: "./content/works" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      client: z.string().optional(),
      serviceCategory: z.array(serviceCategoryEnum).min(1),
      technologies: z.array(z.string()).default([]),
      thumbnail: image(),
      url: z.string().url().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = { works };
```

**実績一覧ページでのフィルタ取得例：**

```typescript
// src/pages/works/index.astro
import { getCollection } from "astro:content";

const allWorks = await getCollection("works", ({ data }) => !data.draft);
// フィルタはクライアントサイドでタブ切り替え（Reactアイランド）
```

**サービスページでの関連実績取得例：**

```typescript
// src/pages/services/web-development.astro
import { getCollection } from "astro:content";

const relatedWorks = await getCollection("works", ({ data }) =>
  !data.draft && data.serviceCategory.includes("web-development")
);
```

### 4.2 ディレクトリ構造

```
content/
└── works/
    ├── project-alpha/
    │   ├── index.md
    │   ├── thumbnail.jpg        ← デュオトーン処理はビルド時にSharpで適用
    │   └── screenshot-01.png    ← 実績詳細ページで使用（原色表示）
    └── corporate-site-redesign/
        ├── index.md
        ├── thumbnail.jpg
        └── before-after.png
```

### 4.3 実績記事のフロントマター例

```yaml
---
title: "〇〇株式会社 コーポレートサイトリニューアル"
description: "老朽化した企業サイトをNext.js + microCMSで再構築し、表示速度を3倍に改善"
date: 2025-08-15
client: "〇〇株式会社"
serviceCategory:
  - "web-development"
technologies: ["Next.js", "TypeScript", "Tailwind CSS", "microCMS", "Vercel"]
thumbnail: ./thumbnail.jpg
url: "https://example.com"
featured: true
draft: false
---

## プロジェクト概要

（本文をMarkdownで記述）

## 課題

## アプローチ

## 成果
```

### 4.4 新しい実績を追加する手順

1. `content/works/` に新しいフォルダを作成
2. `index.md` にフロントマターと本文を記述
3. 画像を同フォルダに配置
4. `git push` → Cloudflare Pagesが自動ビルド・デプロイ

---

## 5. デザイン仕様

### 5.1 カラーパレット

```
背景グラデーション:    linear-gradient(135deg, #362742 0%, #1a0f24 50%, #211829 100%)
アクセントブロブ:      rgba(139, 92, 246, 0.28)  — パープル（プライマリ）
                      rgba(236, 72, 153, 0.18)  — ピンク
                      rgba(59, 130, 246, 0.14)   — ブルー
                      rgba(167, 139, 250, 0.10)  — ライトパープル（深度用）
テキスト（本文）:      #f0f0f5
テキスト（見出し）:    #ffffff
テキスト（サブ）:      rgba(255, 255, 255, 0.5)
テキスト（アクセント）: #a78bfa
グラスカード背景:      rgba(255, 255, 255, 0.06)
グラスカードボーダー:   rgba(255, 255, 255, 0.1)
アクセントカラー:      #8b5cf6
アクセント（ホバー）:   #7c3aed
```

### 5.2 ヒーロービジュアル（v4で追加）

ヒーローセクションの背景には3つのビジュアルレイヤーを重ねる。

**① ノイズテクスチャオーバーレイ（画面全体）**
- SVG `feTurbulence` フィルターによるフラクタルノイズ
- `opacity: 0.035` + `mix-blend-mode: overlay`
- `position: fixed` で全画面、`pointer-events: none`
- パフォーマンスコスト：ほぼゼロ（1回描画）

**② アニメーションブロブ（画面全体、4つ）**

| ブロブ | サイズ | 色 | 動き | 周期 |
|-------|-------|-----|------|------|
| Primary | 550px | パープル 0.28 | 広い楕円軌道 + スケールパルス | 28s |
| Pink | 480px | ピンク 0.18 | カウンター周回、非対称イージング | 24s |
| Blue | 420px | ブルー 0.14 | タイトな周回 | 19s |
| Ambient | 350px | ライトパープル 0.10 | 超低速ドリフト + 不透明度パルス | 35s |

すべて `cubic-bezier` による緩急のあるイージングを使用。`filter: blur(80〜100px)`。

**③ グリッドパターン（ヒーローセクションのみ）**
- 80px間隔の格子線、`opacity: 0.04`
- `mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 70%)` で中央にフェード
- ヒーローに構造的な奥行きを追加

### 5.3 実績カード画像（デュオトーン処理）

トップページ・実績一覧・サービス個別ページの実績カードでは、サムネイル画像にデュオトーン処理を施す。

**処理レイヤー（上から順）：**
1. 下端フェード：`linear-gradient(to bottom, transparent 50%, カード背景色 100%)`
2. カラーオーバーレイ（overlay）：`案件テーマカラー 0.27 → transparent`
3. カラーティント（color blend）：`案件テーマカラー 0.8 → 0.4`
4. ベース画像：`grayscale(100%) brightness(0.6) contrast(1.1)`

**ビルド時処理（推奨）：** Sharpでグレースケール+コントラスト調整済み画像を生成し、CSSの `filter` を省略してランタイムコストを削減。カラーティントはCSS `mix-blend-mode: color` で実行時に適用（案件ごとに色が異なるため）。

**実績詳細ページ（/works/[slug]）では原色表示。** デュオトーンはあくまでカード上のショーケース用。詳細ページでは実際のスクリーンショットをそのまま表示する。

### 5.4 グラスモーフィズムの適用ルール

**適用する要素（5つ以内/画面）：**
- ナビゲーションバー（スクロール時にブラー背景）
- サービスカード
- 実績カード
- コンタクトフォーム
- モバイルメニュー（ドロワー）

**適用しない要素：**
- ページ全体の背景
- フッター
- テキストのみのセクション

**基本CSS：**
```css
.glass {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
```

**ホバー状態：**
```css
.glass:hover {
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-4px);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**パフォーマンスルール：**
- blur値は25px以下
- 同時にblurを適用する要素は画面内5個以下
- blur値のアニメーションは禁止

**アクセシビリティルール：**
- テキスト背景の不透明度は最低0.06
- WCAG 4.5:1のコントラスト比を維持
- `prefers-reduced-transparency` メディアクエリでフォールバック

### 5.5 フォント設定

```css
:root {
  --font-heading: "Jost", "Sawarabi Gothic", sans-serif;
  --font-body: "Sawarabi Gothic", "Hiragino Kaku Gothic ProN",
               "Noto Sans JP", "Meiryo", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;
}
```

- Jost: ラテン文字見出し用、WOFF2セルフホスト（~20KB）、weight: 200–600
- Sawarabi Gothic: 日本語本文用、WOFF2サブセット配信
- コード用: システムモノスペースフォント
- `font-display: swap` を全フォントに適用

### 5.6 レスポンシブブレークポイント

Tailwind CSS v4のデフォルトを使用：
```
sm:  640px   — モバイル/デスクトップ切替の主要ブレークポイント
md:  768px   — タブレット
lg:  1024px  — デスクトップ
xl:  1280px  — ワイドデスクトップ（max-widthの上限）
```

**モバイル固有の対応（640px以下）：**
- デスクトップナビ非表示 → ハンバーガーメニュー
- サービスカード：1カラム縦積み
- 実績カード：1カラム縦積み
- Aboutセクション：アバター部分が上、テキスト部分が下の縦レイアウト
- フォームの名前/メールアドレス：2カラム → 1カラム
- ヒーローCTAボタン：横並び → 縦並び
- グリッドパターン：間隔を60pxに縮小

### 5.7 既存デザイン要素の継承/廃止

| 要素 | 方針 |
|------|------|
| 六角形リンクブロック（トップ） | 廃止 → グラスカードグリッドに置換 |
| ダークパープル背景 | **継承**（グラデーション維持 + ノイズ/グリッド追加） |
| Jost + Stick の見出しフォント | Jost継承、Stick廃止 → Sawarabi Gothicに統一 |
| FABメニューボタン | 廃止 → 通常のハンバーガーメニューに |
| FirstView（画像+タイトルオーバーレイ） | 簡素化 → ヒーローセクションに統合 |
| 白文字 + 高行間レイアウト | **継承**（可読性が高い） |

---

## 6. GA4に関する注意事項

GA4は導入自体は問題ないが、以下の点を考慮する必要がある。

**クッキー同意バナーについて：**
2023年6月施行の改正電気通信事業法（外部送信規律）により、GA4のようなサードパーティクッキーを使用するツールは、原則として通知または公表が必要。ただし、個人のポートフォリオサイト（電気通信事業者ではない場合）は法律上の対象外になる可能性が高い。念のため、プライバシーポリシーページにGA4の使用を明記し、オプトアウト方法を記載するのが安全。

**実装方法：**
```html
<script is:inline async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**パフォーマンスへの影響：**
GA4スクリプト（gtag.js）は約28KBのJSを読み込む。将来的にCloudflare Web Analytics（~5KB、クッキー不要）への切り替えも検討の余地がある。

**推奨対応：**
1. まずGA4で開始する
2. プライバシーポリシーにGA4使用を明記
3. Cloudflare Web Analyticsを併用してサーバーサイドの基本計測も確保

---

## 7. パフォーマンス目標

| 指標 | 目標値 |
|------|-------|
| Lighthouse Performance（デスクトップ） | 95+ |
| Lighthouse Performance（モバイル） | 90+ |
| LCP（Largest Contentful Paint） | < 2.5秒 |
| INP（Interaction to Next Paint） | < 200ms |
| CLS（Cumulative Layout Shift） | < 0.1 |
| 初期読み込みJS（GA4除く） | < 20KB |
| 合計CSS | < 30KB |
| フォント合計 | < 500KB（CJKサブセット含む） |

**パフォーマンスガードレール（デザイン仕様に起因するもの）：**
- ヒーロー画像（もし追加する場合）：`<img>` タグ使用（CSS `background-image` 禁止）、AVIF + WebPフォールバック、100KB以下、lazy-load禁止（LCP要素）
- ブラー処理：ビルド時適用推奨、ランタイム `filter: blur()` は最小限に
- ノイズテクスチャ：SVGフィルターで1回描画、パフォーマンスコストほぼゼロ

---

## 8. プロジェクト構造（Astro）

```
take77-portfolio/
├── public/
│   ├── favicon.svg
│   ├── og-image.jpg
│   └── fonts/
│       ├── jost-variable.woff2
│       └── sawarabi-gothic-subset.woff2
├── content/
│   └── works/
│       └── (実績記事フォルダ)
├── src/
│   ├── components/
│   │   ├── ui/            ← shadcn/ui コンポーネント（使うものだけ）
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   ├── BaseLayout.astro
│   │   │   └── MobileMenu.tsx    ← Reactアイランド
│   │   ├── home/
│   │   │   ├── Hero.astro
│   │   │   ├── ServiceOverview.astro
│   │   │   ├── FeaturedWorks.astro
│   │   │   └── AboutSection.astro
│   │   ├── services/
│   │   │   ├── ServiceSection.astro
│   │   │   └── RelatedWorks.astro
│   │   ├── works/
│   │   │   ├── WorkCard.astro        ← デュオトーン画像付き実績カード
│   │   │   ├── WorkDetail.astro
│   │   │   ├── WorkFilter.tsx        ← Reactアイランド（フィルタータブ）
│   │   │   └── ServiceTags.astro
│   │   ├── contact/
│   │   │   └── ContactSection.tsx    ← Reactアイランド（共通コンポーネント）
│   │   └── common/
│   │       ├── GlassCard.astro
│   │       ├── SectionTitle.astro
│   │       ├── Breadcrumb.astro
│   │       ├── DuotoneImage.astro    ← デュオトーン画像処理
│   │       ├── BackgroundBlobs.astro
│   │       ├── NoiseOverlay.astro
│   │       └── GridPattern.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro                        ← トップ（ワンページ）
│   │   ├── services/
│   │   │   ├── system-development.astro
│   │   │   ├── web-development.astro
│   │   │   ├── business-planning.astro
│   │   │   └── video-editing.astro
│   │   ├── works/
│   │   │   ├── index.astro                    ← 実績一覧（フィルタ付き）
│   │   │   └── [...slug].astro                ← 実績詳細
│   │   └── privacy.astro
│   ├── styles/
│   │   └── global.css
│   └── content.config.ts
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md
└── .github/
    └── workflows/
        └── ci.yml
```

### Reactアイランドの使い分け

| コンポーネント | ファイル形式 | 理由 |
|--------------|------------|------|
| ヘッダー（スクロール検知 + IntersectionObserver） | `.astro` + `<script>` | バニラJSで十分 |
| モバイルメニュー | `.tsx` + `client:load` | 開閉のステート管理 |
| コンタクトフォーム | `.tsx` + `client:visible` | バリデーション + API送信 |
| 実績一覧フィルター | `.tsx` + `client:load` | タブ切り替えのステート管理 |
| サービス個別ページ | `.astro` | 静的ページ |
| 実績詳細ページ | `.astro` | Markdownレンダリング、JSゼロ |
| その他すべて | `.astro` | JSゼロ |

---

## 9. SEOとメタデータ

### 9.1 URL設計

現行サイトのURLと新サイトのURLが異なる場合、Cloudflare Pagesの `_redirects` ファイルで301リダイレクトを設定する。

```
# _redirects（public/に配置）
/developments/*  /works/:splat  301
/graphics/*      /works/:splat  301
/hobbies/*       /works/:splat  301
/others/*        /works/:splat  301
/contact         /               301
/about           /               301
/services        /               301
```

### 9.2 構造化データ（JSON-LD）

**サイト全体（BaseLayout）：**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "take77",
    "url": "https://take77-port.com",
    "sameAs": [
      "https://github.com/take77",
      "https://zenn.dev/take77",
      "https://note.com/take77_note"
    ],
    "knowsAbout": [
      "System Development", "Web Development",
      "Business Planning", "Video Editing"
    ]
  }
}
```

**サービス個別ページ：**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "provider": { "@type": "Person", "name": "take77" },
  "name": "HP開発・運用",
  "description": "...",
  "url": "https://take77-port.com/services/web-development"
}
```

### 9.3 OGP / Twitterカード

各ページに適切なOGPメタデータを設定。`BaseLayout.astro` でデフォルト値を定義し、各ページでオーバーライド。実績詳細ページではフロントマターの `thumbnail` を og:image に使用。

---

## 10. コンタクトフォーム実装

### Web3Forms

共通コンポーネント `ContactSection.tsx` としてReactアイランドで実装。

```html
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />
  <input type="checkbox" name="botcheck" class="hidden" />
  <div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>
  <input type="text" name="name" placeholder="お名前" required />
  <input type="email" name="email" placeholder="メールアドレス" required />
  <select name="service">
    <option value="">ご興味のあるサービス</option>
    <option value="system-development">システム開発</option>
    <option value="web-development">HP開発・運用</option>
    <option value="business-planning">経営企画</option>
    <option value="video-editing">動画編集</option>
    <option value="other">その他</option>
  </select>
  <textarea name="message" placeholder="メッセージ" required></textarea>
  <button type="submit">送信</button>
</form>
```

バリデーション（メールアドレス形式チェック、必須項目確認）と送信状態管理（ローディング、成功、エラー）をReactで実装。

---

## 11. CI/CDパイプライン

### GitHub Actions

```yaml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
```

### Cloudflare Pagesの設定

- ビルドコマンド: `npm run build`
- 出力ディレクトリ: `dist`
- `main` ブランチへのプッシュで本番デプロイ
- PRごとにプレビューURL自動生成

---

## 12. CLAUDE.md（Claude Code用）

```markdown
# CLAUDE.md

## プロジェクト概要
日本のフリーランス開発者（take77）のポートフォリオサイト。
制作実績を中心とした静的サイト。ブログ機能なし（Zenn/Noteに外部化）。

## 技術スタック
- フレームワーク: Astro 5（SSGモード、Reactアイランド対応）
- 言語: TypeScript（strict）
- スタイリング: Tailwind CSS v4（CSS-in-JS禁止）
- コンポーネント: shadcn/ui（必要なもののみ）
- コンテンツ: Markdown + Content Collections + Zod
- ホスティング: Cloudflare Pages
- フォーム: Web3Forms
- アナリティクス: GA4

## コマンド
- npm run dev — 開発サーバー（localhost:4321）
- npm run build — プロダクションビルド
- npm run preview — ビルド結果プレビュー
- npm run lint — ESLint
- npm run typecheck — astro check
- npm run format — Prettier

## サイト構造
- トップページはワンページ構成（#hero → #services → #works → #about → #contact）
- サービス一覧ページは存在しない（トップの#servicesから直接個別ページへ）
- 実績一覧 /works にフィルタータブ付き全件表示
- 実績詳細はフラットURL: /works/[slug]
- コンタクトセクションは全ページ共通コンポーネント
- AboutSectionはトップページのみに配置

## デザインルール
- カラー: ダークパープル背景（#362742 → #1a0f24 → #211829）
- グラスモーフィズム: backdrop-blur-[16px] + bg-white/[0.06] + border-white/10
- 画面内のblur要素は5個以下、blur値は25px以下
- テキスト: 白系（#f0f0f5）、コントラスト比4.5:1以上
- フォント: Jost（見出しラテン）+ Sawarabi Gothic（本文日本語）
- ヒーロー: ノイズテクスチャ + 4ブロブ（緩急アニメーション）+ グリッドパターン
- 実績カード: デュオトーン処理（grayscale → color blend → fade）
- 実績詳細ページでは画像は原色表示

## コンテンツ
- content/works/ にMarkdownで制作実績を管理
- Zodスキーマ（content.config.ts）に従うこと
- serviceCategory は配列（1つの実績が複数サービスにまたがる場合あり）
- 画像は各記事フォルダに同居させる
- featured: true は最大3件（トップページ表示用）

## ナビゲーション
- 3項目: ホーム | サービス | お問い合わせ
- すべてトップページ内アンカーリンク
- IntersectionObserverでアクティブ状態を追跡
- 中間セクション（#works, #about）ではどのナビもアクティブにならない

## 規約
- .astroファイルをデフォルトで使用、JSが必要な場合のみ.tsx
- コミット: Conventional Commits
- lang属性: <html lang="ja">
- 全画像にalt属性必須
- Astroの<Image />コンポーネントで画像最適化
```

---

## 13. 実装フェーズ

### Phase 1: 基盤構築（目安: 1日）
- Astroプロジェクト初期化
- Tailwind CSS v4設定
- BaseLayout（ヘッダー、フッター、ノイズオーバーレイ、ブロブ背景）
- グローバルスタイル（フォント、カラー変数）
- 共通コンポーネント（GlassCard、SectionTitle、Breadcrumb、DuotoneImage、GridPattern）

### Phase 2: トップページ + サービス個別ページ（目安: 1–2日）
- トップページ（ワンページ構成）
  - Hero（グリッドパターン付き）
  - ServiceOverview（4カード）
  - FeaturedWorks（3件固定 + もっと見るボタン）
  - AboutSection
  - ContactSection（共通コンポーネント初回実装）
- サービス個別ページ × 4
  - サービス説明 + 関連実績 + ContactSection

### Phase 3: 実績機能（目安: 1日）
- Content Collections定義
- 実績一覧ページ（/works）：フィルタータブ + デュオトーンカード
- 実績詳細テンプレート（/works/[slug]）：原色画像表示
- サンプル実績を2–3件作成（うち1件は複数サービスにまたがる例）

### Phase 4: 仕上げ（目安: 1日）
- プライバシーポリシーページ
- SEO対応（メタデータ、OGP、構造化データ、サイトマップ）
- GA4導入
- レスポンシブ検証（モバイル3デバイス以上）
- Lighthouse最適化（目標95+）
- Cloudflare Pagesデプロイ設定
- 旧URLからのリダイレクト設定

---

## 14. 将来の拡張ポイント

- **英語版の追加**: Astroの `i18n` 設定で `/en/` プレフィックスルーティングを追加
- **ダークモード/ライトモード切替**: 現状ダークのみだが、Tailwindの `dark:` プレフィックスで対応可能
- **Zenn/Note記事の自動取得**: RSSフィードをビルド時に取得し、外部記事一覧として表示
- **アニメーション強化**: Framer Motion またはCSS `@starting-style` + View Transitions API
- **Cloudflare Web Analytics併用**: GA4に加えてサーバーサイド計測を追加（クッキー不要）
- **角画像の追加（ヒーロー）**: 自作ビジュアル素材が用意できた場合、`mask-image: radial-gradient` で右上にフェード配置

---

## 15. 承認済みデザインアセット

| ファイル | 内容 | ステータス |
|---------|------|----------|
| `prototype-v5.jsx` | デスクトップ版プロトタイプ（全ページ遷移、ビジュアル確定） | ✅ 承認済み |
| `mobile-preview.jsx` | モバイル版プレビュー（iPhone 15 / SE / Pixel 7） | ✅ 確認済み |
| `comparison.jsx` | 実績カード画像スタイル比較（A/Bテスト） | 参考資料（パターンA採用） |
| `hero-design-report.md` | ヒーロービジュアルデザインリサーチレポート | 参考資料 |
