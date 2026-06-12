/**
 * generate-brand-images.mjs — ブランド画像ジェネレータ
 *
 * 新パレット（ライト=A2 ネイビー×ピュアホワイト / ダーク=B1 ネイビー×セージ、
 * spec.md §5.1 / docs/color-redesign-instructions.md 参照）に基づき以下を生成する:
 *
 *   1. public/og-image.jpg          — OGP画像 1200×630（ライト版1枚で統一、指示書 §3.4）
 *   2. public/apple-touch-icon.png  — 180×180（favicon と同デザイン、iOSマスク前提で角丸なし）
 *   3. content/works/<slug>/thumbnail.jpg — 「画面が存在しない」案件の生成グラフィックカード
 *      （経営企画・コンサル系、非公開クライアントの動画案件、未公開サイト）
 *
 * 公開URLを持つ案件（fujimik / plaru-hp / plaru-app / fukugyo-sensei-product / suzuki-zei）の
 * サムネイルは実サイトのスクリーンショット（手動キャプチャ）であり、本スクリプトの対象外。
 *
 * 実行: node scripts/generate-brand-images.mjs
 * 生成物はリポジトリにコミットする（ビルド時生成にはしない — SSGの依存とビルド時間を増やさないため）
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* --- パレット（B1 ダーク / A2 ライト） --- */
const dark = {
  bgGrad: ['#2a2e42', '#181b28', '#20242f'],
  sage: '#a3b18a',
  beige: '#c9bfa9',
  navyBlue: '#4a5170',
  grid: 'rgba(255,255,255,0.05)',
  sub: 'rgba(255,255,255,0.45)',
};
const light = {
  bgGrad: ['#fbfbfd', '#f3f5f8', '#edf0f4'],
  heading: '#1c2138',
  accent: '#353a5c',
  sage: '#8c9679',
  beige: '#c9bfa9',
  grid: 'rgba(48,52,77,0.06)',
  sub: 'rgba(43,47,69,0.55)',
};

const FONT_EN = "Futura, 'Jost', 'Helvetica Neue', Arial, sans-serif";
const FONT_JA = "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif";

/* --- カテゴリ別モチーフ（site の lucide アイコンと同系のストロークパス、viewBox 0 0 24 24） --- */
const MOTIFS = {
  'system-development': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  'web-development':
    '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  'business-planning':
    '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  'video-editing':
    '<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>',
};
const CATEGORY_LABELS = {
  'system-development': 'System Development',
  'web-development': 'Web Development',
  'business-planning': 'Business Planning',
  'video-editing': 'Video Editing',
};

/* --- 生成カード対象（画面が存在しない/非公開の案件のみ） --- */
const CARD_WORKS = [
  { slug: 'plaru-biz', category: 'business-planning' },
  { slug: 'fukugyo-sensei-biz', category: 'business-planning' },
  { slug: 'business-consulting', category: 'business-planning' },
  { slug: 'agost-youtube', category: 'video-editing' },
  { slug: 'reco-style', category: 'web-development' },
];

const gridDefs = (id, color, size) => `
  <pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
    <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="1"/>
  </pattern>`;

const blob = (cx, cy, r, color, opacity) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}" filter="url(#blur)"/>`;

/* --- 実績カード SVG（1200×675、ライトA2基調）
   実スクリーンショット（明るいサイト画面）と明度を揃える（2026-06 ユーザー調整でダーク基調から変更）。
   ライトモードでは明るいまま馴染み、ダークモードではデュオトーン処理（brightness 0.6）で減光される。 --- */
function workCardSvg({ category }) {
  const W = 1200, H = 675;
  const label = CATEGORY_LABELS[category];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${light.bgGrad[0]}"/>
      <stop offset="0.55" stop-color="${light.bgGrad[1]}"/>
      <stop offset="1" stop-color="${light.bgGrad[2]}"/>
    </linearGradient>
    ${gridDefs('grid', 'rgba(48,52,77,0.08)', 80)}
    <filter id="blur" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="70"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${blob(180, 140, 220, light.sage, 0.28)}
  ${blob(1040, 540, 240, '#4a5170', 0.2)}
  ${blob(980, 110, 160, light.beige, 0.32)}
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <g transform="translate(${W / 2 - 44}, 210) scale(${88 / 24})" fill="none"
     stroke="${light.sage}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    ${MOTIFS[category]}
  </g>
  <text x="${W / 2}" y="400" text-anchor="middle" font-family="${FONT_EN}" font-size="44"
        letter-spacing="6" fill="${light.heading}" font-weight="500">${label}</text>
  <text x="${W / 2}" y="452" text-anchor="middle" font-family="${FONT_EN}" font-size="19"
        letter-spacing="4" fill="${light.sub}">take77 Portfolio</text>
  <rect x="${W / 2 - 28}" y="490" width="56" height="3" rx="1.5" fill="${light.sage}"/>
</svg>`;
}

/* --- OGP SVG（1200×630、ライトA2・テキストブランド型） --- */
function ogSvg() {
  const W = 1200, H = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${light.bgGrad[0]}"/>
      <stop offset="0.55" stop-color="${light.bgGrad[1]}"/>
      <stop offset="1" stop-color="${light.bgGrad[2]}"/>
    </linearGradient>
    ${gridDefs('grid', light.grid, 80)}
    <filter id="blur" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="80"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${blob(1010, 130, 240, light.sage, 0.18)}
  ${blob(160, 540, 220, '#4a5170', 0.14)}
  ${blob(1080, 560, 170, light.beige, 0.24)}
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <text x="96" y="252" font-family="${FONT_EN}" font-size="76" font-weight="600"
        letter-spacing="1" fill="${light.heading}">take77-port</text>
  <rect x="100" y="290" width="120" height="5" rx="2.5" fill="${light.sage}"/>
  <text x="98" y="384" font-family="${FONT_EN}" font-size="46" font-weight="400"
        letter-spacing="1.5" fill="${light.accent}">Grow Business, Beyond Code</text>
  <text x="100" y="452" font-family="${FONT_JA}" font-size="26" letter-spacing="2"
        fill="${light.sub}">システム開発・HP制作・経営企画・動画編集</text>
  <text x="100" y="556" font-family="${FONT_EN}" font-size="20" letter-spacing="3"
        fill="${light.sub}">FREELANCE ENGINEER — take77</text>
</svg>`;
}

/* --- apple-touch-icon SVG（180×180、favicon と同デザイン・全面塗り） --- */
function touchIconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#1f2335"/>
  <rect x="6" y="8" width="20" height="3" rx="1.5" fill="#a3b18a"/>
  <rect x="14.5" y="8" width="3" height="17" rx="1.5" fill="#a3b18a"/>
</svg>`;
}

const svgToFile = (svg, file, format = 'jpeg') => {
  const pipe = sharp(Buffer.from(svg), { density: 96 });
  return (format === 'jpeg' ? pipe.jpeg({ quality: 85, mozjpeg: true }) : pipe.png())
    .toFile(join(root, file))
    .then(() => console.log('generated:', file));
};

await mkdir(join(root, 'public'), { recursive: true });
await svgToFile(ogSvg(), 'public/og-image.jpg');
await svgToFile(touchIconSvg(), 'public/apple-touch-icon.png', 'png');
for (const work of CARD_WORKS) {
  await svgToFile(workCardSvg(work), `content/works/${work.slug}/thumbnail.jpg`);
}
console.log('done');
