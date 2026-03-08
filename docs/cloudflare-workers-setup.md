# Cloudflare Workers セットアップガイド

take77_port_v2（Astro製ポートフォリオサイト）を Cloudflare Workers（Static Assets）にデプロイするための手順書。

> **推定総所要時間**: 30〜60分

> **背景**: 2025年以降、Cloudflare は新規プロジェクトに対して Pages ではなく Workers を推奨している。
> Workers に Static Assets 機能が追加され、静的サイトもWorkersで配信可能になった。
> 静的アセットへのリクエストは無料（Pages と同じ料金体系）。

---

## 前提条件

| 項目 | 状態 |
|------|------|
| Cloudflare アカウント | 作成済みであること |
| GitHub リポジトリ | `take77/take77_port_v2`（public） |
| ドメイン | `take77-port.com` |
| .env の内容 | 環境変数名と実際の値を手元に用意しておくこと |
| wrangler CLI | `npm install` で導入済み（devDependencies） |

---

## 1. Wrangler の認証

> **推定所要時間**: 5分

### 手順

1. ターミナルで以下を実行:
   ```bash
   npx wrangler login
   ```
2. ブラウザが開くので、Cloudflare アカウントで認証を完了する
3. 認証成功を確認:
   ```bash
   npx wrangler whoami
   ```

---

## 2. プロジェクト構成の確認

> **推定所要時間**: 5分

以下のファイルがリポジトリに含まれていることを確認する：

