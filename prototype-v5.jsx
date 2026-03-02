import { useState, useEffect, useRef } from "react";
import {
  Settings, Globe, BarChart3, Film,
  ExternalLink, Github, PenTool, BookOpen,
  ChevronRight, Send, CheckCircle2, User,
  ArrowRight, Menu, X, Code2, Briefcase
} from "lucide-react";

// ── Design Tokens ──
const tokens = {
  bg: {
    gradient: "linear-gradient(135deg, #362742 0%, #1a0f24 50%, #211829 100%)",
  },
  glass: {
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.1)",
    blur: "blur(16px) saturate(180%)",
    shadow: "0 8px 32px rgba(0,0,0,0.35)",
    innerGlow: "inset 0 1px 0 rgba(255,255,255,0.08)",
  },
  text: {
    primary: "#f0f0f5",
    heading: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    accent: "#a78bfa",
  },
  accent: "#8b5cf6",
  accentHover: "#7c3aed",
};

// ── Noise Texture (SVG feTurbulence, rendered once) ──
function NoiseOverlay() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
      opacity: 0.035, mixBlendMode: "overlay",
    }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
}

// ── Grid Pattern (Linear-style, hero area) ──
function GridPattern() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      opacity: 0.04,
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
      `,
      backgroundSize: "80px 80px",
      maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 70%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 0%, transparent 70%)",
    }} />
  );
}

// ── Blob Background (refined: richer easing, color transitions, varied timing) ──
function Blobs() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Primary purple blob - slow, large orbit */}
      <div className="blob blob-1" style={{
        position: "absolute", top: "-8%", left: "-5%", width: 550, height: 550,
        background: "radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(124,58,237,0.12) 40%, transparent 70%)",
        filter: "blur(80px)",
      }} />
      {/* Pink blob - medium speed, counter-orbit */}
      <div className="blob blob-2" style={{
        position: "absolute", top: "35%", right: "-8%", width: 480, height: 480,
        background: "radial-gradient(circle, rgba(236,72,153,0.18) 0%, rgba(219,39,119,0.08) 45%, transparent 70%)",
        filter: "blur(90px)",
      }} />
      {/* Blue blob - fastest, smallest orbit */}
      <div className="blob blob-3" style={{
        position: "absolute", bottom: "-3%", left: "25%", width: 420, height: 420,
        background: "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(99,102,241,0.06) 45%, transparent 70%)",
        filter: "blur(85px)",
      }} />
      {/* Secondary accent blob - very slow drift, adds depth */}
      <div className="blob blob-4" style={{
        position: "absolute", top: "15%", left: "40%", width: 350, height: 350,
        background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, rgba(139,92,246,0.04) 50%, transparent 70%)",
        filter: "blur(100px)",
      }} />
    </div>
  );
}

// ── Glass Card ──
function GlassCard({ children, style, hover = true, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.glass.bg,
        backdropFilter: tokens.glass.blur,
        WebkitBackdropFilter: tokens.glass.blur,
        borderRadius: 16,
        border: `1px solid ${hovered && hover ? "rgba(255,255,255,0.18)" : tokens.glass.border}`,
        boxShadow: `${tokens.glass.shadow}, ${tokens.glass.innerGlow}`,
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered && hover ? "translateY(-4px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Section Title ──
function SectionTitle({ label, title }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{
        fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase",
        color: tokens.accent, marginBottom: 8, fontFamily: "'Jost', sans-serif",
      }}>
        {label}
      </div>
      <h2 style={{
        fontSize: "clamp(1.5rem, 4vw, 2.2rem)", fontWeight: 300, color: tokens.text.heading,
        margin: 0, letterSpacing: "0.08em", lineHeight: 1.3, fontFamily: "'Jost', sans-serif",
      }}>
        {title}
      </h2>
    </div>
  );
}

// ── Icon wrapper ──
function ServiceIcon({ icon: Icon, size = 24 }) {
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 12,
      background: "rgba(139,92,246,0.1)",
      border: "1px solid rgba(139,92,246,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      marginBottom: 16, flexShrink: 0,
    }}>
      <Icon size={size} strokeWidth={1.5} color={tokens.text.accent} />
    </div>
  );
}

// ── Service data ──
const services = [
  {
    id: "system-development", icon: Settings,
    title: "システム開発", titleEn: "System Development",
    desc: "業務システムやWebアプリケーションの設計・開発。要件定義からリリース後の運用保守まで一貫して対応します。",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    id: "web-development", icon: Globe,
    title: "HP開発・運用", titleEn: "Web Development",
    desc: "コーポレートサイト、LP、ECサイトの企画・制作・運用。高速表示とSEOを重視した、成果につながるサイトを構築します。",
    tech: ["Next.js", "Astro", "Tailwind CSS", "microCMS", "Vercel"],
  },
  {
    id: "business-planning", icon: BarChart3,
    title: "経営企画", titleEn: "Business Planning",
    desc: "事業計画策定、KPI設計、データ分析に基づく経営判断支援。テクノロジーとビジネスの架け橋になります。",
    tech: ["事業計画", "KPI設計", "データ分析", "資料作成"],
  },
  {
    id: "video-editing", icon: Film,
    title: "動画編集", titleEn: "Video Editing",
    desc: "プロモーション動画、採用動画、SNS向けショート動画の企画・撮影・編集。ブランドの世界観を映像で表現します。",
    tech: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
  },
];

// ── Works data ──
const works = [
  {
    slug: "corporate-site-redesign",
    title: "〇〇株式会社 サイトリニューアル",
    description: "老朽化した企業サイトをNext.js + microCMSで再構築",
    serviceCategory: ["web-development"],
    technologies: ["Next.js", "Tailwind CSS", "microCMS"],
    featured: true, color: "#6366f1",
  },
  {
    slug: "inventory-system",
    title: "在庫管理システム開発",
    description: "リアルタイム在庫管理とレポート機能を持つ業務システム",
    serviceCategory: ["system-development"],
    technologies: ["React", "Node.js", "PostgreSQL"],
    featured: true, color: "#8b5cf6",
  },
  {
    slug: "brand-renewal",
    title: "△△株式会社 ブランドリニューアル",
    description: "サイトリニューアルとプロモーション動画を一括制作",
    serviceCategory: ["web-development", "video-editing"],
    technologies: ["Next.js", "Premiere Pro", "After Effects"],
    featured: true, color: "#ec4899",
  },
  {
    slug: "startup-planning",
    title: "スタートアップ事業計画策定",
    description: "シード期の事業計画とKPI設計を支援",
    serviceCategory: ["business-planning"],
    technologies: ["事業計画", "KPI設計", "資料作成"],
    featured: false, color: "#14b8a6",
  },
];

// ── External links data ──
const externalLinks = [
  { name: "Zenn", desc: "技術記事", icon: Code2, href: "#" },
  { name: "Note", desc: "ビジネス・クリエイティブ", icon: PenTool, href: "#" },
  { name: "GitHub", desc: "コード", icon: Github, href: "#" },
];

// ── Fake Screenshot (SVG-based UI mockup, replaced with real images in production) ──
function FakeScreenshot({ seed }) {
  const colors = {
    0: { bg: "#0f172a", sidebar: "#1e293b", accent: "#6366f1", card: "#334155" },
    1: { bg: "#18181b", sidebar: "#27272a", accent: "#8b5cf6", card: "#3f3f46" },
    2: { bg: "#1a1a2e", sidebar: "#16213e", accent: "#e94560", card: "#0f3460" },
    3: { bg: "#1c1917", sidebar: "#292524", accent: "#14b8a6", card: "#44403c" },
  };
  const c = colors[seed % 4];
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill={c.bg} />
      <rect x="0" y="0" width="72" height="240" fill={c.sidebar} />
      <circle cx="36" cy="28" r="12" fill={c.accent} opacity="0.6" />
      {[60,88,116,144,172].map((y,i) => <rect key={i} x="16" y={y} width="40" height="6" rx="3" fill="white" opacity={i===1?0.3:0.1} />)}
      <rect x="72" y="0" width="328" height="40" fill={c.sidebar} opacity="0.5" />
      <rect x="88" y="14" width="80" height="10" rx="5" fill="white" opacity="0.15" />
      <rect x="320" y="12" width="56" height="16" rx="8" fill={c.accent} opacity="0.5" />
      <rect x="88" y="56" width="136" height="80" rx="8" fill={c.card} />
      <rect x="88" y="68" width="72" height="8" rx="4" fill="white" opacity="0.2" />
      <rect x="88" y="84" width="112" height="6" rx="3" fill="white" opacity="0.08" />
      <rect x="88" y="96" width="96" height="6" rx="3" fill="white" opacity="0.08" />
      <rect x="88" y="116" width="48" height="12" rx="6" fill={c.accent} opacity="0.4" />
      <rect x="240" y="56" width="136" height="80" rx="8" fill={c.card} />
      <rect x="240" y="68" width="64" height="8" rx="4" fill="white" opacity="0.2" />
      <rect x="240" y="84" width="104" height="6" rx="3" fill="white" opacity="0.08" />
      <rect x="240" y="96" width="80" height="6" rx="3" fill="white" opacity="0.08" />
      <rect x="88" y="152" width="288" height="72" rx="8" fill={c.card} />
      <polyline points="104,200 140,185 176,195 212,170 248,180 284,162 320,175 356,158" fill="none" stroke={c.accent} strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

// ── Duotone Image Area (Pattern A) ──
function DuotoneImage({ work, index, height = 160 }) {
  return (
    <div style={{ position: "relative", height, overflow: "hidden" }}>
      {/* Grayscale base */}
      <div style={{
        position: "absolute", inset: 0,
        filter: "grayscale(100%) brightness(0.6) contrast(1.1)",
      }}>
        <FakeScreenshot seed={index} />
      </div>
      {/* Color tint (duotone) */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${work.color}cc 0%, ${work.color}66 100%)`,
        mixBlendMode: "color",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${work.color}44 0%, transparent 100%)`,
        mixBlendMode: "overlay",
      }} />
      {/* Bottom fade into card background */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.06) 100%)",
      }} />
      {/* Border bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
        background: tokens.glass.border,
      }} />
    </div>
  );
}

// ── Navigation ──
function Nav({ currentPage, setPage, contactActive, servicesActive, heroActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    if (currentPage === "home") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      setPage("home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const navItems = [
    { id: "home", label: "ホーム", action: () => { setPage("home"); setMenuOpen(false); } },
    { id: "services", label: "サービス", action: () => scrollToSection("services") },
    { id: "contact", label: "お問い合わせ", action: () => scrollToSection("contact") },
  ];

  const isActive = (id) => {
    if (id === "contact") return contactActive;
    if (id === "services") return servicesActive && !contactActive;
    if (id === "home") return heroActive && !servicesActive && !contactActive;
    return false;
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 clamp(16px, 4vw, 48px)", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(26,15,36,0.7)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.4s ease",
      }}>
        <div onClick={() => setPage("home")} style={{
          fontFamily: "'Jost', sans-serif", fontSize: 18, fontWeight: 400,
          letterSpacing: "0.15em", color: tokens.text.heading, cursor: "pointer",
        }}>
          take77
        </div>

        <div style={{ display: "flex", gap: 32 }} className="desktop-nav">
          {navItems.map((item) => (
            <button key={item.id} onClick={item.action} style={{
              background: "none", border: "none", fontFamily: "'Jost', sans-serif",
              fontSize: 14, letterSpacing: "0.12em",
              color: isActive(item.id) ? tokens.text.heading : tokens.text.muted,
              cursor: "pointer", padding: "4px 0",
              borderBottom: isActive(item.id)
                ? `2px solid ${tokens.accent}` : "2px solid transparent",
              transition: "all 0.3s ease",
            }}>
              {item.label}
            </button>
          ))}
        </div>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", background: "none", border: "none", cursor: "pointer", padding: 8,
        }}>
          {menuOpen
            ? <X size={22} color={tokens.text.heading} strokeWidth={1.5} />
            : <Menu size={22} color={tokens.text.heading} strokeWidth={1.5} />}
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 99,
          background: "rgba(26,15,36,0.85)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 32,
        }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={item.action} style={{
              background: "none", border: "none", fontFamily: "'Jost', sans-serif",
              fontSize: 24, letterSpacing: "0.15em", color: tokens.text.heading, cursor: "pointer",
            }}>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ── About Section (Home only) ──
function AboutSection() {
  return (
    <section id="about" style={{
      padding: "80px clamp(24px, 6vw, 80px)",
      maxWidth: 1200, margin: "0 auto",
    }}>
      <SectionTitle label="About" title="自己紹介" />
      <GlassCard hover={false} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px, 280px) 1fr",
          minHeight: 320,
        }} className="about-grid">
          <div style={{
            padding: "40px 32px",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 24,
            borderRight: `1px solid ${tokens.glass.border}`,
            background: "rgba(139,92,246,0.04)",
          }} className="about-left">
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.15) 100%)",
              border: `2px solid ${tokens.glass.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 40px rgba(139,92,246,0.15)",
            }}>
              <User size={40} strokeWidth={1} color="rgba(255,255,255,0.35)" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Jost', sans-serif", fontSize: 20, fontWeight: 400,
                color: tokens.text.heading, letterSpacing: "0.1em", marginBottom: 4,
              }}>
                take77
              </div>
              <div style={{ fontSize: 12, color: tokens.text.muted, letterSpacing: "0.06em" }}>
                Developer / Creator
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {externalLinks.map((link) => (
                <a key={link.name} href={link.href} title={link.name} style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s ease", textDecoration: "none",
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(139,92,246,0.15)";
                    e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <link.icon size={18} strokeWidth={1.5} color={tokens.text.muted} />
                </a>
              ))}
            </div>
          </div>
          <div style={{
            padding: "40px 36px",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <p style={{
              fontSize: 14, color: tokens.text.primary, lineHeight: 2.2,
              margin: "0 0 28px", letterSpacing: "0.04em",
            }}>
              テクノロジーとクリエイティビティを軸に、フリーランスとして活動しています。
              システム開発やWebサイト制作に加え、経営企画支援や動画編集まで、
              ビジネスの成長に必要な要素をワンストップでサポートします。
            </p>
            <p style={{
              fontSize: 14, color: tokens.text.primary, lineHeight: 2.2,
              margin: "0 0 28px", letterSpacing: "0.04em",
            }}>
              「技術がわかるビジネスパーソン」として、クライアントの課題を理解し、
              最適なソリューションを提案・実装することを大切にしています。
            </p>
            <div style={{
              display: "flex", gap: 24, flexWrap: "wrap",
              paddingTop: 20, borderTop: `1px solid ${tokens.glass.border}`,
            }}>
              {[
                { icon: Briefcase, label: "フリーランス", sub: "独立して活動中" },
                { icon: Code2, label: "フルスタック", sub: "フロント〜バックエンド" },
                { icon: BarChart3, label: "経営視点", sub: "ビジネス × テクノロジー" },
              ].map((item) => (
                <div key={item.label} style={{
                  display: "flex", alignItems: "center", gap: 12, flex: "1 1 160px",
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: "rgba(139,92,246,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <item.icon size={16} strokeWidth={1.5} color={tokens.text.accent} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: tokens.text.heading, fontWeight: 400, letterSpacing: "0.04em" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11, color: tokens.text.muted }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}

// ── Contact Section (shared) ──
function ContactSection() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const handleSubmit = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  };
  const inputStyle = {
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: tokens.text.primary, fontSize: 14,
    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  };

  return (
    <section id="contact" style={{
      padding: "80px clamp(24px, 6vw, 80px) 100px",
      maxWidth: 1200, margin: "0 auto",
    }}>
      <SectionTitle label="Contact" title="お問い合わせ" />
      <p style={{ fontSize: 14, color: tokens.text.muted, lineHeight: 2, marginBottom: 40 }}>
        ご相談・お見積りは無料です。2営業日以内にご返信いたします。
      </p>
      {sent ? (
        <GlassCard hover={false} style={{ padding: 48, textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
          <CheckCircle2 size={40} strokeWidth={1.2} color={tokens.accent} style={{ marginBottom: 16 }} />
          <h3 style={{
            fontSize: 18, color: tokens.text.heading, fontWeight: 300,
            fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em", margin: "0 0 8px",
          }}>送信しました</h3>
          <p style={{ fontSize: 13, color: tokens.text.muted, margin: 0 }}>
            お問い合わせありがとうございます。
          </p>
        </GlassCard>
      ) : (
        <GlassCard hover={false} style={{ padding: "36px 32px", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-row">
              <div>
                <label style={{ fontSize: 12, color: tokens.text.muted, marginBottom: 6, display: "block", letterSpacing: "0.05em" }}>お名前 *</label>
                <input style={inputStyle} placeholder="山田 太郎" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: tokens.text.muted, marginBottom: 6, display: "block", letterSpacing: "0.05em" }}>メールアドレス *</label>
                <input type="email" style={inputStyle} placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, color: tokens.text.muted, marginBottom: 6, display: "block", letterSpacing: "0.05em" }}>ご興味のあるサービス</label>
              <select style={{ ...inputStyle, appearance: "none" }}>
                <option value="">選択してください</option>
                {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: tokens.text.muted, marginBottom: 6, display: "block", letterSpacing: "0.05em" }}>メッセージ *</label>
              <textarea rows={5} style={{ ...inputStyle, resize: "vertical" }} placeholder="ご相談内容をお書きください" />
            </div>
            <button onClick={handleSubmit} disabled={sending} style={{
              background: sending ? "rgba(139,92,246,0.5)" : tokens.accent,
              color: "#fff", border: "none", borderRadius: 12, padding: "16px",
              fontSize: 14, fontWeight: 500, letterSpacing: "0.1em",
              cursor: sending ? "not-allowed" : "pointer",
              fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease",
              marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {sending ? "送信中..." : <>送信する <Send size={14} strokeWidth={2} /></>}
            </button>
          </div>
        </GlassCard>
      )}
    </section>
  );
}

// ── Home Page ──
function HomePage({ setPage, setSelectedService }) {
  return (
    <div>
      {/* 1. Hero */}
      <section id="hero" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center",
        padding: "120px clamp(24px, 6vw, 80px) 80px",
        maxWidth: 1200, margin: "0 auto",
        position: "relative",
      }}>
        <GridPattern />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            fontSize: "clamp(2.4rem, 7vw, 4.5rem)", fontWeight: 300,
            color: tokens.text.heading, lineHeight: 1.15, letterSpacing: "0.04em",
            fontFamily: "'Jost', sans-serif", marginBottom: 24,
          }}>
            <span style={{ display: "block" }}>Technology</span>
            <span style={{ display: "block" }}>
              meets{" "}
              <span style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontWeight: 400,
              }}>
                Creativity
              </span>
            </span>
          </div>
          <p style={{
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: tokens.text.muted,
            lineHeight: 2, maxWidth: 520, marginBottom: 48, letterSpacing: "0.06em",
          }}>
            テクノロジーとクリエイティビティで、<br />ビジネスの可能性を広げる。
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: tokens.accent, color: "#fff", border: "none", borderRadius: 12,
              padding: "14px 36px", fontSize: 14, fontWeight: 500, letterSpacing: "0.1em",
              cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease",
              display: "flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = tokens.accentHover}
              onMouseLeave={(e) => e.currentTarget.style.background = tokens.accent}
            >
              サービスを見る <ArrowRight size={16} strokeWidth={2} />
            </button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
              background: "transparent", color: tokens.text.heading,
              border: `1px solid ${tokens.glass.border}`, borderRadius: 12,
              padding: "14px 36px", fontSize: 14, fontWeight: 400, letterSpacing: "0.1em",
              cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease",
            }}>
              お問い合わせ
            </button>
          </div>
        </div>
        <div style={{
          marginTop: "auto", paddingTop: 60, display: "flex",
          alignItems: "center", gap: 12, color: tokens.text.muted,
          fontSize: 12, letterSpacing: "0.15em", position: "relative", zIndex: 1,
        }}>
          <div style={{
            width: 1, height: 40,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)",
          }} />
          SCROLL
        </div>
      </section>

      {/* 2. Services */}
      <section id="services" style={{ padding: "80px clamp(24px, 6vw, 80px)", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle label="Services" title="提供サービス" />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20,
        }}>
          {services.map((s) => (
            <GlassCard key={s.id} onClick={() => { setSelectedService(s.id); setPage("service-detail"); }} style={{ padding: "32px 28px" }}>
              <ServiceIcon icon={s.icon} />
              <div style={{ fontSize: 11, letterSpacing: "0.15em", color: tokens.text.accent, marginBottom: 4, fontFamily: "'Jost', sans-serif" }}>{s.titleEn}</div>
              <h3 style={{ fontSize: 18, fontWeight: 400, color: tokens.text.heading, margin: "0 0 12px", letterSpacing: "0.08em", fontFamily: "'Jost', sans-serif" }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: tokens.text.muted, lineHeight: 1.8, margin: 0 }}>{s.desc}</p>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 6, color: tokens.accent, fontSize: 13, fontFamily: "'Jost', sans-serif", letterSpacing: "0.05em" }}>
                詳しく見る <ChevronRight size={15} strokeWidth={2} />
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 3. Featured Works */}
      <section style={{ padding: "80px clamp(24px, 6vw, 80px)", maxWidth: 1200, margin: "0 auto" }}>
        <SectionTitle label="Featured Works" title="実績ハイライト" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {works.filter((w) => w.featured).map((w, i) => (
            <GlassCard key={w.slug} style={{ overflow: "hidden" }}>
              <DuotoneImage work={w} index={i} height={160} />
              <div style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {w.serviceCategory.map((cat) => (
                    <span key={cat} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: "rgba(139,92,246,0.15)", color: tokens.text.accent, letterSpacing: "0.05em", fontFamily: "'Jost', sans-serif" }}>
                      {services.find((s) => s.id === cat)?.title}
                    </span>
                  ))}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 400, color: tokens.text.heading, margin: "0 0 8px", letterSpacing: "0.06em", lineHeight: 1.6 }}>{w.title}</h3>
                <p style={{ fontSize: 13, color: tokens.text.muted, margin: "0 0 16px", lineHeight: 1.7 }}>{w.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {w.technologies.map((t) => (<span key={t} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.03em" }}>{t}</span>))}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: tokens.accent, fontSize: 12, fontFamily: "'Jost', sans-serif",
                    letterSpacing: "0.05em", cursor: "pointer", flexShrink: 0,
                    transition: "gap 0.3s ease",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.gap = "8px"}
                    onMouseLeave={(e) => e.currentTarget.style.gap = "4px"}
                  >
                    詳しく見る <ChevronRight size={14} strokeWidth={2} />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <button onClick={() => setPage("works")} style={{
            background: "transparent", color: tokens.text.heading,
            border: `1px solid ${tokens.glass.border}`, borderRadius: 12,
            padding: "12px 32px", fontSize: 13, fontWeight: 400, letterSpacing: "0.1em",
            cursor: "pointer", fontFamily: "'Jost', sans-serif", transition: "all 0.3s ease",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = tokens.glass.border; e.currentTarget.style.background = "transparent"; }}
          >
            すべての実績を見る <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* 4. About */}
      <AboutSection />
      {/* 5. Contact */}
      <ContactSection />
    </div>
  );
}

