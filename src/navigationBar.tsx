'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/lotto', emoji: '🎰', label: 'Lotto' },
  { href: '/viking', emoji: '⚔️', label: 'Viking' },
  { href: '/euro', emoji: '💶', label: 'Euro' },
];

const secondaryLinks = [
  { href: '/about', emoji: '🛈', label: 'Om' },
];

function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch (e) {}
  }

  useEffect(() => {
    function handleScroll() {
      const nav = document.querySelector('.nav') as HTMLElement | null;
      if (nav) {
        nav.style.boxShadow = window.scrollY > 0
          ? '0 4px 12px rgba(0,0,0,0.12)'
          : '0 1px 4px rgba(0,0,0,0.08)';
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">Lottostat</Link>
      <ul>
        {navLinks.map(({ href, emoji, label }) => (
          <li key={href}>
            <Link href={href} className={pathname === href ? 'active' : ''}>
              <span>{emoji}</span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <ul>
        {secondaryLinks.map(({ href, emoji, label }) => (
          <li key={href}>
            <Link href={href} className={pathname === href ? 'active' : ''}>
              <span>{emoji}</span>
              {label}
            </Link>
          </li>
        ))}
        <li>
          <button className="dark-toggle" onClick={toggleDark} aria-label="Toggle dark mode">
            {dark ? '☀︎' : '☽'}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
