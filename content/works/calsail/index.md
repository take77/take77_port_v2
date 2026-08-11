---
title: "calsail — レシート撮影で完結するAI経費処理アプリ（個人開発）"
description: "個人事業主・フリーランス向けのAI-OCR経費処理アプリを個人開発。レシート撮影から勘定科目の自動振り分け、会計ソフト向けCSV出力までを一人で企画・実装し、iOS・Android両ストアへリリース"
date: 2026-02-01
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

個人事業主・フリーランス・副業層に向けた経費処理アプリ『calsail』を、企画・設計・実装・リリース・運用まで一人で手がけている個人開発プロダクト。レシートをカメラで撮影するとAIが日付・店名・金額・品目を読み取り、勘定科目まで自動で振り分ける。集計した経費はfreee・マネーフォワード・弥生の各形式のCSVとして書き出せるため、いま使っている会計ソフトを変えずに併用できる。2026年2月に開発を開始し、同年7月にiOS版をApp Store、Android版をGoogle Playへ公開した。

## 課題

- 確定申告前にレシートが溜まる原因は「山になったこと」ではなく、一件ずつ手入力するコストの高さにある。摩擦が大きいために記帳が習慣にならず、その結果として山が積み上がる
- 会計ソフト側のレシート撮影機能は事業所・法人向けの作り込みが中心で、個人が自分のレシートを処理する体験は手薄だった
- 乗り換えを前提とした設計にすると、すでに会計ソフトを使っているユーザーにとって導入コストが高すぎる

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

## 担当領域

- プロダクト企画・料金設計・ブランドコピーの策定
- Flutterアプリの設計・実装（カメラ撮影・OCR結果の編集・CSV出力）
- Next.jsによるLP・WebダッシュボードのフルスクラッチとCloudflare Workersへのデプロイ
- Supabaseのスキーマ設計・Edge Functions実装・サブスクリプション基盤の構築
- App Store / Google Play への申請・審査対応と、リリース後の継続的な改善