// ── Works List Page (/works) ──
function WorksListPage({ setPage }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? works : works.filter((w) => w.serviceCategory.includes(filter));

  return (
    <div>
      <div style={{ padding: "120px clamp(24px, 6vw, 80px) 0", maxWidth: 1200, margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{
          fontSize: 12, color: tokens.text.muted, marginBottom: 32,
          display: "flex", gap: 8, alignItems: "center", fontFamily: "'Jost', sans-serif",
        }}>
          <span onClick={() => setPage("home")} style={{ cursor: "pointer", color: tokens.text.accent }}>ホーム</span>
          <ChevronRight size={12} strokeWidth={1.5} style={{ opacity: 0.4 }} />
          <span>実績一覧</span>
        </div>

        <SectionTitle label="Works" title="実績一覧" />
        <p style={{ fontSize: 14, color: tokens.text.muted, lineHeight: 2, marginBottom: 32, maxWidth: 600 }}>
          これまでに手がけたプロジェクトの一覧です。
        </p>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {[
            { id: "all", label: "すべて" },
            ...services.map((s) => ({ id: s.id, label: s.title })),
          ].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              background: filter === f.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f.id ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 100, padding: "6px 18px", fontSize: 12,
              color: filter === f.id ? tokens.text.accent : tokens.text.muted,
              cursor: "pointer", fontFamily: "'Jost', sans-serif", letterSpacing: "0.05em",
              transition: "all 0.3s ease",
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Works grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, paddingBottom: 40 }}>
          {filtered.map((w, i) => (
            <GlassCard key={w.slug} style={{ overflow: "hidden" }}>
              <DuotoneImage work={w} index={works.indexOf(w)} height={160} />
              <div style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {w.serviceCategory.map((cat) => (
                    <span key={cat} style={{ fontSize: 10, padding: "3px 10px", borderRadius: 100, background: "rgba(139,92,246,0.15)", color: tokens.text.accent, letterSpacing: "0.05em", fontFamily: "'Jost', sans-serif" }}>
                      {services.find((s) => s.id === cat)?.title}
                    </span>
                  ))}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 400, color: tokens.text.heading, margin: "0 0 8px", letterSpacing: "0.06em", lineHeight: 1.6 }}>{w.title}</h3>
                <p style={{ fontSize: 13, color: tokens.text.muted, margin: "0 0 16px", lineHeight: 1.7 }}>{w.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {w.technologies.map((t) => (<span key={t} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.03em" }}>{t}</span>))}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: tokens.accent, fontSize: 12, fontFamily: "'Jost', sans-serif",
                    letterSpacing: "0.05em", cursor: "pointer", flexShrink: 0,
                  }}>
                    詳しく見る <ChevronRight size={14} strokeWidth={2} />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filtered.length === 0 && (
          <GlassCard hover={false} style={{ padding: 40, textAlign: "center", marginBottom: 40 }}>
            <p style={{ color: tokens.text.muted, fontSize: 14, margin: 0 }}>該当する実績がありません。</p>
          </GlassCard>
        )}
      </div>
      <ContactSection />
    </div>
  );
}

// ── Service Detail Page ──
function ServiceDetailPage({ serviceId, setPage }) {
  const service = services.find((s) => s.id === serviceId);
  const relatedWorks = works.filter((w) => w.serviceCategory.includes(serviceId));
  if (!service) return null;
  const SvcIcon = service.icon;

  return (
    <div>
      <div style={{ padding: "100px clamp(24px, 6vw, 80px) 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 12, color: tokens.text.muted, marginBottom: 32, display: "flex", gap: 8, alignItems: "center", fontFamily: "'Jost', sans-serif" }}>
          <span onClick={() => setPage("home")} style={{ cursor: "pointer", color: tokens.text.accent }}>ホーム</span>
          <ChevronRight size={12} strokeWidth={1.5} style={{ opacity: 0.4 }} />
          <span>{service.title}</span>
        </div>
        <div style={{ marginBottom: 60 }}>
          <ServiceIcon icon={SvcIcon} size={28} />
          <div style={{ fontSize: 12, letterSpacing: "0.2em", color: tokens.text.accent, marginBottom: 8, fontFamily: "'Jost', sans-serif" }}>{service.titleEn}</div>
          <h1 style={{ fontSize: "clamp(1.6rem, 5vw, 2.5rem)", fontWeight: 300, color: tokens.text.heading, margin: "0 0 20px", letterSpacing: "0.08em", fontFamily: "'Jost', sans-serif" }}>{service.title}</h1>
          <p style={{ fontSize: 15, color: tokens.text.muted, lineHeight: 2, maxWidth: 640 }}>{service.desc}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 80 }}>
          <GlassCard hover={false} style={{ padding: "28px 24px" }}>
            <h4 style={{ fontSize: 12, letterSpacing: "0.12em", color: tokens.text.accent, margin: "0 0 16px", fontFamily: "'Jost', sans-serif" }}>対応範囲</h4>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, color: tokens.text.primary, lineHeight: 2.2 }}>
              <li>要件定義・設計</li><li>開発・実装</li><li>テスト・品質保証</li><li>リリース・運用保守</li>
            </ul>
          </GlassCard>
          <GlassCard hover={false} style={{ padding: "28px 24px" }}>
            <h4 style={{ fontSize: 12, letterSpacing: "0.12em", color: tokens.text.accent, margin: "0 0 16px", fontFamily: "'Jost', sans-serif" }}>使用技術</h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {service.tech.map((t) => (
                <span key={t} style={{ fontSize: 12, padding: "5px 14px", borderRadius: 8, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.15)", color: tokens.text.accent }}>{t}</span>
              ))}
            </div>
          </GlassCard>
          <GlassCard hover={false} style={{ padding: "28px 24px" }}>
            <h4 style={{ fontSize: 12, letterSpacing: "0.12em", color: tokens.text.accent, margin: "0 0 16px", fontFamily: "'Jost', sans-serif" }}>プロセス</h4>
            <div style={{ fontSize: 13, color: tokens.text.primary, lineHeight: 2.2 }}>
              {["ヒアリング", "提案・見積り", "開発・制作", "納品・フォロー"].map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: tokens.accent, fontWeight: 600, fontFamily: "'Jost', sans-serif", fontSize: 12 }}>{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        <SectionTitle label="Works" title="関連する実績" />
        {relatedWorks.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, paddingBottom: 40 }}>
            {relatedWorks.map((w, i) => (
              <GlassCard key={w.slug} style={{ overflow: "hidden" }}>
                <DuotoneImage work={w} index={works.indexOf(w)} height={120} />
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {w.serviceCategory.map((cat) => (
                      <span key={cat} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "rgba(139,92,246,0.15)", color: tokens.text.accent, fontFamily: "'Jost', sans-serif" }}>
                        {services.find((s) => s.id === cat)?.title}
                      </span>
                    ))}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 400, color: tokens.text.heading, margin: "0 0 6px", lineHeight: 1.6 }}>{w.title}</h3>
                  <p style={{ fontSize: 12, color: tokens.text.muted, margin: "0 0 12px", lineHeight: 1.6 }}>{w.description}</p>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: tokens.accent, fontSize: 12, fontFamily: "'Jost', sans-serif",
                    letterSpacing: "0.05em", cursor: "pointer",
                  }}>
                    詳しく見る <ChevronRight size={14} strokeWidth={2} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard hover={false} style={{ padding: 40, textAlign: "center", marginBottom: 40 }}>
            <p style={{ color: tokens.text.muted, fontSize: 14, margin: 0 }}>実績を準備中です。</p>
          </GlassCard>
        )}
      </div>
      <ContactSection />
    </div>
  );
}

