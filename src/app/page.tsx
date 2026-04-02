'use client';

import Link from 'next/link';

const games = [
  {
    href: '/lotto',
    emoji: '🎰',
    name: 'Lotto',
    description: '7 tall trekkes fra 1–34 hver lørdag. Jackpot krever 7 rette. Et tilleggstall gir mulighet for «6 + 1 rette».',
  },
  {
    href: '/viking',
    emoji: '⚔️',
    name: 'Viking Lotto',
    description: '6 tall trekkes fra 1–48 + 1 vikingtall fra 1–5. Spilles i 9 nordiske og baltiske land hver onsdag.',
  },
  {
    href: '/euro',
    emoji: '💶',
    name: 'Euro Jackpot',
    description: '5 tall trekkes fra 1–50 + 2 stjernetall fra 1–12. Pan-europeisk jackpotlotteri hver tirsdag og fredag.',
  },
  {
    href: '/oddsen',
    emoji: '⚽',
    name: 'Oddsen',
    description: 'Kommende kamper og live odds på fotball, ishockey, tennis og mer fra Norsk Tippings sportsbook.',
  },
];

const Home = () => {
  return (
    <>
      <div className="card">
        <h1>Lottostat</h1>
        <p>
          Lottostat viser trekningstall og statistikk for Norsk Tipping-lotterier.
          Data hentes direkte fra Norsk Tippings åpne API.
        </p>
        <p style={{ margin: 0 }}>
          Velg et spill nedenfor og en tidsperiode for å se hvilke tall som har vært trukket
          oftest, premiestatistikk, og mye mer.
        </p>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {games.map(({ href, emoji, name, description }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <div
              className="card"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.15s', height: '100%' }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{emoji}</div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{name}</h2>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