### `wrangler.jsonc`（プロジェクトルート）

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "take77-port",
  "compatibility_date": "2026-03-01",
  "assets": {
    "directory": "./dist",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

| 設定項目 | 説明 |
|---------|------|
| `name` | Workerの名前（Cloudflare Dashboard上の表示名） |
| `compatibility_date` | Workers ランタイムの互換性日付 |
| `assets.directory` | Astro のビルド出力先 |
| `assets.html_handling` | URLの末尾スラッシュ処理（自動） |
| `assets.not_found_handling` | 404時に `404.html` を返す |

### `public/.assetsignore`

`dist/` にコピーされる除外ファイル設定。`.gitignore` と同じ書式。

---

## 3. ローカルでの動作確認

> **推定所要時間**: 5分

本番デプロイ前にローカルで Workers 環境をテストする：

```bash
npm run build
npx wrangler dev
```

`http://localhost:8787` でサイトが正常に表示されることを確認する。

確認項目:
- [ ] トップページが表示される
- [ ] ページ遷移が動作する
- [ ] 実績一覧のフィルターが動作する
- [ ] 404ページが表示される（存在しないURLにアクセス）

---

## 4. 初回デプロイ

> **推定所要時間**: 5分

```bash
npm run deploy
```

これは内部的に `npm run build && wrangler deploy` を実行する。

デプロイ成功後、ターミナルに表示される URL（`https://take77-port.<account>.workers.dev`）でアクセス確認できる。

---

## 5. GitHub Actions 自動デプロイの設定

> **推定所要時間**: 10分

`main` ブランチに push すると自動でビルド＆デプロイが実行される。
ワークフローは `.github/workflows/deploy.yml` に定義済み。

### 6-1. Cloudflare API トークンの作成

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → 右上のアイコン → **「My Profile」**
2. 左メニュー **「API Tokens」** → **「Create Token」**
3. **「Edit Cloudflare Workers」** テンプレートを選択
4. Account Resources: 自分のアカウントを選択
5. Zone Resources: `All zones` または対象ドメインを選択
6. **「Continue to summary」** → **「Create Token」**
7. 表示されたトークンをコピー（この画面を閉じると二度と表示されない）

### 6-2. Cloudflare Account ID の確認

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → 任意のドメインを選択
2. 右サイドバーの **「Account ID」** をコピー

### 6-3. GitHub Secrets の設定

1. GitHub リポジトリ → **「Settings」** → **「Secrets and variables」** → **「Actions」**
2. **「New repository secret」** で以下4つを追加：

| Secret 名 | 値 |
|-----------|-----|
| `CLOUDFLARE_API_TOKEN` | 6-1 で作成したトークン |
| `CLOUDFLARE_ACCOUNT_ID` | 6-2 で確認したAccount ID |
| `PUBLIC_GA4_MEASUREMENT_ID` | GA4 測定ID |
| `PUBLIC_WEB3FORMS_ACCESS_KEY` | Web3Forms アクセスキー |

設定後、`main` に push すれば自動デプロイが実行される。
進捗は GitHub リポジトリの **「Actions」** タブで確認可能。

---

## 6. カスタムドメインの設定

> **推定所要時間**: 5〜10分

### 手順

1. Cloudflare Dashboard → **「Workers & Pages」** → `take77-port` を選択
2. **「Settings」** タブ → **「Domains & Routes」**
3. **「Add」** → **「Custom Domain」** を選択
4. **`take77-port.com`** を入力し追加

### DNS が Cloudflare 管理の場合

Cloudflare が自動で必要な DNS レコードを設定する。

### DNS が他社で管理の場合

手動で以下の CNAME レコードを追加する：

| Type | Name | Target |
|------|------|--------|
| CNAME | `take77-port.com` | `take77-port.<account>.workers.dev` |

設定後、DNS 伝播に最大 48 時間かかる場合がある。

---

## 7. DNS 切り替え（Netlify → Cloudflare）

> **推定所要時間**: 10〜30分（DNS伝播時間を除く）

> **ダウンタイム最小化のポイント**:
> DNS を切り替える前に、先に `workers.dev` ドメインでサイトが正常動作することを確認する。

### 手順

1. **事前確認**: `https://take77-port.<account>.workers.dev` でサイトが正常動作することを確認
2. **現在の DNS 設定を記録**: 現行のDNS設定を手元にメモ（ロールバック用）
3. **Cloudflare での DNS 設定**:
   - Cloudflare Dashboard → 左サイドバー **「Websites」** → 対象ドメインを選択
   - **「DNS」** → **「Records」** で、旧サービス向きのレコードを削除
   - Workers 用のレコードが存在することを確認
4. **SSL/TLS 設定確認**: Cloudflare Dashboard → 対象ドメイン → **「SSL/TLS」** → **「Full (strict)」** に設定

---

## 8. デプロイ確認チェックリスト

> **推定所要時間**: 10分

DNS 切り替え後、以下を順番に確認する：

- [ ] `https://take77-port.com` でサイトが表示される
- [ ] `https://take77-port.com` で HTTPS 接続（鍵マーク）が表示される
- [ ] お問い合わせフォームからテスト送信ができる（Web3Forms でメール受信を確認）
- [ ] Google Analytics でリアルタイムデータを受信している（GA4 ダッシュボードで確認）
- [ ] ページ遷移・アニメーションが正常動作する
- [ ] 実績一覧ページ（`/works`）のフィルター機能が動作する
- [ ] 404ページが正しく表示される

---

## 9. Netlify の旧サイト停止

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

- Node.js バージョンが22以上であることを確認: `node -v`
- ビルドログを確認: `npm run build`

### `wrangler deploy` が失敗する

- 認証状態を確認: `npx wrangler whoami`
- `wrangler.jsonc` の `assets.directory` が `./dist` になっているか確認
- `dist/` フォルダが存在するか確認（`npm run build` を先に実行）

### フォームが送信できない

- 環境変数 `PUBLIC_WEB3FORMS_ACCESS_KEY` がビルド時に正しく設定されているか確認
- 変数名が `.env` の名前と完全一致しているか確認
- リデプロイが実行されているか確認

### カスタムドメインで表示されない

- DNS 伝播に時間がかかっている可能性がある（最大 48 時間待機）
- `dig take77-port.com` でレコードを確認する
- Workers のカスタムドメイン設定が完了しているか確認

---

*作成日: 2026-03-08（Cloudflare Pages → Workers 移行に伴い全面改訂）*
