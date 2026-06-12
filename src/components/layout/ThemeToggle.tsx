import { Sun, Moon } from 'lucide-react';

// theme-color メタはモード解決後の値で上書きする（BaseLayout の FOUC 防止スクリプトと対）
const THEME_COLORS = { light: '#fbfbfd', dark: '#181b28' } as const;

function applyThemeColorMeta(dark: boolean) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', dark ? THEME_COLORS.dark : THEME_COLORS.light);
  });
}

export default function ThemeToggle() {
  const handleToggle = () => {
    const root = document.documentElement;
    const dark = !root.classList.contains('dark');
    root.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      // localStorage が使えない環境（プライベートモード等）でも切替自体は機能させる
    }
    applyThemeColorMeta(dark);
  };

  // SSG 時点ではモードが未確定のため両アイコンを描画し、html.dark で CSS 表示切替する
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="ライト/ダークモードを切り替える"
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-(--text-nav) transition-colors duration-200 hover:text-(--text-heading)"
    >
      <Sun size={18} strokeWidth={1.75} className="hidden dark:block" aria-hidden="true" />
      <Moon size={18} strokeWidth={1.75} className="dark:hidden" aria-hidden="true" />
    </button>
  );
}
