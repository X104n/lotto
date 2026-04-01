import Link from 'next/link';
import { useEffect } from 'react';

function Navbar() {
  useEffect(() => {
    function handleScroll() {
      const navbar = document.querySelector('.nav ul') as HTMLElement | null;
      if (navbar) {
        navbar.style.padding = window.scrollY > 0 ? '5px' : '20px';
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="nav">
      <ul>
        <li className="ham">
          <Link href="/idk">🍔</Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link href="/">🏠</Link>
        </li>
        <li>
          <Link href="/lotto">🎰</Link>
        </li>
        <li>
          <Link href="/viking">⚔️</Link>
        </li>
        <li>
          <Link href="/euro">💶</Link>
        </li>
      </ul>
      <ul>
        <li>
          <Link href="/about">🛈</Link>
        </li>
        <li>
          <Link href="/login">🔒</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
