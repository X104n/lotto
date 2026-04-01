import Link from 'next/link';

const games = [
  { href: '/lotto', emoji: '🎰', name: 'Lotto', description: 'Vanlig lotto – tall 1–34, trekkes hver lørdag.' },
  { href: '/viking', emoji: '⚔️', name: 'Viking Lotto', description: 'Nordisk lotteri med tall 1–48 + vikingtall.' },
  { href: '/euro', emoji: '💶', name: 'Euro Jackpot', description: 'Europeisk jackpot med tall 1–50 + eurotall.' },
];

const Home = () => {
  return (
    <>
      <div className="card">
        <h1>Norsk Svindell 🔥</h1>
        <p>
          Statistikk over Norsk Tipping-lotterier. Velg et spill nedenfor for å se trekningstall og trender.
          Bruk informasjonen på eget ansvar.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {games.map(({ href, emoji, name, description }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{emoji}</div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{name}</h2>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
