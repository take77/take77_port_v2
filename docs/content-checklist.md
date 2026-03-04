# コンテンツ差し替えチェックリスト

> **目的**: ポートフォリオサイトのダミーコンテンツを本番データに差し替えるための「埋めるだけテンプレート」。
> 「現在の値（ダミー）」を確認しながら、実際の内容に書き換えてください。

---

## 使い方

1. 各セクションの「現在の値」を確認する
2. 変更が必要な箇所を編集する
3. `[ ]` チェックボックスに `[x]` を入れて完了をマーク

---

## セクション 1: 実績（Works）

**ファイル場所**: `content/works/{スラッグ}/index.md`

### 画像の配置と推奨仕様

- **配置場所**: `content/works/{スラッグ}/thumbnail.jpg`（index.md と同じディレクトリ）
- **フォーマット**: JPEG 推奨（WebP も可）
- **アスペクト比**: 16:9 推奨
- **推奨サイズ**: 1280×720px 以上（表示は 640×360px にリサイズされる）
- **ファイル名**: `thumbnail.jpg`（固定）

### フロントマターのフィールド説明

```yaml
---
title: "案件タイトル"               # 表示名（実績カードに表示）
description: "一文の概要説明"        # カードのサブテキスト（50〜100文字推奨）
date: 2025-01-01                    # 完了日（降順ソートに使用）
client: "クライアント名"             # 会社名・業種など
serviceCategory:                    # 1〜複数選択
  - "system-development"            #   ├ システム開発
  - "web-development"               #   ├ HP開発・運用
  - "business-planning"             #   ├ 経営企画
  - "video-editing"                 #   └ 動画編集
technologies: ["技術1", "技術2"]    # 使用技術（カードに表示）
thumbnail: ./thumbnail.jpg          # 固定（変更不要）
url: "https://example.com"          # 成果物のURL（任意）
featured: true                      # true = トップページに表示（最大3件）
draft: false                        # true = 非公開
---
```

### 本文の構成（Markdown）

```markdown
## プロジェクト概要

（プロジェクトの背景・目的を2〜4文で）

## 課題

- 課題1
- 課題2

## アプローチ

（解決手法・実装内容）

## 成果

- **指標**: 変化（数値があると説得力が増す）
```

---

### 記入例（1件目: `content/works/corporate-site-redesign/`）

> ★ 以下はダミーデータです。実際の案件に書き換えてください。

```yaml
---
title: "株式会社〇〇 コーポレートサイトリニューアル"
description: "老朽化した企業サイトをNext.js + microCMSで再構築し、表示速度を3倍に改善。SEO強化により月間流入数が2倍に増加"
date: 2025-08-15
client: "株式会社〇〇（製造業）"
serviceCategory:
  - "web-development"
technologies: ["Next.js", "TypeScript", "Tailwind CSS", "microCMS", "Vercel"]
thumbnail: ./thumbnail.jpg
url: "https://example.com"
featured: true
draft: false
---
```

---

### 実績リスト（現在 6 件）

件数は自由（最低 2 件推奨、上限なし）。`featured: true` にした実績がトップページに最大 3 件表示されます。

---

#### 1. `content/works/corporate-site-redesign/`

| フィールド | 現在の値（ダミー） | 本番の値 |
|-----------|-----------------|---------|
| title | 株式会社〇〇 コーポレートサイトリニューアル | |
| description | 老朽化した企業サイトをNext.js + microCMSで再構築し、表示速度を3倍に改善。SEO強化により月間流入数が2倍に増加 | |
| date | 2025-08-15 | |
| client | 株式会社〇〇（製造業） | |
| serviceCategory | web-development | |
| technologies | Next.js, TypeScript, Tailwind CSS, microCMS, Vercel | |
| url | https://example.com | |
| featured | true | |
| thumbnail | thumbnail.jpg（差し替え要） | |

- [ ] フロントマター更新
- [ ] 本文（## プロジェクト概要〜## 成果）を実際の内容に書き換え
- [ ] thumbnail.jpg を差し替え

---

#### 2. `content/works/business-process-optimization/`

