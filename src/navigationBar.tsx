import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const navLinks = [
  { href: '/', emoji: '🏠', label: 'Hjem' },
  { href: '/lotto', emoji: '🎰', label: 'Lotto' },
  { href: '/viking', emoji: '⚔️', label: 'Viking' },
  { href: '/euro', emoji: '💶', label: 'Euro' },
];

const secondaryLinks = [
  { href: '/about', emoji: '🛈', label: 'Om' },
];

function Navbar() {
  const { pathname } = useRouter();

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
      </ul>
    </nav>
  );
}

export default Navbar;
