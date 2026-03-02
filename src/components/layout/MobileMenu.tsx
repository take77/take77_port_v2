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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          background: 'rgba(26, 15, 36, 0.88)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
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
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 400,
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
