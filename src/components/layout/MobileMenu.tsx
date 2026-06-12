import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/#hero', label: 'ホーム' },
  { href: '/#services', label: 'サービス' },
  { href: '/#contact', label: 'お問い合わせ' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Listen for hamburger button toggle events
  useEffect(() => {
    const handleToggle = (e: Event) => {
      const { open } = (e as CustomEvent<{ open: boolean }>).detail;
      setIsOpen(open);
    };
    document.addEventListener('toggle-mobile-menu', handleToggle);
    return () => document.removeEventListener('toggle-mobile-menu', handleToggle);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key closes menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    const hamburger = document.getElementById('hamburger-btn');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--overlay-bg)',
          backdropFilter: 'blur(4px)',
          zIndex: 90,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      {/* Drawer — glass morphism applied per spec §5.4 */}
      <nav
        id="mobile-menu"
        aria-label="モバイルナビゲーション"
        aria-hidden={!isOpen}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '280px',
          height: '100%',
          zIndex: 95,
          background: 'var(--drawer-bg)',
          backdropFilter: 'blur(20px) saturate(200%)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%)',
          borderLeft: '1px solid var(--card-border-hover)',
          boxShadow: 'var(--drawer-shadow)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 2rem 2rem',
        }}
      >
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
          }}
        >
          {NAV_ITEMS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                onClick={closeMenu}
                style={{
                  display: 'block',
                  padding: '1rem 0',
                  color: 'var(--text-strong)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 400,
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--border-weak)',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
