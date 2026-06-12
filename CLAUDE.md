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
- ホスティング: Cloudflare Workers（Static Assets）
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
- コンタクトセクションは全ページ共通コンポーネント（ContactSection.tsx）
- AboutSectionはトップページのみに配置

## デザインルール
- カラー: 2モード制。ライト（デフォルト）= ネイビー×ピュアホワイト、ダーク = ネイビー×セージ
- 色はすべて global.css のセマンティック変数（--accent, --card-bg 等）を参照。生値の直書き禁止
- モード切替: class戦略（html.dark）。初期値は localStorage > prefers-color-scheme の優先順
- グラスモーフィズム: ダークは白アルファ+inset、ライトは白0.78+ネイビーボーダー+ソフトシャドウ（insetなし）
- 画面内のblur要素は5個以下、blur値は25px以下
- コントラスト比4.5:1以上を両モードで維持
- フォント: Jost（見出しラテン）+ Sawarabi Gothic（本文日本語）
- ヒーロー: ノイズ（ライト=multiply 0.025 / ダーク=overlay 0.035）+ 4ブロブ + グリッドパターン
- 実績カード: デュオトーン処理（ライトはほぼ原色 grayscale(15%) saturate(1.08) contrast(1.06) + ティント0.25、ダークは grayscale(100%) brightness(0.6) + ティント1.0）
- 画像素材: サムネイルは2400×1350で用意し、表示側で densities による srcset を必ず指定（Retina対応）
- 実績詳細ページでは画像は原色表示（デュオトーンなし）
- ホバー: translateY(-4px) + border明度アップ、transition 0.35s cubic-bezier(0.4,0,0.2,1)

## コンテンツ
- content/works/ にMarkdownで制作実績を管理
- Zodスキーマ（content.config.ts）に従うこと
- serviceCategory は配列（1つの実績が複数サービスにまたがる場合あり）
- 画像は各記事フォルダに同居させる
- featured: true は最大3件（トップページ表示用）

## ナビゲーション
- 3項目: ホーム | サービス | お問い合わせ
- すべてトップページ内アンカーリンク（#hero, #services, #contact）
- IntersectionObserverでアクティブ状態を追跡
- 中間セクション（#works, #about）ではどのナビもアクティブにならない
- 下層ページからのナビクリック時はトップに遷移してからスクロール

## Reactアイランド
- .astroファイルをデフォルトで使用、JSが必要な場合のみ.tsx
- MobileMenu.tsx — client:load（メニュー開閉）
- ContactSection.tsx — client:visible（フォームバリデーション + API送信）
- WorkFilter.tsx — client:load（実績一覧のフィルタータブ）
- それ以外は.astro（JSゼロ）

## デザインリファレンス
- prototype-v5.jsx: 承認済みデスクトッププロトタイプ（カラーは docs/color-redesign-instructions.md が優先。レイアウトの参照元としては有効）
- docs/color-redesign-instructions.md: カラーリデザイン指示書（2モード制パレットの正）
- spec.md: 仕様書v4（詳細なデザイントークン・レイヤー構成・パフォーマンス目標あり）

## 規約
- コミット: Conventional Commits（feat:, fix:, docs:, style:, refactor:）
- lang属性: <html lang="ja">
- 全画像にalt属性必須
- Astroの<Image />コンポーネントで画像最適化
- CSSカスタムプロパティでデザイントークン管理
- **CSS 棲み分けルール**: `docs/css-strategy.md` を参照すること
  （Tailwind と style タグの混在禁止、詳細度競合の防止策）