| フィールド | 現在の値（ダミー） | 本番の値 |
|-----------|-----------------|---------|
| title | 業務プロセス最適化コンサルティング | |
| description | 製造業のDX推進を支援。RPAとワークフローシステム導入で月間40時間の工数削減を実現 | |
| date | 2025-09-10 | |
| client | 〇〇製造株式会社 | |
| serviceCategory | business-planning | |
| technologies | UiPath, Power Automate, kintone, Python | |
| url | （なし） | |
| featured | false | |
| thumbnail | thumbnail.jpg（差し替え要） | |

- [ ] フロントマター更新
- [ ] 本文を実際の内容に書き換え
- [ ] thumbnail.jpg を差し替え

---

#### 3. `content/works/ec-site-renewal/`

| フィールド | 現在の値（ダミー） | 本番の値 |
|-----------|-----------------|---------|
| title | ECサイト全面リニューアル — アパレルブランド | |
| description | Shopify + Headless CMS構成で自社ECサイトを刷新。コンバージョン率が1.5倍に向上 | |
| date | 2025-06-20 | |
| client | 〇〇アパレル株式会社 | |
| serviceCategory | web-development | |
| technologies | Shopify, Liquid, Next.js, Tailwind CSS, Cloudflare | |
| url | （なし） | |
| featured | false | |
| thumbnail | thumbnail.jpg（差し替え要） | |

- [ ] フロントマター更新
- [ ] 本文を実際の内容に書き換え
- [ ] thumbnail.jpg を差し替え

---

#### 4. `content/works/inventory-management-system/`

| フィールド | 現在の値（ダミー） | 本番の値 |
|-----------|-----------------|---------|
| title | 在庫管理システム刷新 — 製造業向け基幹システム | |
| description | Excel管理からの脱却。Ruby on Rails + Reactによるフルスタック在庫管理システムを構築し、在庫ロスを年間800万円削減 | |
| date | 2025-05-20 | |
| client | 〇〇製造株式会社 | |
| serviceCategory | system-development, business-planning | |
| technologies | Ruby on Rails, React, PostgreSQL, AWS, Docker | |
| url | （なし） | |
| featured | true | |
| thumbnail | thumbnail.jpg（差し替え要） | |

- [ ] フロントマター更新
- [ ] 本文を実際の内容に書き換え
- [ ] thumbnail.jpg を差し替え

---

#### 5. `content/works/promo-video-production/`

| フィールド | 現在の値（ダミー） | 本番の値 |
|-----------|-----------------|---------|
| title | 新製品ローンチ プロモーション動画制作 | |
| description | DaVinci Resolve + After Effectsによる2分間のプロモーション動画。製品の世界観を表現する映像編集と3Dモーショングラフィックスを担当 | |
| date | 2025-03-10 | |
| client | 〇〇テクノロジー株式会社 | |
| serviceCategory | video-editing | |
| technologies | DaVinci Resolve, After Effects, Premiere Pro | |
| url | （なし） | |
| featured | false | |
| thumbnail | thumbnail.jpg（差し替え要） | |

- [ ] フロントマター更新
- [ ] 本文を実際の内容に書き換え
- [ ] thumbnail.jpg を差し替え

---

#### 6. `content/works/saas-analytics-dashboard/`

| フィールド | 現在の値（ダミー） | 本番の値 |
|-----------|-----------------|---------|
| title | SaaS型アナリティクスダッシュボード開発 | |
| description | データドリブンな経営判断を支援するリアルタイムダッシュボード。月次レポート作成時間を90%削減 | |
| date | 2025-11-01 | |
| client | 株式会社△△テクノロジー | |
| serviceCategory | system-development | |
| technologies | Next.js, TypeScript, Python, FastAPI, PostgreSQL, AWS | |
| url | （なし） | |
| featured | true | |
| thumbnail | thumbnail.jpg（差し替え要） | |

- [ ] フロントマター更新
- [ ] 本文を実際の内容に書き換え
- [ ] thumbnail.jpg を差し替え

---

#### 新しい実績を追加する場合

```bash
# ディレクトリとファイルを作成
mkdir content/works/{スラッグ名}
# 例: mkdir content/works/my-new-project

# index.md を作成（上記フロントマターテンプレートをコピー）
# thumbnail.jpg を配置
```

スラッグ名はURLになります（例: `my-new-project` → `/works/my-new-project`）。

---

## セクション 2: サービス説明（4ページ）

**ファイル場所**: `src/pages/services/{サービス名}.astro`

