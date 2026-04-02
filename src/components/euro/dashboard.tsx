import { FrequencyChart } from '../lotto/chart';
import type { DrawResult } from '../../types/lotto';

interface Props {
  data: DrawResult[];
}

// ── helpers ──────────────────────────────────────────────────────────────────

function formatNOK(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} mrd`;
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)} mill`;
  return value.toLocaleString('nb-NO');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nb-NO', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// Euro Jackpot: 5 main numbers from 1–50
function countMainNumbers(data: DrawResult[]): number[] {
  const counts = new Array<number>(50).fill(0);
  for (const draw of data) {
    for (const { number, type } of draw.winnerNumber) {
      if (type === 1) {
        const n = Number(number);
        if (n >= 1 && n <= 50) counts[n - 1]++;
      }
    }
  }
  return counts;
}

// Euro Jackpot: 2 star numbers (stjernetall) from 1–12
function countStarNumbers(data: DrawResult[]): number[] {
  const counts = new Array<number>(12).fill(0);
  for (const draw of data) {
    for (const { number, type } of draw.winnerNumber) {
      if (type === 2) {
        const n = Number(number);
        if (n >= 1 && n <= 12) counts[n - 1]++;
      }
    }
  }
  return counts;
}

// gameNo 77 = Friday, 78 = Tuesday
const FRIDAY_GAME_NO = 77;
const TUESDAY_GAME_NO = 78;

const PRIZE_ORDER = [
  '5+2', '5+1', '5+0', '4+2', '4+1', '3+2', '4+0', '2+2', '3+1', '3+0', '1+2', '2+1',
];

// ── sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className={`stat-card-value${highlight ? ' highlight' : ''}`}>{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="section-title">{children}</h2>;
}

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className={`rank-badge${rank <= 3 ? ` rank-${rank}` : ''}`}>
      {rank}
    </span>
  );
}

// ── section: summary ─────────────────────────────────────────────────────────