// ── Footer ──
function Footer({ setPage }) {
  return (
    <footer style={{
      padding: "32px clamp(24px, 6vw, 80px)",
      borderTop: `1px solid ${tokens.glass.border}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: 16, maxWidth: 1200, margin: "0 auto",
    }}>
      <div style={{ fontSize: 12, color: tokens.text.muted, fontFamily: "'Jost', sans-serif", letterSpacing: "0.1em" }}>
        © 2026 take77
      </div>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <span onClick={() => {
          setPage("home");
          setTimeout(() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }), 100);
        }} style={{
          fontSize: 12, color: tokens.text.muted, cursor: "pointer",
          fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em", transition: "color 0.3s",
        }}
          onMouseEnter={(e) => e.currentTarget.style.color = tokens.text.heading}
          onMouseLeave={(e) => e.currentTarget.style.color = tokens.text.muted}
        >About</span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>|</span>
        {externalLinks.map((link) => (
          <a key={link.name} href={link.href} title={link.name} style={{
            color: tokens.text.muted, transition: "color 0.3s", display: "flex",
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = tokens.text.heading}
            onMouseLeave={(e) => e.currentTarget.style.color = tokens.text.muted}
          >
            <link.icon size={16} strokeWidth={1.5} />
          </a>
        ))}
      </div>
    </footer>
  );
}

// ── Main App ──
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedService, setSelectedService] = useState(null);
  const [contactActive, setContactActive] = useState(false);
  const [servicesActive, setServicesActive] = useState(false);
  const [heroActive, setHeroActive] = useState(true);

  // Track #hero visibility
  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el) { setHeroActive(false); return; }
    const observer = new IntersectionObserver(
      ([entry]) => setHeroActive(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  // Track #contact visibility
  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) { setContactActive(false); return; }
    const observer = new IntersectionObserver(
      ([entry]) => setContactActive(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  // Track #services visibility
  useEffect(() => {
    const el = document.getElementById("services");
    if (!el) { setServicesActive(false); return; }
    const observer = new IntersectionObserver(
      ([entry]) => setServicesActive(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage setPage={setPage} setSelectedService={setSelectedService} />;
      case "works":
        return <WorksListPage setPage={setPage} />;
      case "service-detail":
        return <ServiceDetailPage serviceId={selectedService} setPage={setPage} />;
      default:
        return <HomePage setPage={setPage} setSelectedService={setSelectedService} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: tokens.bg.gradient,
      fontFamily: "'Jost', 'Sawarabi Gothic', 'Hiragino Kaku Gothic ProN', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500;600&display=swap');

        /* ── Refined blob animations ── */
        /* Blob 1: slow wide orbit with scale pulse and color shift */
        @keyframes blob1Move {
          0%   { transform: translate(0, 0) scale(1); }
          20%  { transform: translate(40px, -30px) scale(1.08); }
          40%  { transform: translate(-10px, -60px) scale(0.97); }
          60%  { transform: translate(50px, 20px) scale(1.05); }
          80%  { transform: translate(-20px, 40px) scale(0.98); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob1Color {
          0%, 100% { opacity: 1; }
          30%  { opacity: 0.7; }
          60%  { opacity: 1.1; }
          80%  { opacity: 0.85; }
        }
        .blob-1 {
          animation:
            blob1Move 28s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite,
            blob1Color 20s ease-in-out infinite;
        }

        /* Blob 2: medium counter-orbit, asymmetric easing */
        @keyframes blob2Move {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(-35px, 45px) scale(1.06); }
          50%  { transform: translate(20px, -25px) scale(0.94); }
          75%  { transform: translate(-50px, -15px) scale(1.03); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob2Color {
          0%, 100% { opacity: 1; }
          40%  { opacity: 1.15; }
          70%  { opacity: 0.75; }
        }
        .blob-2 {
          animation:
            blob2Move 24s cubic-bezier(0.37, 0, 0.63, 1) infinite,
            blob2Color 18s ease-in-out infinite 2s;
        }

        /* Blob 3: fastest, tightest orbit */
        @keyframes blob3Move {
          0%   { transform: translate(0, 0) scale(1); }
          30%  { transform: translate(25px, -35px) scale(1.04); }
          60%  { transform: translate(-30px, 15px) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .blob-3 {
          animation: blob3Move 19s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        /* Blob 4: very slow drift, ambient depth */
        @keyframes blob4Move {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-40px, 30px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes blob4Color {
          0%, 100% { opacity: 0.8; }
          50%  { opacity: 1.2; }
        }
        .blob-4 {
          animation:
            blob4Move 35s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite,
            blob4Color 25s ease-in-out infinite;
        }

        * { box-sizing: border-box; }
        ::selection { background: rgba(139,92,246,0.35); color: #fff; }
        input:focus, textarea:focus, select:focus { border-color: rgba(139,92,246,0.5) !important; }
        select option { background: #211829; color: #f0f0f5; }

        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .about-left { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.1) !important; padding: 32px 24px !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu-btn { display: none !important; }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 3px; }
      `}</style>

      <Blobs />
      <NoiseOverlay />
      <Nav currentPage={page} setPage={setPage} contactActive={contactActive} servicesActive={servicesActive} heroActive={heroActive} />
      <div style={{ position: "relative", zIndex: 2 }}>
        {renderPage()}
        <Footer setPage={setPage} />
      </div>
    </div>
  );
}