各ファイルの編集箇所: `ServiceDetailLayout` コンポーネントの props

```astro
<ServiceDetailLayout
  pageTitle="ページタイトル | take77"       ← <title>タグ
  pageDescription="メタdescription"         ← SEO用説明文
  breadcrumbLabel="パンくず表示名"
  title="サービス名（見出し）"
  subtitle="英語サブタイトル"
  leadText="リード文（1〜2文）"
  bodyText="本文（詳細説明）"               ← 任意（省略可）
  features={features}                       ← 提供内容リスト（下記参照）
/>
```

`features` の構造（各サービスページの冒頭に定義）:

```javascript
const features = [
  { icon: checkIcon, label: '提供内容の名前' },
  // ... 5件程度
];
```

---

### 1. `src/pages/services/system-development.astro`

| フィールド | 現在の値 | □ このままでOK / □ 変更する |
|-----------|---------|--------------------------|
| title | システム開発 | [ ] OK / [ ] 変更 |
| subtitle | System Development | [ ] OK / [ ] 変更 |
| leadText | Webアプリケーション開発からAPI設計、クラウドインフラ構築まで、ビジネスの成長を支えるシステムを設計・開発します。要件定義から設計、実装、運用まで一貫して対応し、スケーラブルで保守性の高いシステムを提供します。 | [ ] OK / [ ] 変更 |
| bodyText | フルスタック開発の経験を活かし、フロントエンドからバックエンド、インフラまでトータルにサポート。モダンな技術スタックと確立されたベストプラクティスで、長期的に価値を生み出すシステムをご提供します。 | [ ] OK / [ ] 変更 |

**features（提供内容）— 現在の値**:

| # | 現在の値 | □ このままでOK / □ 変更する |
|---|---------|--------------------------|
| 1 | Webアプリケーション設計・開発 | [ ] OK / [ ] 変更: |
| 2 | REST API / GraphQL API 設計・実装 | [ ] OK / [ ] 変更: |
| 3 | クラウドインフラ構築（AWS / GCP） | [ ] OK / [ ] 変更: |
| 4 | データベース設計・最適化 | [ ] OK / [ ] 変更: |
| 5 | CI/CD パイプライン構築 | [ ] OK / [ ] 変更: |

- [ ] 変更なし（そのまま公開）
- [ ] 上記の変更を `system-development.astro` に反映した

---

### 2. `src/pages/services/web-development.astro`

| フィールド | 現在の値 | □ このままでOK / □ 変更する |
|-----------|---------|--------------------------|
| title | HP開発・運用 | [ ] OK / [ ] 変更 |
| subtitle | Web Development | [ ] OK / [ ] 変更 |
| leadText | コーポレートサイトからランディングページ、Webアプリまで。デザインから実装、運用まで一貫してサポートします。ビジネスの目的に合わせた最適なWebサイトを、スピード感を持ってお届けします。 | [ ] OK / [ ] 変更 |
| bodyText | SEO・パフォーマンス・アクセシビリティを標準として設計し、制作後の更新・保守まで安心してお任せいただける体制を整えています。CMSの導入でコンテンツ更新を内製化したいお客様にも対応しています。 | [ ] OK / [ ] 変更 |

**features（提供内容）— 現在の値**:

| # | 現在の値 | □ このままでOK / □ 変更する |
|---|---------|--------------------------|
| 1 | コーポレートサイト制作・リニューアル | [ ] OK / [ ] 変更: |
| 2 | ランディングページ（LP）制作 | [ ] OK / [ ] 変更: |
| 3 | CMS導入・カスタマイズ | [ ] OK / [ ] 変更: |
| 4 | レスポンシブデザイン対応 | [ ] OK / [ ] 変更: |
| 5 | SEO対策・パフォーマンス最適化 | [ ] OK / [ ] 変更: |

- [ ] 変更なし（そのまま公開）
- [ ] 上記の変更を `web-development.astro` に反映した

---

### 3. `src/pages/services/business-planning.astro`

| フィールド | 現在の値 | □ このままでOK / □ 変更する |
|-----------|---------|--------------------------|
| title | 経営企画 | [ ] OK / [ ] 変更 |
| subtitle | Business Planning | [ ] OK / [ ] 変更 |
| leadText | 事業計画の策定から新規事業の立ち上げ支援まで。データに基づく意思決定と戦略立案で、ビジネスの成長を加速します。 | [ ] OK / [ ] 変更 |
| bodyText | （現在 bodyText なし — 必要なら追加可） | [ ] 追加不要 / [ ] 追加する |