function Summary({ data }: Props) {
  const mainCounts = countMainNumbers(data);
  const starCounts = countStarNumbers(data);

  const maxMain = Math.max(...mainCounts);
  const minMain = Math.min(...mainCounts);
  const hotMain = mainCounts.indexOf(maxMain) + 1;
  const coldMain = mainCounts.indexOf(minMain) + 1;
  const hotStar = starCounts.indexOf(Math.max(...starCounts)) + 1;

  const totalTurnover = data.reduce((sum, d) => sum + parseFloat(d.turnover || '0'), 0);

  const jackpotWinners = data.reduce((sum, d) => {
    const tier = d.prize.find((p) => p.id === 1);
    return sum + (tier ? parseInt(tier.winners) : 0);
  }, 0);

  const fridayDraws = data.filter((d) => d.gameNo === FRIDAY_GAME_NO).length;
  const tuesdayDraws = data.filter((d) => d.gameNo === TUESDAY_GAME_NO).length;

  const dates = data.map((d) => d.drawDate).sort();
  const period = dates.length
    ? `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
    : '';

  const drawLabel = fridayDraws > 0 && tuesdayDraws > 0
    ? `${data.length} trekkinger (${fridayDraws} fre · ${tuesdayDraws} tir)`
    : `${data.length} trekkinger`;

  return (
    <>
      {period && (
        <p style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          {drawLabel} · {period}
        </p>
      )}
      <div className="stat-grid">
        <StatCard label="Trekkinger" value={String(data.length)} />
        <StatCard label="Norsk omsetning" value={`${formatNOK(totalTurnover)} kr`} />
        <StatCard label="Jackpot vinnere (5+2)" value={String(jackpotWinners)} />
        <StatCard label="Varmeste tall 🔥" value={String(hotMain)} highlight />
        <StatCard label="Kaldeste tall ❄️" value={String(coldMain)} />
        <StatCard label="Varmeste stjernetall ⭐" value={String(hotStar)} highlight />
      </div>
    </>
  );
}

// ── section: frequency charts ─────────────────────────────────────────────────

function FrequencyCharts({ data }: Props) {
  const mainCounts = countMainNumbers(data);
  const starCounts = countStarNumbers(data);

  return (
    <>
      <div className="card">
        <SectionTitle>Hovedtall (1–50)</SectionTitle>
        <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          5 tall trekkes per runde. Alle premienivåer fra «5+2» ned til «2+1» krever minst ett riktig hovedtall.
        </p>
        <FrequencyChart counts={mainCounts} tooltipLabel="Trukket som hovedtall" colorRgb="201, 162, 39" />
      </div>
      <div className="card">
        <SectionTitle>Stjernetall (1–12)</SectionTitle>
        <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          2 stjernetall trekkes per runde fra 1–12. Begge er nødvendige for jackpot (5+2).
        </p>
        <FrequencyChart counts={starCounts} tooltipLabel="Trukket som stjernetall" colorRgb="201, 162, 39" />
      </div>
    </>
  );
}

// ── section: top & bottom 10 main numbers ────────────────────────────────────

function NumberTable({
  title,
  rows,
}: {
  title: string;
  rows: { rank: number; number: number; count: number; pct: number }[];
}) {
  return (
    <div className="card">
      <SectionTitle>{title}</SectionTitle>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tall</th>
            <th>Trukket</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ rank, number, count, pct }) => (
            <tr key={number}>
              <td><RankBadge rank={rank} /></td>
              <td><strong>{number}</strong></td>
              <td>{count}</td>
              <td style={{ color: 'var(--text-muted)' }}>{pct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NumberTables({ data }: Props) {
  const counts = countMainNumbers(data);
  const totalDraws = data.length;

  const ranked = counts
    .map((count, i) => ({ number: i + 1, count, pct: totalDraws ? (count / totalDraws) * 100 : 0 }))
    .sort((a, b) => b.count - a.count);

  const top10 = ranked.slice(0, 10).map((r, i) => ({ ...r, rank: i + 1 }));
  const bottom10 = [...ranked].reverse().slice(0, 10).map((r, i) => ({ ...r, rank: i + 1 }));

  return (
    <div className="two-col">
      <NumberTable title="Mest trukne hovedtall" rows={top10} />
      <NumberTable title="Minst trukne hovedtall" rows={bottom10} />
    </div>
  );
}

// ── section: star number ranking ─────────────────────────────────────────────

function StarNumberTable({ data }: Props) {
  const counts = countStarNumbers(data);
  const totalDraws = data.length;

  // Each draw has 2 star numbers, so expected draws per star ≈ totalDraws * 2
  const ranked = counts
    .map((count, i) => ({
      rank: 0,
      number: i + 1,
      count,
      pct: totalDraws ? (count / (totalDraws * 2)) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  const maxCount = ranked[0]?.count || 1;

  return (
    <div className="card">
      <SectionTitle>Alle stjernetall rangert (1–12)</SectionTitle>
      <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        Andel av trekkinger (2 stjernetall per trekking).
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {ranked.map(({ rank, number, count, pct }) => (
          <div key={number} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <RankBadge rank={rank} />
            <span style={{ width: '2.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
              {number}
            </span>
            <div style={{ flex: 1, background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(count / maxCount) * 100}%`,
                  background: rank === 1 ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.35)',
                  borderRadius: 99,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <span style={{ width: '3rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {count}× ({pct.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── section: prize stats ──────────────────────────────────────────────────────

function PrizeStats({ data }: Props) {
  const agg: Record<string, { winners: number; totalValue: number }> = {};

  for (const draw of data) {
    for (const prize of draw.prize) {
      if (!agg[prize.name]) agg[prize.name] = { winners: 0, totalValue: 0 };
      const w = parseInt(prize.winners);
      const v = parseInt(prize.value);
      agg[prize.name].winners += w;
      if (!isNaN(v)) agg[prize.name].totalValue += w * v;
    }
  }

  const rows = PRIZE_ORDER.filter((name) => agg[name]).map((name) => ({
    name,
    ...agg[name],
  }));

  return (
    <div className="card">
      <SectionTitle>Premiestatistikk (norske vinnere)</SectionTitle>
      <table className="data-table">
        <thead>
          <tr>
            <th>Premie</th>
            <th>Vinnere totalt</th>
            <th>Utbetalt totalt</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ name, winners, totalValue }) => (
            <tr key={name}>
              <td><strong>{name}</strong></td>
              <td>{winners.toLocaleString('nb-NO')}</td>
              <td style={{ color: 'var(--text-muted)' }}>
                {totalValue > 0 ? `${formatNOK(totalValue)} kr` : '–'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── section: Norwegian borough winners ───────────────────────────────────────

function NorwegianWinners({ data }: Props) {
  const counts: Record<string, number> = {};
  for (const draw of data) {
    for (const m of draw.merchandise || []) {
      if (m.borough) counts[m.borough] = (counts[m.borough] || 0) + 1;
    }
  }

  const ranked = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (ranked.length === 0) return null;

  const maxCount = ranked[0][1];

  return (
    <div className="card">
      <SectionTitle>Flest norske gevinster per kommune</SectionTitle>
      <p style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
        Basert på alle norske gevinster registrert i perioden.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {ranked.map(([borough, count], i) => (
          <div key={borough} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '8rem', fontSize: '0.875rem', fontWeight: 500, flexShrink: 0 }}>
              {borough}
            </span>
            <div style={{ flex: 1, background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${(count / maxCount) * 100}%`,
                  background: i === 0 ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.35)',
                  borderRadius: 99,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
            <span style={{ width: '2rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── main dashboard ────────────────────────────────────────────────────────────

export default function Dashboard({ data }: Props) {
  return (
    <>
      <Summary data={data} />
      <FrequencyCharts data={data} />
      <NumberTables data={data} />
      <div className="two-col">
        <StarNumberTable data={data} />
        <NorwegianWinners data={data} />
      </div>
      <PrizeStats data={data} />
    </>
  );
}
