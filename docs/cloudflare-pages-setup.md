# Cloudflare Pages セットアップガイド

take77_port_v2（Astro製ポートフォリオサイト）を Netlify から Cloudflare Pages に移行するための手順書。

> **推定総所要時間**: 30〜60分

---

## 前提条件

| 項目 | 状態 |
|------|------|
| Cloudflare アカウント | 作成済みであること |
| GitHub リポジトリ | `take77/take77_port_v2`（public） |
| ドメイン | `take77-port.com`（現在 Netlify で運用中） |
| .env の内容 | 環境変数名と実際の値を手元に用意しておくこと |

---

## 1. Cloudflare Pages プロジェクト作成

> **推定所要時間**: 10分

> ⚠️ **重要**: Cloudflare には「Workers」と「Pages」の2つのサービスがある。
> Workers は **サーバーレス関数** 用。静的サイトホスティングは必ず **Pages** を使うこと。
> 前回 Workers ページに誤って進んでしまった経緯があるため、以下の手順を正確に実施すること。

### 手順

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. 左サイドバーの **「Workers & Pages」** をクリック
3. 画面上部のタブで **「Pages」** をクリック（← ここが重要、「Workers」タブではない）
4. **「Connect to Git」** ボタンをクリック
5. **「GitHub」** を選択し、GitHub 認証を完了
6. リポジトリ一覧から **`take77/take77_port_v2`** を選択し、**「Begin setup」** をクリック

### ビルド設定

以下の通り入力する：

| 設定項目 | 値 |
|----------|-----|
| Project name | `take77-port`（任意。後で変更可） |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |

### 環境変数（ビルド時）

**「Environment variables (advanced)」** を展開し、以下を追加：

| 変数名 | 値 |
|--------|----|
| `NODE_VERSION` | `20` |

> Node.js バージョンを明示しないとビルドに失敗することがある。

7. **「Save and Deploy」** ボタンをクリック
8. 初回デプロイが完了するまで待機（2〜5分）

デプロイ成功後、`{project-name}.pages.dev` で仮アクセス確認できる。

---

## 2. 環境変数の設定

> **推定所要時間**: 5分

Turnstile・Web3Forms・GA4 が正常動作するには、本番用の環境変数を設定する必要がある。

### 手順

1. Cloudflare Dashboard → 作成した Pages プロジェクトを選択
2. 上部タブの **「Settings」** をクリック
3. 左メニューの **「Environment variables」** をクリック
4. **「Production」** セクションで **「Add variable」** をクリック

### 設定する環境変数

以下の4変数を設定する（値は `.env` ファイルから確認して入力）：

| 変数名 | 用途 |
|--------|----|
| `PUBLIC_GA4_MEASUREMENT_ID` | Google Analytics 4 トラッキングID |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Web3Forms アクセスキー（お問い合わせフォーム） |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile サイトキー（スパム対策） |
| `TURNSTILE_SECRET_KEY` | Turnstile シークレットキー（サーバーサイド検証） |

> ⚠️ **セキュリティ**: 上記の「値」はこのドキュメントには記載していない。
> `.env` ファイルを参照して実際の値を入力すること。
> シークレットキーの実値をドキュメント・Git履歴に残してはならない。

5. **「Preview」** セクションでも同じ変数・値を設定する
   （プレビューデプロイでもフォームやアナリティクスを動かすため）
6. **「Save」** をクリック
7. 設定後、**「Deployments」** タブから最新デプロイの **「Retry deployment」** を実行
   （環境変数はリデプロイしないと反映されない）

---

## 3. カスタムドメインの設定

> **推定所要時間**: 5〜10分

1. Pages プロジェクト → 上部タブの **「Custom domains」** をクリック
2. **「Set up a custom domain」** ボタンをクリック
3. **`take77-port.com`** を入力し **「Continue」** をクリック

### DNS が Cloudflare 管理の場合

Cloudflare が自動で CNAME レコードを追加する。**「Activate domain」** をクリックすれば完了。

### DNS が他社（Netlify DNS 等）で管理の場合

手動で以下の CNAME レコードを追加する：

| Type | Name | Target |
|------|------|--------|
| CNAME | `take77-port.com` | `{project-name}.pages.dev` |

設定後、DNS 伝播に最大 48 時間かかる場合がある。

---

## 4. DNS 切り替え（Netlify → Cloudflare）

> **推定所要時間**: 10〜30分（DNS伝播時間を除く）

> **ダウンタイム最小化のポイント**:
> DNS を切り替える前に、先に `{project-name}.pages.dev` でサイトが正常動作することを確認する。
> 確認が取れてから DNS を切り替えることで、切り替え後の問題リスクを大幅に減らせる。

### 手順

1. **事前確認**: `https://{project-name}.pages.dev` にアクセスし、サイト・フォーム・アニメーションが正常動作することを確認
2. **現在の DNS 設定を記録**: Netlify ダッシュボード → Domain management → DNS の設定を手元にメモしておく（ロールバック用）
3. **Cloudflare での DNS 設定**（Cloudflare を DNS プロバイダーとして使う場合）:
   - Cloudflare Dashboard → 左サイドバー **「Websites」** → 対象ドメインを選択
   - **「DNS」** → **「Records」** で、Netlify 向きの A レコードや CNAME を削除
   - Cloudflare Pages が自動追加した CNAME レコードが存在することを確認
4. **SSL/TLS 設定確認**: Cloudflare Dashboard → 対象ドメイン → **「SSL/TLS」** → **「Full (strict)」** に設定

---

## 5. デプロイ確認チェックリスト

> **推定所要時間**: 10分

DNS 切り替え後、以下を順番に確認する：

- [ ] `https://take77-port.com` でサイトが表示される
- [ ] `https://take77-port.com` で HTTPS 接続（鍵マーク）が表示される
- [ ] お問い合わせフォームからテスト送信ができる（Web3Forms でメール受信を確認）
- [ ] Turnstile のチェックボックスが表示・動作する
- [ ] Google Analytics でリアルタイムデータを受信している（GA4 ダッシュボードで確認）
- [ ] ページ遷移・アニメーションが正常動作する
- [ ] 実績一覧ページ（`/works`）のフィルター機能が動作する

---

## 6. Netlify の旧サイト停止

> **推定所要時間**: 5分

上記の確認が全て完了してから実施すること。

1. Netlify Dashboard にログイン
2. 対象サイトを選択
3. **「Site settings」** → **「General」** → **「Danger zone」** → **「Delete site」** をクリック
   （または **「Build settings」** をオフにするだけでも可）
4. Netlify で管理していた DNS レコードが残っている場合は削除する

---

## トラブルシューティング

### ビルドが失敗する

- `NODE_VERSION` 環境変数が設定されているか確認（Section 1 参照）
- Cloudflare Dashboard → Pages プロジェクト → **「Deployments」** → 失敗したデプロイの **「View logs」** でエラー内容を確認

### フォームが送信できない / Turnstile が表示されない

- Section 2 の環境変数が正しく設定されているか確認
- 変数名が `.env` の名前と完全一致しているか確認（特に `PUBLIC_WEB3FORMS_ACCESS_KEY`、`PUBLIC_GA4_MEASUREMENT_ID` はスペルに注意）
- リデプロイが実行されているか確認

### カスタムドメインで表示されない

- DNS 伝播に時間がかかっている可能性がある（最大 48 時間待機）
- `dig take77-port.com` でレコードを確認する

---

*作成日: 2026-03-04*