**features（提供内容）— 現在の値**:

| # | 現在の値 | □ このままでOK / □ 変更する |
|---|---------|--------------------------|
| 1 | 事業計画策定・収支シミュレーション | [ ] OK / [ ] 変更: |
| 2 | 新規事業立ち上げ支援 | [ ] OK / [ ] 変更: |
| 3 | 市場調査・競合分析 | [ ] OK / [ ] 変更: |
| 4 | KPI設計・モニタリング体制構築 | [ ] OK / [ ] 変更: |
| 5 | 経営会議資料作成支援 | [ ] OK / [ ] 変更: |

- [ ] 変更なし（そのまま公開）
- [ ] 上記の変更を `business-planning.astro` に反映した

---

### 4. `src/pages/services/video-editing.astro`

| フィールド | 現在の値 | □ このままでOK / □ 変更する |
|-----------|---------|--------------------------|
| title | 動画編集 | [ ] OK / [ ] 変更 |
| subtitle | Video Editing | [ ] OK / [ ] 変更 |
| leadText | YouTube動画からプロモーション映像まで。企画・撮影サポートから編集・納品まで、映像制作をトータルでサポートします。 | [ ] OK / [ ] 変更 |
| bodyText | （現在 bodyText なし — 必要なら追加可） | [ ] 追加不要 / [ ] 追加する |

**features（提供内容）— 現在の値**:

| # | 現在の値 | □ このままでOK / □ 変更する |
|---|---------|--------------------------|
| 1 | YouTube動画編集・サムネイル制作 | [ ] OK / [ ] 変更: |
| 2 | 企業プロモーション映像制作 | [ ] OK / [ ] 変更: |
| 3 | SNS向けショート動画制作 | [ ] OK / [ ] 変更: |
| 4 | モーショングラフィックス | [ ] OK / [ ] 変更: |
| 5 | 動画コンテンツ企画・構成 | [ ] OK / [ ] 変更: |

- [ ] 変更なし（そのまま公開）
- [ ] 上記の変更を `video-editing.astro` に反映した

---

## セクション 3: About（自己紹介）

**ファイル場所**: `src/components/home/AboutSection.astro`

### 基本情報

| フィールド | 現在の値 | 本番の値 |
|-----------|---------|---------|
| 表示名（英語ハンドル） | take77 | |
| 本名 | 武田政和 | |
| 肩書き | フリーランスエンジニア、とかとか | |

### 自己紹介文

**現在の値**:
> フリーランスとして企業のシステム開発からHP制作、経営企画等のサポートまで幅広く手がけています。スタートアップへの参画や学生起業の経験を活かし、ビジネス視点でのプロダクト開発が強みです。

**本番の値**:
> （ここに書き換える）

- [ ] 自己紹介文を更新した

### 強み 3 点

| # | 現在のタイトル | 現在の説明文 | 本番の値 |
|---|-------------|-----------|---------|
| 1 | フリーランスの機動力 | 開発観点にとどまらず、皆様にとって最適な解決策を提案します。 | |
| 2 | フルスタック対応 | システム開発だけでなく、HP制作や経営企画まで幅広く手がけます。 | |
| 3 | 経営視点の開発 | 必要なものを必要なだけ。あなたに最適な提案を。 | |

- [ ] 強み3点を更新した（タイトル + 説明文）

### SNS リンク

| SNS | 現在のURL | 本番のURL |
|-----|---------|---------|
| GitHub | https://github.com/take77 | |
| Zenn | https://zenn.dev/take77 | |
| Note | https://note.com/take77_note | |
| Twitter / X | https://twitter.com/take77_main | |

- [ ] SNSリンクを確認・更新した

### アバター画像

| 項目 | 現在の値 | 本番の値 |
|-----|---------|---------|
| ファイル名 | `avatar.jpg`（プロジェクトルート直下） | |
| 推奨仕様 | 正方形・200×200px 以上・JPEG 推奨 | |

- [ ] アバター画像を差し替えた（`avatar.jpg` を上書き保存）

---

