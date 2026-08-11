---
title: "calsail — レシート撮影で完結するAI経費処理アプリ"
description: "個人事業主向けのAI-OCR経費処理アプリ。企画・料金設計からFlutterアプリ・Webダッシュボード・バックエンドの実装、両ストアへの申請までを一人で担当し、着手から約半年でiOS / Android / Web の3面をリリース"
date: 2026-08-12
serviceCategory:
  - "system-development"
  - "web-development"
technologies: ["Flutter", "Next.js", "TypeScript", "Supabase", "Google Gemini API", "Cloudflare Workers"]
thumbnail: ./thumbnail.jpg
url: "https://calsail.com"
featured: true
draft: false
order: 0
---

## プロジェクト概要

個人事業主・フリーランス・副業層に向けた経費処理アプリ『calsail』。レシートをカメラで撮影するとAIが日付・店名・金額・品目を読み取り、勘定科目まで自動で振り分ける。集計した経費はfreee・マネーフォワード・弥生の各形式のCSVとして書き出せるため、いま使っている会計ソフトを変えずに併用できる。

企画・設計・実装・リリース・運用のすべてを一人で担当した個人開発プロダクト。2026年2月の着手から約半年で、iOSアプリ・Androidアプリ・Webの3面をほぼ同時期に公開し、現在も継続して開発・運用している。

## 課題

- 確定申告前にレシートが溜まる原因は、一件ずつ手入力するコストの高さにあると考えた。摩擦が大きいために記帳が習慣にならず、その結果としてレシートの処理が先送りになる。
- そもそも、個人事業主や副業層には、取引入力にかける時間で業務をこなしたほうが実入りが大きくなることも、処理を先延ばしにしてしまう背景がある。
- 会計ソフト側のレシート撮影機能は事業所・法人向けの作り込みが中心で、個人が自分のレシートを処理する体験は手薄だった。
- 乗り換えを前提とした設計にすると、すでに会計ソフトを使っているユーザーにとって導入コストが高すぎる。

## アプローチ

「撮るだけで、経費処理がおわる。」というコピーのとおり、撮影から勘定科目の振り分けまでを最短手数で終わらせることに機能を集中させた。経費の可視化・分析といった機能は家計簿アプリや会計ソフトの領域と重なるため、意図的に持たせていない。calsailは会計ソフトの代替ではなく経費処理の担当と位置づけ、出力をCSVに寄せることで既存の会計フローへそのまま接続できるようにしている。

料金は無料プラン（月15枚）と月額300円・500円の2段階。想定ユーザーの月間レシート枚数を公開データから見積もったうえで、無料でも実用に足りる水準に上限を置いている。

## 技術構成

- **モバイル**: Flutter（iOS / Android 共通コード、Riverpod + go_router）
- **Web**: Next.js 16（App Router）+ TypeScript + Tailwind CSS v4。OpenNextでビルドしCloudflare Workers上で稼働
- **バックエンド**: Supabase（Auth / Database / Storage / Edge Functions）
- **AI-OCR**: Google Gemini APIをEdge Function経由で呼び出し
- **課金**: Web版はStripe、アプリ内課金はRevenueCat

OCRはアプリから直接AIのAPIを呼ばず、Supabase Edge Functionに集約している。APIキーを端末に置かずに済むうえ、ユーザー単位のレート制限をサーバー側で強制でき、AI利用料が想定を超えて膨らむのを防げるため。認証はSupabase Authに加えてSign in with Apple・Googleサインインに対応し、Webフォームの不正送信はCloudflare Turnstileで抑止している。

技術選定の基準は「一人で作り切り、一人で運用し続けられること」に置いた。Flutterで2ストア分のコードを一本化し、バックエンドはSupabaseのマネージドサービスに寄せ、Webはサーバー運用の要らないCloudflare Workers上に載せている。

## 担当領域

基本的に、企画から開発までをすべて個人で実施している。

- プロダクト企画・料金設計・ブランドコピーの策定
- Flutterアプリの設計・実装（カメラ撮影・OCR結果の編集・CSV出力）
- Next.jsによるLP・WebダッシュボードのフルスクラッチとCloudflare Workersへのデプロイ
- Supabaseのスキーマ設計・Edge Functions実装・サブスクリプション基盤の構築
- App Store / Google Play への申請・審査対応と、リリース後の継続的な改善

## 現在地

- 2026年7月にiOS・Android・Webの3面をほぼ同時期に公開し、以降も継続して開発・運用している
- 公開から日が浅く、ダウンロード数や継続率は評価に足る母数が集まっていない。プロダクトとしての検証はこれからの運用で行う
