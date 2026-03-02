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
- コンタクトセクションは全ページ共通コンポーネント（ContactSection.tsx）
- AboutSectionはトップページのみに配置

## デザインルール
- カラー: ダークパープル背景（#362742 → #1a0f24 → #211829）
- グラスモーフィズム: backdrop-blur-[16px] + bg-white/[0.06] + border-white/10
- 画面内のblur要素は5個以下、blur値は25px以下
- テキスト: 白系（#f0f0f5）、コントラスト比4.5:1以上
- フォント: Jost（見出しラテン）+ Sawarabi Gothic（本文日本語）
- ヒーロー: ノイズテクスチャ + 4ブロブ（緩急アニメーション）+ グリッドパターン
- 実績カード: デュオトーン処理（grayscale → color blend → bottom fade）
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
- prototype-v5.jsx: 承認済みデスクトッププロトタイプ（全ページ遷移・ビジュアル確定）
- spec.md: 仕様書v4（詳細なデザイントークン・レイヤー構成・パフォーマンス目標あり）

## 規約
- コミット: Conventional Commits（feat:, fix:, docs:, style:, refactor:）
- lang属性: <html lang="ja">
- 全画像にalt属性必須
- Astroの<Image />コンポーネントで画像最適化
- CSSカスタムプロパティでデザイントークン管理