## セクション 4: ヒーローセクション

**ファイル場所**: `src/components/HeroSection.astro`

| フィールド | 現在の値 | □ 変更不要 / 本番の値 |
|-----------|---------|---------------------|
| メインキャッチコピー（h1） | Technology meets Creativity | [ ] 変更不要 / 変更: |
| サブタイトル（p.hero-sub） | システム開発・HP制作・経営企画・動画編集まで 幅広く手がけるフリーランスエンジニア | [ ] 変更不要 / 変更: |
| プロフィールカード 氏名 | take77 / 武田政和 | [ ] 変更不要 / 変更: |
| プロフィールカード 肩書き | フリーランスエンジニア、とかとか | [ ] 変更不要 / 変更: |

**強み（プロフィールカード内）— 現在の値**:

| # | タイトル | 説明文 | □ このままでOK |
|---|---------|--------|--------------|
| 1 | フリーランスの機動力 | 開発観点にとどまらず、皆様にとって最適な解決策を提案します。 | [ ] |
| 2 | フルスタック対応 | システム開発だけでなく、HP制作や経営企画まで幅広く手がけます。 | [ ] |
| 3 | 経営視点の開発 | 必要なものを必要なだけ。あなたに最適な提案を。 | [ ] |

> ヒーローセクションの強みは AboutSection と同じ内容です。両方を同時に更新してください。

- [ ] キャッチコピーを確認・更新した
- [ ] プロフィールカードを確認・更新した

---

## セクション 5: その他

### サイトタイトル

**確認場所**: `src/layouts/BaseLayout.astro` & `src/pages/index.astro`

| 項目 | 現在の値 | □ このままでOK / 本番の値 |
|-----|---------|--------------------------|
| デフォルトタイトル | take77 \| フリーランスエンジニア | [ ] OK / 変更: |
| デフォルト description | システム開発・HP制作・経営企画・動画編集まで幅広く手がけるフリーランスエンジニア take77 のポートフォリオサイトです。 | [ ] OK / 変更: |

- [ ] サイトタイトル・descriptionを確認した

### フッター コピーライト表記

**確認場所**: `src/components/layout/Footer.astro`

| 項目 | 現在の値 | □ このままでOK / 本番の値 |
|-----|---------|--------------------------|
| コピーライト | © {currentYear} take77. All rights reserved. | [ ] OK / 変更: |

> `{currentYear}` は自動的に現在の西暦年に更新されます。`take77` の部分を変更したい場合のみ編集してください。

- [ ] コピーライトを確認した

### プライバシーポリシー

**確認場所**: `src/pages/privacy.astro`

| 項目 | 現在の値 | □ このままでOK / 本番の値 |
|-----|---------|--------------------------|
| 最終更新日 | 2026年3月3日 | [ ] OK / 変更: |
| 運営者名 | take77（個人名は記載なし） | [ ] OK / 変更: |
| お問い合わせフォームサービス | Web3Forms + Cloudflare Turnstile | [ ] OK（変更不要） |
| GA4利用有無 | 有（記載済み） | [ ] OK / [ ] GA4を使わない場合は削除 |

- [ ] プライバシーポリシーの内容を確認した

### OGP 画像

**確認場所**: `public/og-image.jpg`

| 項目 | 現在の値 | □ このままでOK / 本番の値 |
|-----|---------|--------------------------|
| OGP画像ファイル | `public/og-image.jpg` | [ ] 差し替える / [ ] 後回し |
| 推奨サイズ | 1200×630px（SNSカード標準） | |
| フォーマット | JPEG 推奨 | |

> OGP画像はSNSシェア時に表示される画像です。後からでも差し替え可能です。

- [ ] OGP画像を確認・差し替えた（または後回しにした）

---

## 完了チェック

- [ ] セクション 1: 実績（Works）— 全件差し替え完了
- [ ] セクション 2: サービス説明（4ページ）— 確認・更新完了
- [ ] セクション 3: About（自己紹介）— 更新完了
- [ ] セクション 4: ヒーローセクション — 確認・更新完了
- [ ] セクション 5: その他（サイトタイトル・フッター・プライバシーポリシー・OGP）— 確認完了
- [ ] `npm run build` でビルドが通ることを確認した
- [ ] ローカルで `npm run dev` を起動してページを目視確認した
